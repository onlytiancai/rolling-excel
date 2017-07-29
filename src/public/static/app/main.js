define(function (require) {
    var messages = require('./message');

    var print = require('print');

    print(messages.getHello());
});
