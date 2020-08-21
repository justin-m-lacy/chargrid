import {CharGrid} from '../chargrid';

export class WordSearch extends CharGrid {

	toJSON(){

	}

	/**
	 * @property {Word[]} words - words already placed in wordsearch.
	 */
	get words(){return this._words}
	set words(v){this._words=v;}

	constructor( rows=10, cols=10 ){

		super( rows, cols );

		this._words = new Map();

	}

	/**
	 * Attempt to place all listed words in the grid.
	 * @param {string[]} words
	 * @returns {string[]} list of words that couldn't be placed.
	 */
	placeWords( words ) {

		//console.time( testName );

		if ( !Array.isArray(words) ) throw new Error('Words must be array.');

		// fit large words first.
		let arr = words.concat().sort((a,b)=>a.length-b.length);
		let unused = [];

		for( let i = arr.length-1; i >= 0; i-- ) {

			if ( !this.placeWord( arr[i] ) ) {
				unused.push(arr[i]);
			}
		}

		//console.timeEnd( testName );

		console.log('Words Unused: ' + unused.length );

		return unused;

	}

	/**
	 * Place all words from list and fill empty spaces
	 * with random letters.
	 * @param {string[]} words
	 * @returns {string[]} list of words that couldn't be placed.
	 */
	placeAndFill( words ) {

		// empty current letters.
		this.fillAll();

		let unused = this.placeWords(words);

		this.fillEmpty();

		return unused;

	}

	addToWordList(w){

		this._words[w.word] = w;

	}

}