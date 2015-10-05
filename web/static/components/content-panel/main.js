define([
		"jquery",
		"knockout",
		"text!./main-tmpl.html"
	],
	function($, ko, main_tmpl){

		function ContentPanel(params){
			this.app = params.app;

			this.time_limit = ko.observable(10000);
			this.deltas     = ko.observableArray();
			this.last_tap   = ko.observable();
			this.timer      = ko.observable();
			this.finished   = ko.observable('Go');
			this.high_score = ko.observable(0);

			this.score = ko.computed(function(){
				return this.deltas().length;
			},this);

			this.invert_tap = ko.computed(function(){
				return (this.score() % 2) || this.finished() != 'Go';
			},this);

			this.state = ko.computed(function() {
				return this.finished().toLowerCase();
			},this);

			this.finished.subscribe(function(value){
				if( value != 'Go' && this.score() > this.high_score() ) {
					this.high_score( this.score() );
				}
			},this);
		}

		ContentPanel.prototype.init = function() {
			// setup binding for window resize event
            $(window).bind( "resize."+this.panel_name, this.set_heights.bind(this) );
            // call once manually
            this.set_heights();

            // stop loading screen
	        this.app.loading(false);
		};

		ContentPanel.prototype.dispose = function() {
			// unbind from window resizing
            $( window ).unbind("resize."+this.panel_name);

            // start loading screen
	        this.app.loading(true);
		};

		ContentPanel.prototype.set_heights = function() {
			// for dynamically scaling elements put element height calculations here
            var panel          = $("#content-panel"),
                panel_height   = panel.outerHeight(),
                window_height  = $(window).height();

            // console.log('panel_height: ' + panel_height);
            // console.log('panel_height: ' + window_height);
		};

		ContentPanel.prototype.refresh = function() {
			this.deltas([]);
			this.finished('Go');
		};

		ContentPanel.prototype.tap = function() {
			// check if game has finished
			if( this.finished() == 'Finished' || this.finished() == 'Fail' ) {
				return;
			}

			// get timestamp
			var now = Date.now();

			if( this.score() == 0 ) {
				// begin timer
				this.timer( setTimeout( 
					this.finished.bind(this, 'Finished'), 
					this.time_limit() 
				));

				// init
				this.deltas.push(0);
				this.last_tap( now );
				return;
			}

			// parse tap
			var delta = now - this.last_tap(), 
				pass  = delta > this.deltas()[this.score()-1];

			if(pass) {
				// level up
				this.deltas.push(delta);
				this.last_tap( now );
			}
			else {
				// fail
				clearTimeout( this.timer() );
				this.finished('Fail');
			}
		};

		ContentPanel.prototype.tap_mobile = function(data, event) {
			this.tap();
			event.preventDefault();
		};

		return {
			template: main_tmpl,
			viewModel: ContentPanel
		};
	}
);