({
    baseUrl: "../../static",
    paths: {
        'knockout':     'bower_components/knockout/dist/knockout',
        'jquery':       'bower_components/jquery/dist/jquery.min',
        'notifyjs':     'bower_components/notifyjs/dist/notify.min', 
        'text':         'bower_components/requirejs-text/text' 
    },
    shim: {
        'notifyjs': {
            deps: ['jquery']
        },
        'datatables': {
            deps: ['jquery']
        }
    },
    packages:[],
    name: "main-debug",
    out: "../main-built.js"
})