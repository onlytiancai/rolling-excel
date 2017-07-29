define(function (require) {
    var Backbone = require('backbone');
    var WorkBook = Backbone.Model.extend();
    return Backbone.Collection.extend({
        url: '/workbooks/',
        model: WorkBook
    });
});
