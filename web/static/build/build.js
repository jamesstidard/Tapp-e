({
    baseUrl: "../../static",
    paths: { 
        'text':               'bower_components/requirejs-text/text',
        'augment':            'bower_components/augment.js/augment',
        'knockout':           'bower_components/knockout/dist/knockout',
        "knockout-sortable":  'bower_components/knockout-sortable/build/knockout-sortable',
        'jquery':             'bower_components/jquery/dist/jquery.min',
        "jquery-ui" :         'bower_components/jquery-ui/ui',
        'notifyjs':           'bower_components/notifyjs/dist/notify.min',
        'utilise-js':         'bower_components/utilise-js/src'
    },
    shim: {
        'notifyjs': {
            deps: ['jquery']
        }
    },
    packages:[
        {
            name: 'content-panel',
            location: 'components/content-panel'
        }
    ],
    name: "main-debug",
    out: "../main-built.js"
})