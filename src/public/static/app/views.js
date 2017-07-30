define(function (require) {

  var Backbone = require('backbone');
  var Mustache = require('mustache');
  var listTpl = require("text!./views/list.html!strip");

  var ListView = Backbone.View.extend({
    initialize: function(options) {
      this.el = options.el;
      this.books = options.books;
      this.listenTo(this.books, "reset", this.render);
    },

    render: function() {
      this.$el.html(Mustache.render(listTpl, this.books.toJSON()));
    },

  });

  return {
    ListView: ListView,
  }

});
