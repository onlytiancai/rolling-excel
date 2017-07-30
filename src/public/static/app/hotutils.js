define(function (require) {
  var Handsontable = require('handsontable.full');
  require('css!handsontable.full');

  var utils = require('./utils');
  var byString = utils.byString;


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
