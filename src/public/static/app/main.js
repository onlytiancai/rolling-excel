define(function (require) {
  var models = require('./models');
  var views = require('./views');

  var books = new models.WorkBooks();
  var listView = new views.ListView({el: $('.main'), books: books});

    books.fetch({
      reset: true,
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

