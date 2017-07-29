define(function (require) {
    var WorkBooks = require('./workbook');
    var books = new WorkBooks();
    books.fetch({
      success: function(){

        books.once("add", function(newbook) {
          newbook.fetch();

          newbook.save(
            {'title': '6666'},
            {
            success: function() {
              console.log('save ok');
              newbook.destroy();  
            }  
          });

        });

      books.create({
        title: 555
      }, {wait: true});
    }  
  });
});
