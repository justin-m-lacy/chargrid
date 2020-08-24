import { Builder } from "./builder";
import { WordSearch } from "../wordsearch/wordsearch";

export class SearchBuilder extends Builder {

	constructor(){

		super();

	}

	/**
	 * Attempt to place all listed words in the grid.
	 * @param {string[]} words
	 * @returns {string[]} list of words that couldn't be placed.
	 */
	build( words ) {

		let grid = this.createGrid();

		this._placeWords( words, grid );

		this.fillEmpty();

		this.grid = grid;
		return this.grid;

	}

	_placeWords( grid ){

		if ( !Array.isArray(words) ) throw new Error('Words must be array.');

		// fit large words first.
		let arr = words.concat().sort((a,b)=>a.length-b.length);

		let unused = [];

		this.prepareWords( arr, this.opts );

		for( let i = arr.length-1; i >= 0; i-- ) {

			let w = arr[i];

			if ( !grid.placeWord( w ) ) {
				unused.push( w );
			} else {
				grid.words.push( w );
			}
		}

		this.unused = unused;

	}

	/**
	 * Create grid of appropriate size.
	 */
	createGrid(){

		let search = new WordSearch( this.rows, this.cols );

		return search;

	}

}