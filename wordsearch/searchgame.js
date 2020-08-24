import {WordSearch} from './wordsearch';
import {WordState} from '../wordstate';
import { reverse } from '../util/charutils';

/**
 * Combines game state information with base wordsearch game.
 */
export class SearchGame {

	toJSON(){

		return {
			grid:this._grid,
			states:this._states,
			time:this.time
		}

	}

	/**
	 * @property {WordSearch} grid - wordsearch grid.
	 */
	get grid(){return this._grid }

	/**
	 * @property {Object<string,WordState>} states - States of each word, position found,etc.
	 * Simple object is used for Vue reactivity.
	 */
	get states(){return this._states}

	/**
	 * @property {number} time - time taken so far in millseconds.
	 * number is not a timestamp, since game can be paused.
	 */
	get time(){return this._time;}
	set time(v){this._time=v}

	/**
	 * @property {number} remaining - count of all words remaining.
	 */
	get remaining(){return this._remaining;}

	/**
	 * @property {number} wordsTotal - total words in search.
	 */
	get wordsTotal(){return this._grid.words.length; }

	/**
	 *
	 * @param {WordSearch|object} vars - WordSearch or json save object.
	 */
	constructor( vars=null ){

		if ( vars instanceof WordSearch ) {

			this._grid = vars;
			this._remaining = 0;

			this._states = this.makeStates( vars );

			this.time = 0;

		} else {

			// restore from JSON
			this._grid = new WordSearch( vars.wordsearch );
			this.reviveStates( this._grid, vars.states );

			time = Number( vars.time || 0 );


		}

	}

	/**
	 *
	 * @param {Range} range
	 * @returns {boolean} true if selection is an unused, valid word match.
	 */
	tryMatch( range ) {

		let word = this._grid.readWord(range);

		let state = this._states[word];
		if ( !state ) {
			word = reverse(word);
			state = this._states[word];
			if ( !state) return false;
		}

		if ( state.tryAdd(range) ) {
			this._remaining--;
			return true;
		}
		return false;

	}

	reviveStates( grid, states ){

		// todo: fix errors compared to grid?

		for( let p in states ) {

			states[p] = new WordState( states[p] );

		}

	}

	makeStates( grid ){

		this._remaining = 0;

		let states = {};

		let searchWords = grid.words;
		for( let p of searchWords ) {

			let s = states[p];
			if ( s ) {
				s.remaining++;
			} else {
				//console.log('init state: ' + p );
				states[p] = new WordState();
			}
			this._remaining++;

		}

		return states;

	}

}