// JS Imports
import Vue from "vue";

// Vue.config.debug = true;

// CSS Imports
import "./main.css!";
import "jspm_packages/npm/font-awesome@4.5.0/css/font-awesome.min.css!";


// for dynamically scaling elements put element height calculations here
function set_heights() {
	// get clients window size
	var height = document.body.clientHeight,
    	 width = document.body.clientWidth;

    // console.log('height: ' + height);
    // console.log('width: '  + width);
};

// app states (change labels here for what displays on screen for each state)
var states = {
	go: 'go',
	finished: 'finished',
	fail: 'fail'
}

var app = new Vue({
	el: 'body',
	data: {
		time_limit : 10000,
		deltas     : [],
		last_tap   : null,
		timer      : null,
		state      : states.go,
		high_score : 0
	},
	computed: {
		score() {
			return this.deltas.length;
		},
		invert_tap() {
			return (this.score % 2) || this.state != states.finished;
		},
		state_label() {
			return this.state.charAt(0).toUpperCase() + this.state.slice(1); // capitalise state
		},
		show_refresh() {
			return (this.state != states.go);
		}
	},
	watch: {
		score() {
			this.high_score = this.score > this.high_score ? this.score : this.high_score;
		}
	},
	methods: {
		refresh() {
			this.deltas = [];
			this.state  = states.go;
		},
		tap() {
			// check if game has finished
			if( this.state == states.finished || this.state == states.fail ) return;

			// get timestamp
			var now = Date.now();

			// check the score (game starts if score is 0)
			if( this.score == 0 ) {
				// begin timer
				this.timer = setTimeout( 
					() => { this.state = states.finished }, 
					this.time_limit
				);

				// init
				this.deltas.push(0);
				this.last_tap = now;
				return;
			}

			// parse tap
			var delta = now - this.last_tap, 
				 pass = delta > this.deltas[this.score-1];

			if(pass) {
				// level up
				this.deltas.push(delta);
				this.last_tap = now;
			}
			else {
				// fail
				clearTimeout( this.timer );
				this.state = states.fail;
			}
		}
	},
	ready() {
		// setup binding for window resize event
        window.onresize = set_heights;

        // call once manually
        set_heights();
	}
});

window.app = app;