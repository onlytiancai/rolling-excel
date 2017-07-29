requirejs.config({
    baseUrl: '/static/lib',
    paths: {
        app: '../app',
        jquery: 'jquery-1.11.0'
    }
});

requirejs(['app/main']);
