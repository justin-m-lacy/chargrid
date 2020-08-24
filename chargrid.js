import { rand } from "./util/util";
import {  reverse, isEmpty, NonWord } from "./util/charutils";
import { CASE_LOWER, CASE_UPPER, LowerChars } from "./consts";
import { RangeKey } from './range';

/**
 * @const {char} BLANK_CHAR - default char to represent a blank space.
 */
export const BLANK_CHAR = ' ';

/**
 * @const {char} PAD_CHAR - default padding char between characters.
 */
export const PAD_CHAR = ' ';

/**
 * @const {number} REVERSE_RATE - odds of reversing string.
 */
const REVERSE_RATE = 0.4;

/**
 * @const {object[]} directions - directions for placing words.
 * Negative directions aren't included since the word can
 * simply be placed in reverse instead.
 */
const directions = [

	{dr:1, dc:0},
	{dr:0, dc:1},
	{dr:1, dc:1},
	{dr:1, dc:-1}

];

export class CharGrid {

	/**
	 * @property {boolean} [noReverse=false] - prevent reverse words.
	 */
	get noReverse(){return this._noReverse}
	set noReverse(v){this._noReverse=v;}

	/**
	 * @property {boolean} [allowConflicts=false] - whether to allow conflicting letters
	 * to overlap in the grid.
	 */
	get allowConflicts(){return this._allowConflicts}
	set allowConflicts(v){this._allowConflicts=v;}

	/**
	 * @property {boolean} [noDiagonal=false] - Prevent diagonal words.
	 */
	get noDiagonal(){return this._noDiagonal;}
	set noDiagonal(v){this._noDiagonal=v}

	/**
	 * @property {boolean} [noTrim=false] - don't remove leading and trailing whitespace.
	 */
	get noTrim(){return this._noTrim;}
	set noTrim(v){this._noTrim =v}

	/**
	 * @property {boolean} [allowNonword=false] - allow non-word chars
	 */
	get allowNonword(){return this._allowNonword;}
	set allowNonword(v){this._allowNonword =v}

	/**
	 * @property {'upper'|'lower'|null} forceCase - force uppercase or lowercase
	 * characters. 'lower' by default.
	 */
	get forceCase(){return this._forceCase;}
	set forceCase(v){this._forceCase=v}

	/**
	 * @property {string[][]}
	 */
	get chars(){return this._chars}
	set chars(v){this._chars = v}

	/**
	 * @property {number} rows
	 */
	get rows(){return this._rows;}
	set rows(v){this._rows =v}

	/**
	 * @property {number} cols
	 */
	get cols(){return this._cols;}
	set cols(v){this._cols=v}

	/**
	 * @property {string[]} filler - filler characters to use.
	 */
	get filler(){return this._filler;}
	set filler(v){this._filler = v;}

	/**
	 * @property {Map<string,string>} ranges - maps range strings to words
	 * in that range.
	 * Used to stop repeated words from being placed in the exact same
	 * location and counting twice. (Can happen on frequent word repeats.)
	 */
	get ranges(){return this._ranges;}

	constructor( rows, cols ){

		this.initGrid( rows, cols );

		this._ranges = new Map();

		this.forceCase = CASE_LOWER;

	}

	getChar(r,c) {

		if ( r < 0 || r>= this._rows ) {
			console.error('Invalid ROW: ' +r);
			return '';
		} else if ( c < 0 || c>= this._cols ) {
			console.error('Invalid COL: ' +c);
			return '';
		} else return this._chars[r][c];

	}

	/**
	 * Attempt to remove word between the two coords.
	 * Word may be reversed or not.
	 * @param {Coord} c1
	 * @param {Coord} c2
	 */
	tryRemoveRange( c1, c2 ) {

		if ( c1.row === c2.row ) {

			// horizontal word.

		} else if ( c1.col === c2.col ) {

			// vertical word.

		} else {

		}

	}

	/**
	 * Set all chars between two coords to the same character.
	 * @param {Coord} c1
	 * @param {Coord} c2
	 * @param {string} char
	 */
	setRange( c1, c2, char ) {

		let r = c1.row;
		let c = c1.col;

		let dr = c2.row - r;
		let dc = c2.col - c;

		let len = Math.abs(dr);
		if ( len === 0 ) len = Math.abs(dc);
		else if ( Math.abs(dr) !== Math.abs(dc) ) {
			// if neither length is 0, must be a perfect diagonal.
			throw new Error( "Invalid Direction" );
		}
		let a = this._chars;

		if ( dr !== 0 ) dr = dr > 0 ? 1 : -1;
		if ( dc !== 0 ) dc = dc > 0 ? 1 : -1;

		for( let i = 0; i < len; i++ ) {

			a[r][c] = char;
			r += dr;
			c += dc;

		}

	}

	/**
	 * Prepare words before being added.
	 * @param {string[]} words
	 */
	prepareWords( words ) {

		for( let i = words.length-1; i>= 0; i--) {

			let w = words[i];
			if (!this.noTrim) w = w.trim();
			if ( this._forceCase === CASE_LOWER ) {
				w = w.toLocaleLowerCase();
			} else if ( this._forceCase === CASE_UPPER ) {
				w = w.toLocaleUpperCase();
			}
			if ( !this.allowNonword ) {
				w = w.replace( NonWord, '' );
			}

			words[i] = w;

		}

		return words;

	}

	/**
	 * Attempt to place a word randomly in the grid.
	 * @param {string} word
	 * @returns {boolean} true on success. false on failure.
	 */
	placeWord( word ) {

		if ( word.length > this._rows && word.length> this._cols ) return false;

		let firstTry = word;
		let nextTry = reverse(word);

		if ( Math.random() < REVERSE_RATE ) {

			firstTry = nextTry;
			nextTry = word;

		}

		// randomize placement directions.
		// this is done so fallback directions aren't chosen in same order.
		//this.randDirs( directions );

		let numDirs = directions.length;
		let i = rand( numDirs );
		let dirTries = numDirs;

		while ( dirTries-- > 0 ) {

			if ( this.tryDirPlace( firstTry, directions[i].dr, directions[i].dc, true )) return true;
			if ( this.tryDirPlace( nextTry, directions[i].dr, directions[i].dc, true )) return true;

			if ( ++i >= numDirs ) i =0;

		}

		return false;

	}

	/**
	 * Try placing a word at row,col in any possible direction.
	 * @param {string} word
	 * @param {number} r
	 * @param {number} c
	 * @param {bool} mustMatch
	 */
	tryDirections( word, r, c, mustMatch=false ){

		let lenMinus = word.length -1;

		let dirTries = directions.length;
		let i = rand( dirTries );

		while ( dirTries-- > 0 ) {

			let dir = directions[i];
			if ( --i < 0 ) i = directions.length-1;

			let {dr,dc } = dir;

			if ( dr > 0 ) {
				if ( r+lenMinus>=this._rows ) continue;
			}
			else if ( dr<0 ){
				if ( r-lenMinus<0) continue;
			}
			if ( dc > 0 ) {
				if ( c+lenMinus>=this._cols ) continue;
			}
			else if ( dc<0 ){
				if ( c-lenMinus<0) continue;
			}


			if ( !mustMatch || !this.hasConflicts(word,r,c, dr, dc) ) {
				this._setChars(word,r,c,dr,dc);
				return true;
			}

		}

		return false;

	}

	/**
	 * Randomize direction array.
	 */
	randDirs( a ){

		let len = a.length;

		for( let i = len; i >= 0; i-- ) {

			let ind1 = Math.floor( len*Math.random() );
			let ind2 = Math.floor( len*Math.random() );

			let e1 = a[ind1];
			a[ind1] = a[ind2];
			a[ind2] = e1;

		}

	}

	/**
	 * Attempt to place word anywhere in the grid with the given direction.
	 * @param {string} word
	 * @param {1|-1|0} dr - row direction.
	 * @param {1|-1|0} dc - column direction.
	 * @param {bool} mustMatch
	 */
	tryDirPlace( word, dr, dc, mustMatch=false ) {

		let rows = this._rows, cols = this._cols;

		// start placing at random position.
		let r = rand( rows ), c = rand( cols );

		let maxTries = rows*cols;
		let lenMinus = word.length-1;

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

			if ( !oob && this.tryPutWord( word, r,c, dr, dc, mustMatch ) ) return true;
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
	 *
	 * @param {string} word
	 * @param {number} r
	 * @param {number} c
	 * @param {boolean} mustMatch
	 * @returns {boolean}
	 */
	tryPutRow( word, r, c, mustMatch=false ) {

		if (!this.canPutRow( word, r, c, mustMatch) ) return false;

		let a = this._chars[r];
		let wordLen = word.length;
		for( let i = 0; i <wordLen;i++ ) {
			a[c++] = word[i];
		}

		return true;

	}

	/**
	 *
	 * @param {string} word
	 * @param {number} row
	 * @param {number} col
	 * @param {boolean} mustMatch
	 * @returns {boolean} false if word won't fit.
	 */
	tryPutCol( word, row, col, mustMatch=false ){

		if ( !this.canPutWord( word, row, col, 1, 0, mustMatch) ) return false;

		let wordLen = word.length;
		for( let i  = 0; i <wordLen; i++ ) {
			this._chars[row++][col] = word[i];
		}


		return true;

	}

	/**
	 * Attempt to place word with a given orientation. (dr,dc)
	 * @param {string} word
	 * @param {number} r
	 * @param {number} c
	 * @param {0|-1|1} dr
	 * @param {0|-1|1} dc
	 * @param {boolean} mustMatch
	 */
	tryPutWord( word, r, c, dr, dc, mustMatch=false ) {

		if ( !this.canPutWord(word, r, c, dr, dc, mustMatch ) ) return false;
		this._setChars( word,r,c,dr,dc );

		return true;

	}

	canPutRow( word, r, c, mustMatch=false ) {
		return this.canPutWord( word, r, c, 0, 1, mustMatch);
	}

	canPutCol( word, r, c, mustMatch=false ) {
		return this.canPutWord( word, r, c, 1, 0, mustMatch);
	}

	/**
	 *
	 * @param {string} word
	 * @param {number} r - valid grid row.
	 * @param {number} c - valid grid colum.
	 * @param {1|-1|0} rDir - row-direction of word placement.
	 * @param {1|-1|0} cDir - column-direction of word placement.
	 * @param {boolean} [mustMatch=false]
	 * @returns {boolean} true if word can be safely placed.
	 */
	canPutWord( word, r, c, rDir, cDir, mustMatch=false ) {

		let len = word.length;

		let endR = r+rDir*len;
		let endC = c+cDir*len;

		if ( endR < 0 || endR > this._rows ) return false;
		if ( endC < 0 || endC > this._cols ) return false;

		if ( mustMatch) {

			let a = this._chars;
			for( let i = 0; i < len; i++ ) {

				let chr = a[r][c];
				if ( !isEmpty(chr) && chr != word[i]) return false;
				r += rDir;
				c += cDir;

			}

		}

		if ( this._ranges.has( RangeKey(r,c,endR,endC) )) return false;

		return true;

	}

	/**
	 * Determine if word placed at point in direction will conflict
	 * with existing characters.
	 * @param {string} word
	 * @param {number} r - valid grid row.
	 * @param {number} c - valid grid colum.
	 * @param {1|-1|0} rDir - row-direction of word placement.
	 * @param {1|-1|0} cDir - column-direction of word placement.
	 * @returns {boolean} true if word can be safely placed.
	 */
	hasConflicts( word, r, c, rDir, cDir ) {

		let len = word.length;
		let a = this._chars;

		for( let i = 0; i < len; i++ ) {

			let chr = a[r][c];
			if ( !isEmpty(chr) && chr != word[i]) return true;
			r += rDir;
			c += cDir;

		}


		return false;

	}

	/**
	 * Fill chars starting at [row,col], stepping in the direction dr,dc for each letter,
	 * until are letters are used.
	 * Validate data before calling.
	 * @param {string} word
	 * @param {number} r
	 * @param {number} c
	 * @param {1|-1|0} dr - row step to use per letter.
	 * @param {1|-1|0} dc - col step to use per letter.
	 */
	_setChars( word, r, c, dr, dc ) {

		let len = word.length;
		let a = this._chars;

		for( let i = 0; i < len; i++ ) {

			a[r][c] = word[i];
			r += dr;
			c += dc;

		}

		this._ranges.set( RangeKey(r,c,r+dr*len,c+dc*len), word );


	}

	/**
	 * Fill any empty spaces with random characters.
	 */
	fillEmpty() {

		let filler = this._filler || LowerChars;

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
	 * Fill all spaces with same char.
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

	*[Symbol.iterator]() {

		let rows = this._rows, cols = this._cols;

		for( let r = 0; r < rows; r++ ) {

			for( let c = 0; c < cols; c++ ) {

				yield this._chars[r][c];

			}

		}

	}

	initGrid( rows, cols ){

		let a = [];

		for( let r = 0; r < rows; r++ ) {
			a[r] = new Array( cols );
		}

		this.rows = rows;
		this.cols = cols;

		this._chars = a;

	}

	/**
	 * Resize char grid.
	 * @param {number} rows
	 * @param {number} cols
	 */
	resize( rows, cols) {

		if ( rows <= 0 || cols <= 0 ) throw new Error('Invalid Size: ' + rows +',' + cols );
		console.log('RESIZE TO: ' + rows+','+cols);

		var arr = this.chars;

		if ( rows < this._rows) {

			arr = arr.slice(0, rows );

		} else if ( rows > this._rows ) {

			for( let i = rows-this._rows; i > 0; i-- ) {
				arr.push( new Array(cols) );
			}

		}

		if ( cols != this._cols ){

			for( let i = Math.min(rows,this._rows)-1; i >= 0; i-- ) {
				arr[i].length = cols;
			}

		}

		this.chars = arr;
		this.rows = rows;
		this.cols = cols;

	}

	toString(){

		let res = '';

		let grid = this._chars;

		for( let r = 0; r < this._rows; r++ ) {

			let a = grid[r];
			for( let c = 0; c < this._cols; c++ ) {

				let chr = a[c];
				if ( chr == null ) res += '_' + ' ';
				else res += chr + ' ';

			}

			res += '\n';
		}

		return res;

	}

}