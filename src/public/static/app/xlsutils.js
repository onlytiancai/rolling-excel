define(function (require) {
  require('Blob');
  require('FileSaver');

  var utils = require('./utils');
  var byString = utils.byString;
  var rgbToHex = utils.rgbToHex;

  /* processing array buffers, only required for readAsArrayBuffer */
  function fixdata(data) {
    var o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
    return o;
  }

  var rABS = true; // true: readAsBinaryString ; false: readAsArrayBuffer

  function read_file(f, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = e.target.result;

      var workbook;
      if(rABS) {
        /* if binary string, read with type 'binary' */
        workbook = XLSX.read(data, {type: 'binary', cellStyles: true, cellDates: true});
      } else {
        /* if array buffer, convert to base64 */
        var arr = fixdata(data);
        workbook = XLSX.read(btoa(arr), {type: 'base64', cellStyles: true, cellDates: true});
      }
      callback(null, workbook);
    };

    reader.readAsBinaryString(f);
  }

  function get_hotdata(workbook) {
    var sheet_name_list = workbook.SheetNames;
    var worksheet = workbook.Sheets[sheet_name_list[0]];
    console.log(worksheet);

    var ref = XLSX.utils.decode_range(worksheet['!ref']);
    var max_col = ref.e.c + 1, max_row = ref.e.r + 1;

    for (z in worksheet) {
        /* all keys that do not begin with "!" correspond to cell addresses */
        if(z[0] === '!') continue;

        var cell = XLSX.utils.decode_cell(z);

        console.log(z + "=" + JSON.stringify(worksheet[z].v));
    }

    console.log('max_col=', max_col, 'max_row=', max_row);

    var table = [];
    for (var i = 0; i < max_row; i++) {
        var row = [];
        for (var j = 0; j < max_col; j++) {
            row.push(''); 
        }
        table.push(row);
    }
    console.table(table);

    for (z in worksheet) {
        if(z[0] === '!') continue;
        var cell = XLSX.utils.decode_cell(z);
        var col = cell.c;
        var row = cell.r;
        if (worksheet[z].w) {
            var txt = worksheet[z].w;
            txt = txt.replace(/&#10;/g,'\n'); 
            table[row][col] = txt;  
        } else {
            table[row][col] = '';
        }
    }
    console.table(table);

    var merges = worksheet['!merges'];
    var mergeCells = true;
    if (merges) {
        var mergeCells = merges.map(function(x) {
            return {row: x.s.r, col: x.s.c, rowspan: x.e.r - x.s.r + 1, colspan: x.e.c - x.s.c + 1};
        });
    }
    console.table(mergeCells);

    var colWidths = worksheet['!cols'] ? worksheet['!cols'].map(function(x) {return x.wpx  }) : undefined;

    return {
      worksheet: worksheet,
      table: table,
      mergeCells: mergeCells,
      colWidths: colWidths,
    };

  }

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  function sheet_from_array_of_arrays(hot, data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
      for(var C = 0; C != data[R].length; ++C) {
        if(range.s.r > R) range.s.r = R;
        if(range.s.c > C) range.s.c = C;
        if(range.e.r < R) range.e.r = R;
        if(range.e.c < C) range.e.c = C;
        var cell = {v: data[R][C] };
        if(cell.v == null) continue;
        var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

        if(typeof cell.v === 'number') cell.t = 'n';
        else if(typeof cell.v === 'boolean') cell.t = 'b';
        else if(cell.v instanceof Date) {
          cell.t = 'n'; cell.z = XLSX.SSF._table[14];
          cell.v = datenum(cell.v);
        }
        else cell.t = 's';

        var elem = hot.getCell(R, C, false);
        if (elem) {
          cell.s = {};
          if (byString(elem, 'style.backgroundColor')) cell.s.fill = {fgColor: {rgb: rgbToHex(elem.style.backgroundColor)}};

          cell.s.alignment = {};
          if (byString(elem, 'vAlign')) cell.s.alignment.vertical = elem.vAlign;
          if (byString(elem, 'style.textAlign')) cell.s.alignment.horizontal= elem.style.textAlign;

          cell.s.font = {};
          if (byString(elem, 'style.color')) cell.s.font.color = {rgb: rgbToHex(elem.style.color)};
          if (byString(elem, 'style.fontWeight')) cell.s.font.bold = elem.style.fontWeight == 'bold';
          if (byString(elem, 'style.fontStyle'))  cell.s.font.italic = elem.style.fontStyle== 'italic';
          if (byString(elem, 'style.fontFamily')) cell.s.font.name = elem.style.fontFamily;
          if (byString(elem, 'style.fontSize')) cell.s.font.sz = elem.style.fontSize.replace(/[^0-9]/g, '');
          if (byString(elem, 'style.textDecoration')) cell.s.font.underline = true;
        }

        ws[cell_ref] = cell;
      }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
  }

  function Workbook() {
      if(!(this instanceof Workbook)) return new Workbook();
      this.SheetNames = [];
      this.Sheets = {};
  }

  function save_to(hot) {
    var ranges = hot.mergeCells.mergedCellInfoCollection.map(function(x) {
        return {s: {r: x.row, c: x.col}, e: {r: x.row + x.rowspan - 1, c: x.col + x.colspan -1}};
    });

    /* original data */
    var data = hot.getData(); 

    var ws_name = "SheetJS";
    console.table(data); 

    var wb = new Workbook(), ws = sheet_from_array_of_arrays(hot, data);

    /* add ranges to worksheet */
    ws['!merges'] = ranges;

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});

    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx") 
  }

  return {
    read_file: read_file,
    get_hotdata: get_hotdata,
    save_to: save_to,
  };
});
