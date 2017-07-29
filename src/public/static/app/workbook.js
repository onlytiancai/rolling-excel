define(function (require) {
    var Backbone = require('backbone');
    var WorkBook = Backbone.Model.extend({
      idAttribute: "uuid"  
    });
    return Backbone.Collection.extend({
        url: '/workbooks/',
        model: WorkBook
    });
});
