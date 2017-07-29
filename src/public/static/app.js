requirejs.config({
    baseUrl: '/static/lib',
    paths: {
        app: '../app'
    }
});

requirejs(['app/main']);
