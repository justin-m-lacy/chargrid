import {CharGrid} from '../chargrid';

export class WordSearch extends CharGrid {

	/**
	 * @property {Word[]} words - words already placed in wordsearch.
	 */
	get words(){return this._words}
	set words(v){this._words=v;}

	constructor( rows, cols ){

		super( rows, cols );

		this._words = new Map();

	}

	/**
	 * Attempt to place all listed words in the grid.
	 * @param {string[]} words
	 * @returns {string[]} list of words that couldn't be placed.
	 */
	placeWords( words ) {

		if ( !Array.isArray(words) ) throw new Error('Words must be array.');

		let unused = [];

		for( let i = words.length-1; i >= 0; i-- ) {

			if ( !this.placeWord( words[i] ) ) {
				unused.push(words[i]);
			}
		}

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

		let unused = this.placeWords(words);

		this.fillEmpty();

		return unused;

	}

	addToWordList(w){

		this._words[w.word] = w;

	}

}