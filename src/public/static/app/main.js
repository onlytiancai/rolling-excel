define(function (require) {
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

