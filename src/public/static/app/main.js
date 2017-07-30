define(function (require) {
  var Backbone = require('backbone');
  var views = require('./views');

  var Workspace = Backbone.Router.extend({

    routes: {
      "":                   "index",
      "detail/:id":         "detail",
    },

    index: function() {
      this.loadView(new views.ListView({container: $('.main')}));
    },

    detail: function(id) {
      this.loadView(new views.DetailView({container: $('.main'), id: id}));
    },

    loadView : function(view) {
      this.view && (this.view.close ? this.view.close() : this.view.remove());
      this.view = view;
    }

  });

  new Workspace();
  Backbone.history.start();

});

