import { BuildOps } from "./buildOps";
import {  reverse, isEmpty, NonWord, joinGrid } from "../util/charutils";
import { CASE_LOWER, CASE_UPPER, LowerChars, BLANK_CHAR, REVERSE_RATE } from "../consts";

/**
 * @class Builder - build a chargrid.
 */
export class Builder {

	get conflicts(){return this._conflicts;}
	set conflicts(v){this._conflicts=v}

	/**
	 * @property {CharGrid} grid - grid being built.
	 */
	get grid(){return this._grid;}
	set grid(v){this._grid=v}

	/**
	 * @property {string[][]} chars
	 */
	get chars(){return this._chars;}
	set chars(v){this._chars=v}

	/**
	 * @property {BuildOps} opts
	 */
	get opts(){return this._opts;}
	set opts(v){this._opts=v}

	/**
	 * @property {Word[]} unused - input items that could not be added to grid.
	 */
	get unused(){ return this._unused;}
	set unused(v){this._unused=v}

	constructor( opts=null, grid=null ){

		this.opts = opts || new BuildOps();

		this.grid = grid;


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

		let filler = this.opts.filler || LowerChars;

		if ( this.opts.forceCase === CASE_LOWER ) filler = filler.toLocaleLowerCase();
		else if ( this.opts.forceCase === CASE_UPPER ) filler = filler.toLocaleUpperCase();

		let cols = this._cols;
		let rows = this._rows;

		for( let r = 0; r < rows; r++ ) {

			let a = this._chars[r];
			for( let c = 0; c < cols; c++ ) {

				if ( !isEmpty(a[c])) continue;
				a[c] = filler[ Math.floor( filler.length*Math.random() ) ];

			}

		}

	}

	/**
	 * Fill all spaces with same character.
	 * @param {string} [char=BLANK_CHAR]
	 */
	fillAll( char=BLANK_CHAR ) {

		let cols = this._cols;
		let rows = this._rows;

		for( let r = 0; r < rows; r++ ) {

			let a = this._chars[r];
			for( let c = 0; c < cols; c++ ) {

				a[c] = char;

			}

		}

	}

}