import {WordSearch} from './wordsearch';
import {WordState} from '../wordstate';
import { reverse } from '../util/charutils';

/**
 * Combines game state information with base wordsearch game.
 */
export class SearchGame {

	toJSON(){

		return {
			puzzle:this._puzzle,
			states:this._states,
			time:this.time
		}

	}

	/**
	 * @property {WordSearch} puzzle - wordsearch puzzle.
	 */
	get puzzle(){return this._puzzle }

	/**
	 * @property {WordSearch} grid - wordsearch grid.
	 */
	get grid(){return this._puzzle.grid; }

	/**
	 * @property {Object<string,WordState>} states - States of each word, position found,etc.
	 * Simple object is used for Vue reactivity.
	 */
	get states(){return this._states}

	/**
	 * @property {number} [time=0] - time taken in millseconds.
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
	 * @param {WordSearch|object} [vars=null] - WordSearch or json save object.
	 */
	constructor( vars=null ){

		/**
		 * Vue reactivity.
		 */
		this._states = null;
		this._remaining = 0;
		this._time = 0;
		this._puzzle = null;


		if (vars ) {

			// restore from JSON
			this._puzzle = new WordSearch( vars.puzzle );
			this.reviveStates( vars.states );

			time = Number( vars.time || 0 );

		}

	}

	setPuzzle( ws ) {

		this._puzzle = ( ws instanceof WordSearch ) ? ws : new WordSearch(ws);
		this.time = 0;
		this._states = this.makeStates(this._puzzle);
		this._remaining = 0;
	}

	/**
	 *
	 * @param {Range} range
	 * @returns {boolean} true if selection is an unused, valid word match.
	 */
	tryMatch( range ) {

		let word = this.grid.readWord(range);

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

	reviveStates( states ){

		// todo: fix errors compared to grid?

		for( let p in states ) {

			states[p] = new WordState( states[p] );

		}

	}

	makeStates( puzzle ){

		this._remaining = 0;

		let states = {};

		let searchWords = puzzle.words;
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