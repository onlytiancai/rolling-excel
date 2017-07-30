define(function (require) {
  require('xlsx.core.min'); // 全局XLSX可用， https://github.com/SheetJS/js-xlsx/blob/master/demos/requirejs/requirejs.js

  var Backbone = require('backbone');
  var views = require('./views');

  var Workspace = Backbone.Router.extend({

    routes: {
      "":                   "index",
      "detail/:id":         "detail",
    },

    index: function() {
      new views.ListView({el: $('.main')});
    },

    detail: function(id) {
      new views.DetailView({el: $('.main'), id: id});
    }

  });

  new Workspace();
  Backbone.history.start();

});

