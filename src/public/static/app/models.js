define(function (require) {
  var Backbone = require('backbone');

  var WorkBook = Backbone.Model.extend({
    idAttribute: "uuid"  
  });

  var WorkBooks = Backbone.Collection.extend({
      url: '/workbooks/',
      model: WorkBook
  });


  return {
    WorkBook: WorkBook,
    WorkBooks: WorkBooks,    
  };

});
