import { Builder } from "./builder";
import { WordSearch } from "../wordsearch/wordsearch";
import { SearchOpts } from "../wordsearch/searchopts";

export class SearchBuilder extends Builder {

	constructor( opts=null, puzzle=null ){

		super( opts || new SearchOpts(), puzzle || new WordSearch() );

		this.unused=[];

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

		// clear word list before placing new words.
		this.puzzle.words = [];

		this._placeWords( words, this.grid );

		this.fillEmpty();

		super.build();

		return this.puzzle;

	}

	_placeWords( words ){

		let unused = [];

		for( let i = words.length-1; i >= 0; i-- ) {

			let w = words[i];

			if ( !this.tryPlace( w ) ) {
				unused.push( w );
			} else {
				this._puzzle.words.push( w );
			}
		}

		this.unused = unused;

	}

}