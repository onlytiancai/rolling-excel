define(function (require) {

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
        workbook = XLSX.read(data, {type: 'binary'});
      } else {
        /* if array buffer, convert to base64 */
        var arr = fixdata(data);
        workbook = XLSX.read(btoa(arr), {type: 'base64'});
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
      merges: merges,
      colWidths: colWidths,
    };

  }

  return {
    read_file: read_file,
    get_hotdata: get_hotdata,
  };
});
