define(function (require) {
    var WorkBooks = require('./workbook');
    var books = new WorkBooks();
    books.fetch();

    books.on("add", function(book) {
      console.log(book.toJSON());
    });

    var newbook = books.create({
      title: 555  
    }, {wait: true});

    newbook.set({
      id: 666,
      title: 6666
    })
    newbook.save();
});
