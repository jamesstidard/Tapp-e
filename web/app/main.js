// JS Imports
import Vue from "vue"
import Firebase from "firebase"

// Vue.config.debug = true;

// CSS Imports
import "./main.css!"
// import "jspm_packages/npm/font-awesome@4.5.0/css/font-awesome.min.css!"

var Highscores = new Firebase("https://tapp-e.firebaseio.com/highscores")

// map object from firebase to highscore
function score_from_snap(snap) {
	return {
		uid:   snap.key(),
		name:  snap.val().name,
		value: snap.val().value
	}
}

// for dynamically scaling elements put element height calculations here
function set_heights() {
	// get clients window size
	var height = document.body.clientHeight,
    	 width = document.body.clientWidth;

    // console.log('height: ' + height);
    // console.log('width: '  + width);
}

// app states and globals (change labels here for what displays on screen for each state)
var ranks = 10;
var states = {
	go: 'go',
	fail: 'fail',
	finished: 'finished',
	loading: 'connecting',
	loaded: 'connected'
}

var app = new Vue({
	el: 'body',
	data: {
		user 		: null,
		time_limit  : 10000,
		deltas      : [],
		last_tap    : null,
		timer       : null,
		state       : states.go,
		high_score  : 0,
		high_scores : [],
		my_entry 	: null
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
		},
		rankings() {
        	return this.high_scores.sort( (a,b) => b.value-a.value );
		}
	},
	watch: {
		score() {
			// capture last highscore
			var last_highscore = this.high_score;

			// set local highscore
			this.high_score = this.score > this.high_score ? this.score : this.high_score;

			// add to highscores
			if(this.user) {
				if(this.my_entry) {
					// update score for this session
					Highscores.child(this.my_entry).update({value: this.score});
				}
				else if(this.my_entry == null) {
					// add score to rankings
					this.my_entry = Highscores.push({ name: this.user, value: this.score }).key();
				}
			}
		}
	},
	methods: {
		refresh() {
			// reset values
			this.deltas   = [];
			this.state    = states.go;
			this.my_entry = null;

			// clear timer
			if(this.timer) clearTimeout( this.timer );
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

        // prepare high score list
        var highscore_query = Highscores.orderByChild("value").limitToLast(ranks);

        highscore_query.on("child_added", (snap) => {
        	// add new child to highscore list and sort
        	var score = score_from_snap(snap);
        	this.high_scores.push(score);
        });

        highscore_query.on("child_removed", (snap) => {
        	// get the index of the removed item
        	var key   = snap.key();
        	var place = this.high_scores.findIndex( score => score.uid == key );

        	// splice at index to remove score
        	this.high_scores.splice(place,1);
        });

        highscore_query.on("child_changed", (snap) => {
        	// get the index of the changed item
        	var place = this.high_scores.findIndex( score => score.uid == snap.key() );

        	// change values of score
        	var score = score_from_snap(snap);
        	this.high_scores.$set(place, score);
        });
	}
});

// assign to window
window.app = app;
