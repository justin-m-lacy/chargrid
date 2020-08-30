import { Builder, NoDiagonals, AllDirs } from "./builder";
import { WordSearch } from "../wordsearch/wordsearch";
import { SearchOpts } from "../wordsearch/searchopts";
import {  isEmpty, NonWord } from "../util/charutils";
import { CASE_LOWER, CASE_UPPER, LowerChars } from "../consts";

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
		//this.grid.clearRanges();

		this._placeWords( words, this.grid );

		this.fillEmpty();

		super.build();

		return this.puzzle;

	}

	/**
	 * Prepare words before being added.
	 * @param {string[]} words
	 */
	prepareWords( words, opts ) {

		for( let i = words.length-1; i>= 0; i--) {

			let w = words[i];
			if (!opts.noTrim) w = w.trim();
			if ( opts.forceCase === CASE_LOWER ) {
				w = w.toLocaleLowerCase();
			} else if ( opts.forceCase === CASE_UPPER ) {
				w = w.toLocaleUpperCase();
			}
			if ( !opts.allowNonword ) {
				w = w.replace( NonWord, '' );
			}

			words[i] = w;

		}

		return words;

	}

	/**
	 * Fill empty spaces with random characters.
	 */
	fillEmpty() {

		let chars = this.grid.chars;
		let filler = this.opts.filler || LowerChars;

		if ( this.opts.forceCase === CASE_LOWER ) filler = filler.toLocaleLowerCase();
		else if ( this.opts.forceCase === CASE_UPPER ) filler = filler.toLocaleUpperCase();

		let cols = this.cols;
		let rows = this.rows;

		for( let r = 0; r < rows; r++ ) {

			let a = chars[r];
			for( let c = 0; c < cols; c++ ) {

				if ( !isEmpty(a[c])) continue;
				a[c] = filler[ Math.floor( filler.length*Math.random() ) ];

			}

		}

	}

	_placeWords( words ){

		let unused = [];
		let placed = this._puzzle.words = [];

		let dirs = this.opts.noDiagonal ? NoDiagonals : AllDirs;
		if ( !this.opts.noReverse ) {

			// add reverse directions. TODO: this doesn't allow a reverse rate.
			dirs = dirs.concat( dirs.map(obj=>{
				return {dr:-obj.dr, dc:-obj.dc}
			}) );
		}

		for( let i = words.length-1; i >= 0; i-- ) {

			let w = words[i];

			if ( !this.placeBest( w, dirs ) ) {
				unused.push( w );
			} else {
				placed.push( w );
			}
		}

		this.unused = unused;

	}

}