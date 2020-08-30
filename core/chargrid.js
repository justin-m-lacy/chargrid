import {  isEmpty, joinGrid } from "../util/charutils";
import { RangeKey } from './range';
import { CASE_LOWER, CASE_UPPER } from "../consts";


export class CharGrid {

	toJSON(){

		return {

			title:this.title||undefined,
			chars:joinGrid(this.chars),
			opts:this.opts||undefined

		};

	}

	/**
	 * @property {BuildOpts} opts - build options.
	 */
	get opts(){return this._opts;}
	set opts(v){this._opts = v}

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
	 * @property {Map<string,string>} ranges - maps range strings to words
	 * in that range.
	 * Used to stop repeated words from being placed in the exact same
	 * location and counting twice. (Can happen on frequent word repeats.)
	 */
	get ranges(){return this._ranges;}

	constructor( rows, cols ){

		this._ranges = new Map();

		if ( typeof rows === 'object') {

			this.revive(rows );

		} else {

			this.makeGrid( rows, cols );
		}

	}

	clearRanges(){
		this._ranges.clear();
	}

	/**
	 * Set the case for all characters in grid.
	 * @param {string} caps
	 */
	setCase( caps ){

		if ( caps !== CASE_LOWER && caps !== CASE_UPPER ) return;

		let func = caps === CASE_LOWER ? v=>v.toLocaleLowerCase() : v=>v.toLocaleUpperCase();
		for( let r = this.rows.length-1; r>= 0; r-- ) {
			this._chars[r] = this._chars[r].map( func );
		}

	}

	/**
	 * Revive from json.
	 */
	revive( json ){

		if ( !json.chars ) {
			throw new Error('Grid missing char data.');
		}

		let opts = this.opts;

		this._chars = this.reviveGrid( json.chars,
			opts ? opts.rowDelim : undefined,
			opts ? opts.colDelim : undefined );

		this.title = json.title||'';

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
	 * @param {number} r0 - valid grid row.
	 * @param {number} c0 - valid grid colum.
	 * @param {1|-1|0} rDir - row-direction of word placement.
	 * @param {1|-1|0} cDir - column-direction of word placement.
	 * @param {boolean} [mustMatch=false]
	 * @returns {boolean} true if word can be safely placed.
	 */
	canPutWord( word, r0, c0, rDir, cDir, mustMatch=false ) {

		let lenMinus = word.length-1;

		let endR = r0+rDir*lenMinus;
		let endC = c0+cDir*lenMinus;

		if ( endR < 0 || endR >= this._rows ) return false;
		if ( endC < 0 || endC >= this._cols ) return false;

		if ( mustMatch) {

			let a = this._chars;
			let r = r0, c = c0;
			for( let i = 0; i <= lenMinus; i++ ) {

				let chr = a[r][c];
				if ( !isEmpty(chr) && chr != word[i]) return false;
				r += rDir;
				c += cDir;

			}

		}

		if ( this._ranges.has( RangeKey(r0,c0,endR,endC) )) {
			return false;
		}

		return true;

	}

	/**
	 * Counts number of times a word placement matches characters already placed
	 * in the grid.
	 * If any placed character would conflict with a previously placed character,
	 * -1 is returned.
	 * -1 is also returned if an identical word has already been placed in this position.
	 * @param {string} word
	 * @param {number} r - valid grid row.
	 * @param {number} c - valid grid colum.
	 * @param {1|-1|0} rDir - row-direction of word placement.
	 * @param {1|-1|0} cDir - column-direction of word placement.
	 * @returns {number} number of characters placed word matches, or -1 for a conflict.
	 */
	countMatches( word, r, c, rDir, cDir ) {

		let len = word.length-1;
		let a = this._chars;

		let matches = 0;

		// duplicate word placement. this could be placed outside countMatches() as well.
		if ( this._ranges.has( RangeKey(r,c,r+len*rDir,c+len*cDir) )) {
			return -1;
		}

		for( let i = 0; i <= len; i++ ) {

			let chr = a[r][c];
			if ( !isEmpty(chr) ) {

				if ( chr !== word[i] ) return -1;
				matches++;
			}

			r += rDir;
			c += cDir;

		}

		return matches;

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

		let len = word.length-1;
		let a = this._chars;

		this._ranges.set( RangeKey(r,c,r+dr*len,c+dc*len), word );

		for( let i = 0; i <= len; i++ ) {

			a[r][c] = word[i];
			r += dr;
			c += dc;

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

	makeGrid( rows, cols ){

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

	/**
	 * Read word in the given range.
	 * @param {Range} range
	 */
	readWord(range){

		let s = '';

		let dr = range.r1 - range.r0;
		let dc = range.c1 - range.c0;

		let len = Math.abs( dr || dc );
		if ( len > 0 ) {
			dr /= len;
			dc /= len;
		}

		let r = range.r0;
		let c = range.c0;

		//console.log('ReadWord: ' + r+','+c + ' len: ' + len );

		//endpoints inclusive.
		for( let i = 0; i <= len;i++ ){

			if ( r < 0 || r >= this.rows) {
				console.error('Invalid r: ' + r );
				continue;
			} else if ( c <0 || c >= this.cols ) {
				console.error('Invalid col: ' +c );
				continue;
			}
			s += this.chars[r][c];
			r += dr;
			c += dc;

		}

		return s;

	}

	/**
	 * Set the end point of a selection so it doesn't go out of bounds.
	 * @param {Selection} sel
	 * @param {number} endRow
	 * @param {number} endCol
	 */
	setEnd( sel, endRow, endCol ){

		let dr = Math.abs( endRow - sel.r0 );
		let dc = Math.abs( endCol - sel.c0 );

		if ( dr === 0 || dc === 0 || dr === dc ) {
			sel.r1 = endRow;
			sel.c1 = endCol;
			return;
		}

		if ( dc > dr ){

			if ( dr < 0.6*dc ){
				sel.r1 = sel.r0;
				return;
			}
			dr = dc;

		} else {

			if ( dc < 0.6*dr ) {
				sel.c1 = sel.c0;
				return;
			}
			dc = dr;

		}

		// dr,dc now equal abs.
		let maxR = endRow > sel.r0 ? this.rows-1 - sel.r0 : sel.r0; //r0-0
		let maxC = endCol > sel.c0 ? this.cols-1 - sel.c0 : sel.c0; //c0-0

		if ( dr > maxR ) {
			dr = maxR;
			dc = maxR;
		}
		if ( dr > maxC ) {
			dc = maxC
			dr = maxC;
		}

		sel.c1 = sel.c0 + (endCol > sel.c0  ? dr : -dr );
		sel.r1 = sel.r0 + ( endRow > sel.r0 ? dr : -dr );

	}

	/**
	 *
	 * @param {string} str
	 * @throws {Error}
	 * @returns {string[][]} the revived grid.
	 */
	reviveGrid( str, rowDelim='\n', cellDelim='' ) {

		//console.log('grid found: ' +str );

		let inRows = str.trim().split( rowDelim );
		let outRows = [];

		let rows = str.length;

		if ( rows <= 0 ) {
			throw new Error('Bad revived row size: ' + rows );
		}
		let cols = inRows[0].length;
		if ( cols <= 0 ) {
			throw new Error('Bad revived col size: ' + cols );
		}

		for( let r = 0; r < rows; r++ ) {

			let rowStr = inRows[r];
			if ( rowStr == null || rowStr.length <= 0 ) continue;

			let row = rowStr.split( cellDelim );

			if ( row.length !== cols ) {
				throw new Error('Inconsistent col length. Expected: ' + cols + '. Got ' + row.length +'.');
			}

			outRows.push(row);
		}

		this.rows = outRows.length;
		this.cols = cols;

		return outRows;

	}

	toString(){
		return joinGrid(this._chars );
	}

}