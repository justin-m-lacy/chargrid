import {WordSearch} from './wordsearch';
import {WordState} from '../wordstate';

/**
 * Combines game state information with base wordsearch game.
 */
export class SearchGame {

	toJSON(){

		return {
			grid:this._grid,
			state:this._state,
			time:this.time
		}

	}

	get grid(){return this._grid}

	/**
	 * @property {WordState[]} states - States of each word, position found,etc.
	 */
	get states(){return this._states}

	/**
	 * @property {number} time - time taken so far in millseconds.
	 * number is not a timestamp, since game can be paused.
	 */
	get time(){return this._time;}
	set time(v){this._time=v}

	constructor( vars=null ){

		if ( vars instanceof WordSearch ) {

			this._grid = vars;

		} else {

			// restore from JSON
			this._grid = new WordSearch( vars.wordsearch );


		}

	}

	initWords( grid ){

		this.foundCount = 0;

		let words = [];

		let searchWords = grid.words;
		for( let p of searchWords ) {

			//this.words[p] = new WordState(p, i++);
			words.push( new WordState(p) );

		}

		this._states = words;

		return words;

	}

}