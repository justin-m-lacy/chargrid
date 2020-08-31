import {CharGrid} from '../core/chargrid';
import { SearchOpts } from './searchopts';
import { Puzzle } from '../core/puzzle';
import { TYPE_WORDSEARCH } from '../consts';
import { RangeKey } from '../core/range';

export class WordSearch extends Puzzle {

	toJSON(){

		let obj = super.toJSON();

		// words stored in chargrid.
		obj.words = this.words;

		return obj;

	}

	/**
	 * @property {string[]} words - words already placed in wordsearch.
	 */
	get words(){return this._words}
	set words(v){this._words=v;}

	/**
	 * @property {Map<string,string>} placed - maps position keys to objects
	 * placed in the grid.
	 * Used to stop repeated new words in invalid positons by preventing duplicate keys.
	 * In wordsearches this means identical words being placed in identical positions,
	 * in crosswords it means words with the same orientation overlapping each other.
	 */
	get placed(){return this._placed;}

	constructor( rows=10, cols=10 ) {

		super();

		this.type = TYPE_WORDSEARCH;

		if ( typeof rows === 'number') {
			this.initGrid( rows, cols );
		} else if ( rows != null && typeof rows === 'object' ) {
			this.revive(rows);
		}
		// Vue reactivity.
		if (!this.words) this.words = null;

	}

	/**
	 * Revive from json.
	 */
	revive( json ){

		if ( json.opts ) this.opts = new SearchOpts(json.opts);

		super.revive(json);
		if ( json.words ) this._words = json.words;

		if ( json.grid ) this.initGrid( json.grid );
		else throw new Error('Missing wordsearch grid.');


	}
	setPlace( word, place ) {

		this._words.push(word);
		let len = word.length-1;
		this._placed.set( RangeKey( place.row, place.col, place.row+len*place.dr, place.col+len*place.dc) );

	}

	canPlace( word, r, c, dr, dc ) {

		let len = word.length-1;
		return this._placed.has( RangeKey(r,c, r+len*dr, c+len*dc ) );
	}

	has( w ){ return this.words.includes(w); }

}