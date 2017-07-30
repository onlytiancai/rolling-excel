define(function (require) {

  var Backbone = require('backbone');
  var Mustache = require('mustache');
  var models = require('./models');
  var listTpl = require("text!./views/list.html!strip");

  var ListView = Backbone.View.extend({

    initialize: function(options) {
      this.el = options.el;
      this.books = new models.WorkBooks();
      this.listenTo(this.books, "reset", this.render);
      this.books.fetch({reset: true});
    },

    render: function() {
      this.$el.html(Mustache.render(listTpl, this.books.toJSON()));
    },

  });

  var DetailView = Backbone.View.extend({

    initialize: function(options) {
      this.el = options.el;
      this.model = new models.WorkBook({uuid: options.id}); 
      this.listenTo(this.model, "change", this.render);
      this.model.fetch();
    },

    render: function() {
      this.$el.html(JSON.stringify(this.model.toJSON()));
    },

  });


  return {
    ListView: ListView,
    DetailView: DetailView,
  }

});
