import { longest } from '../util/charutils';
import { randInt } from "../util/util";

import { Builder } from "./builder";
import { WordSearch } from "../wordsearch/wordsearch";
import { SearchOpts } from "../wordsearch/searchopts";

export class SearchBuilder extends Builder {

	constructor( opts=null ){

		super( opts || new SearchOpts() );

	}

	/**
	 * Attempt to place all listed words in the grid.
	 * @param {string[]} words
	 * @returns {string[]} list of words that couldn't be placed.
	 */
	build( words ) {

		if ( !Array.isArray(words) ) throw new Error('Words must be array.');

		// fit large words first.
		words = words.concat().sort((a,b)=>a.length-b.length);
		this.prepareWords( words, this.opts );

		this.grid = this.createGrid( words );

		console.log('placing words');
		this._placeWords( words, this.grid );

		this.fillEmpty();

		return this.grid;

	}

	_placeWords( words, grid ){

		let unused = [];

		for( let i = words.length-1; i >= 0; i-- ) {

			let w = words[i];

			if ( !this.tryPlace( w ) ) {
				unused.push( w );
			} else {
				grid.words.push( w );
			}
		}

		this.unused = unused;
		console.log('unused: ' + unused.length );

	}

	/**
	 * Create grid of appropriate size.
	 */
	createGrid( words ){

		let opts = this.opts;

		let rows = opts.rows;
		let cols = opts.cols;

		let maxWord = longest( words );

		if ( !rows ) {

			if ( opts.minRows && opts.maxRows ) rows = randInt( opts.minRows, opts.maxRows );
			else if ( opts.minRows ) rows = opts.minRows;
			else if ( opts.maxRows ) rows = opts.maxRows;
			else rows = maxWord;

		}
		if ( !cols ) {

			if ( opts.minCols && opts.maxCols ) cols = randInt( opts.minCols, opts.maxCols );
			else if ( opts.minCols ) cols = opts.minCols;
			else if ( opts.maxCols ) cols = opts.maxCols;
			else cols = maxWord;

		}

		let search = new WordSearch( rows, cols );
		search.opts = this.opts;

		this.rows = rows;
		this.cols = cols;

		return search;

	}

}