define(function (require) {
  require('xlsx.core.min');
  var Handsontable = require('handsontable.full');
  require('css!handsontable.full');

  //http://stackoverflow.com/questions/13712697/set-background-color-in-hex
  function rgbToHex(col)
  {
      if(col.charAt(0)=='r')
      {
          col=col.replace('rgb(','').replace(')','').split(',');
          var r=parseInt(col[0], 10).toString(16);
          var g=parseInt(col[1], 10).toString(16);
          var b=parseInt(col[2], 10).toString(16);
          r=r.length==1?'0'+r:r; g=g.length==1?'0'+g:g; b=b.length==1?'0'+b:b;
          var colHex='FF'+r+g+b;
          return colHex;
      }
  }

  // http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
  var byString = function(o, s) {
      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, '');           // strip a leading dot
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (k in o) {
              o = o[k];
          } else {
              return;
          }
      }
      return o;
  }

  function get_hot(container, hotdata) {
    var worksheet = hotdata.worksheet;

    function myRenderer(instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      var cell_index = XLSX.utils.encode_cell({c:col, r:row});

      var txt = td.innerHTML;
      txt = txt.replace(/ /g,'&nbsp;');
      td.innerHTML = txt;
      var cell = worksheet[cell_index];
      if (cell) {
        if (byString(cell, 's.font.color.rgb')) td.style.color = '#' + cell.s.font.color.rgb.substring(2, 8);
        if (byString(cell, 's.font.bold')) td.style.fontWeight = cell.s.font.bold ? 'bold': 'normal';
        if (byString(cell, 's.font.italic')) td.style.fontStyle = cell.s.font.italic ? 'italic' : 'normal';
        if (byString(cell, 's.font.name')) td.style.fontFamily = cell.s.font.name;
        if (byString(cell, 's.font.sz')) td.style.fontSize = cell.s.font.sz + 'pt';
        if (byString(cell, 's.font.underline')) td.style.textDecoration = cell.s.font.underline ? 'underline' : 'none';

        if (byString(cell, 's.alignment.vertical')) td.vAlign = cell.s.alignment.vertical;
        if (byString(cell, 's.alignment.horizontal')) td.style.textAlign = cell.s.alignment.horizontal;

        if (byString(cell, 's.fill.fgColor.rgb')) td.style.backgroundColor = '#' + cell.s.fill.fgColor.rgb.substring(2, 8);

        if (byString(cell, 's.border.top.style')) td.style.borderTopWidth = cell.s.border.top.style == 'medium' ? '2px' : '1px';
        if (byString(cell, 's.border.right.style')) td.style.borderRightWidth= cell.s.border.right.style == 'medium' ? '2px' : '1px';
        if (byString(cell, 's.border.bottom.style')) td.style.borderBottomWidth = cell.s.border.bottom.style == 'medium' ? '2px' : '1px';
        if (byString(cell, 's.border.left.style')) td.style.borderLeftWidth = cell.s.border.left.style == 'medium' ? '2px' : '1px';
        if (byString(cell, 's.border.top.color.rgb')) td.style.borderTopColor = '#' + cell.s.border.top.color.rgb.substring(2, 8);
        if (byString(cell, 's.border.right.color.rgb')) td.style.borderRightColor = '#' + cell.s.border.right.color.rgb.substring(2, 8);
        if (byString(cell, 's.border.bottom.color.rgb')) td.style.borderBottomColor = '#' + cell.s.border.bottom.color.rgb.substring(2, 8);
        if (byString(cell, 's.border.left.color.rgb')) td.style.borderLeftColor= '#' + cell.s.border.left.color.rgb.substring(2.8);

      }
    }


    var hot = new Handsontable(container, {
        data: hotdata.table,
        rowHeaders: true,
        colHeaders: true,
        manualColumnResize: true,
        manualRowResize: true,
        contextMenu: true,
        mergeCells: hotdata.mergeCells,
        colWidths: hotdata.colWidths,
        cells: function (row, col, prop) {
          var cellProperties = {};
          cellProperties.renderer = myRenderer;
          return cellProperties;
        }
    });
    return hot;
  }
  
  return {
    get_hot: get_hot,
  };
});
