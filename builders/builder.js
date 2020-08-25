import { BuildOps } from "./buildOps";
import {  isEmpty, NonWord } from "../util/charutils";
import { CASE_LOWER, CASE_UPPER, LowerChars, BLANK_CHAR, REVERSE_RATE } from "../consts";

const NoDiagonals = [

	{dr:1, dc:0},
	{dr:0, dc:1}

];

/**
 * @const {object[]} directions - directions for placing words.
 * Negative directions aren't included since the word can
 * simply be placed in reverse instead.
 */
const AllDirs = NoDiagonals.concat([

	{dr:1, dc:1},
	{dr:1, dc:-1}

]);

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

	get rows(){return this._rows;}
	set rows(v){this._rows=v}

	get cols(){return this._cols;}
	set cols(v){this._cols=v}

	constructor( opts=null, grid=null ){

		this.opts = opts || new BuildOps();

		this.grid = grid;

	}

	/**
	 * Attempt to place a word randomly in the grid.
	 * @param {string} word
	 * @returns {boolean} true on success. false on failure.
	 */
	tryPlace( word ) {

		if ( word.length > this._rows && word.length> this._cols ) return false;

		let reverse = !this.opts.noReverse;
		let dirs = this.opts.NoDiagonals ? NoDiagonals : AllDirs;

		// randomize placement directions so fallback directions aren't chosen in same order.
		//this.shuffle( directions );

		let dirTries = dirs.length;
		let i = rand( dirTries );

		while ( dirTries-- > 0 ) {

			let { dr, dc } = dirs[i];

			if ( reverse ) {

				if ( Math.random() < REVERSE_RATE ) {
					dr = -dr;
					dc = -dc;
				}
				if ( this.tryPlaceDir( word, dr, dc, true )) return true;
				if ( this.tryPlaceDir( word, -dr, -dc, true )) return true;

			} else {

				if ( this.tryPlaceDir( word, dr, dc, true )) return true;
			}

			if ( --i < 0 ) i = dirs.length-1;

		}

		return false;

	}

	/**
	 * Attempt to place word anywhere in the grid with the given direction.
	 * @param {string} word
	 * @param {1|-1|0} dr - row direction.
	 * @param {1|-1|0} dc - column direction.
	 * @param {bool} mustMatch
	 */
	tryPlaceDir( word, dr, dc, mustMatch=false ) {

		let rows = this._rows, cols = this._cols;

		// start placing at random position.
		let r = rand( rows ), c = rand( cols );

		let maxTries = rows*cols;
		let lenMinus = word.length-1;

		// todo: row,col checks can be preoptimized.
		while( maxTries-- > 0 ) {

			let oob = false;		// out of bounds.
			if ( dr > 0 ) {
				if ( r + lenMinus >= rows ) oob = true;
			} else if ( dr < 0 ) {
				if ( r-lenMinus < 0 ) oob=true;
			}
			if ( dc > 0 ) {
				if ( c+lenMinus >= cols ) oob = true;
			} else if ( dc < 0 ) {
				if ( c-lenMinus < 0 ) oob = true;
			}

			if ( !oob && this._grid.tryPutWord( word, r,c, dr, dc, mustMatch ) ) return true;
			// @note advancement of r,c here has nothing to do with direction.
			// It is just attempting to place the word at every grid space.
			if ( --c < 0 ) {
				c = cols-1;
				if ( --r < 0 ) r=rows-1;
			}

		}

		return false;

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