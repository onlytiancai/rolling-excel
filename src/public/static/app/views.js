define(function (require) {

  var Backbone = require('backbone');
  var Mustache = require('mustache');

  var models = require('./models');
  var xlsutils = require('./xlsutils');
  var hotutils = require('./hotutils');

  var listTpl = require("text!./views/list.html!strip");
  var detailTpl = require("text!./views/detail.html!strip");

  var ListView = Backbone.View.extend({

    initialize: function(options) {
      options.container.html(this.el);
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
      options.container.html(this.el);
      this.model = new models.WorkBook({uuid: options.id}); 
      this.listenTo(this.model, "change", this.render);
      this.model.fetch();
    },

    render: function() {
      this.$el.empty();
      this.$el.html(Mustache.render(detailTpl, this.model.toJSON()));

      var hotdata = this.model.get('content'); 
      if (hotdata) {
        hotdata = JSON.parse(hotdata);
        this.hot = hotutils.get_hot(this.$('.main-table')[0], hotdata)
      }
    },

    events: {
      "change #file_upload":    "file_change",
      "click button.upload":    "upload",
      "click button.download":  "download",
      "click button.save":      "save"
    },

    upload: function() {
      this.$('#file_upload').click();
    },

    file_change: function(e) {
      var that = this;
      xlsutils.read_file(e.target.files[0], function(err, workbook) {
        if (err) return that.trigger('error', err);
        that.workbook = workbook;
        var hotdata = xlsutils.get_hotdata(workbook);
        that.model.set('content', JSON.stringify(hotdata));
      });
    },

    download: function() {
      if (!this.hot) return;
      xlsutils.save_to(this.hot);
    },

    save: function() {
      var workbook  = xlsutils.get_workbook(this.hot);
      var hotdata = xlsutils.get_hotdata(workbook);
      this.model.save('content', JSON.stringify(hotdata));
    },

  });


  return {
    ListView: ListView,
    DetailView: DetailView,
  }

});
