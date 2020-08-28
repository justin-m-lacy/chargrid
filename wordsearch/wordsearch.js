import {CharGrid} from '../core/chargrid';
import { SearchOpts } from './searchopts';
import { Puzzle } from '../core/puzzle';
import { TYPE_WORDSEARCH } from '../consts';

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

	constructor( rows=10, cols=10 ) {

		super();

		this.type = TYPE_WORDSEARCH;

		if ( typeof rows === 'number') {
			this.grid = new CharGrid( rows, cols );
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

		if ( json.grid ) this.grid = new CharGrid( json.grid );
		else throw new Error('Missing wordsearch grid.');


	}

	has( w ){

		return this.words.includes(w);
	}

}