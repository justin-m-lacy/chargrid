import { randInt, strReverse, rand } from "./util/util";

const RandChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
	 * @property {boolean} allowReverse - whether to allow words in reverse.
	 */
	get allowReverse(){return this._allowReverse}
	set allowReverse(v){this._allowReverse=v;}

	/**
	 * @property {boolean} allowReverse - whether to allow words in reverse.
	 */
	get allowConflicts(){return this._allowConflicts}
	set allowConflicts(v){this._allowConflicts=v;}

	/**
	 * @property {boolean} allowDiagonal - whether to allow diagonally placed words.
	 */
	get allowDiagonal(){return this._allowDiagonal;}
	set allowDiagonal(v){this._allowDiagonal=v}

	/**
	 * @property {string[][]}
	 */
	get chars(){return this._chars}
	set chars(v){this._chars = v}

	get rows(){return this._rows;}
	set rows(v){this._rows =v}

	get cols(){return this._cols;}
	set cols(v){this._cols=v}


	constructor( rows, cols ){

		this.rows = rows;
		this.cols = cols;

		this.initGrid();

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
	 * Attempt to place a word randomly in the grid.
	 * @param {string} word
	 * @returns {boolean} true on success. false on failure.
	 */
	placeWord( word ) {

		if ( word.length > this._rows && word.length> this._cols ) return false;

		let firstTry = word;
		let nextTry = strReverse(word);

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
	 * Attempt to place a word randomly in the grid.
	 * NOT USED. Goes space by space, attempting EVERY direction at each space.
	 * Appears to be slightly worse than doing the direction placements in groups.
	 * @param {string} word
	 * @returns {boolean} true on success. false on failure.
	 */
	/*placeWord2( word ) {

		if ( word.length > this._rows && word.length > this._cols ) return false;

		let firstTry = word;
		let nextTry = strReverse(word);

		if ( Math.random() < REVERSE_RATE ) {

			firstTry = nextTry;
			nextTry = word;

		}

		let rows = this._rows;
		let cols = this._cols;

		// start placing at random position.
		let r = rand( rows );
		let c = rand( cols );

		let maxTries = rows*cols;
		while ( maxTries-- > 0 ) {

			if ( this.tryDirections(firstTry,r,c,true) ) return true;
			if ( this.tryDirections(nextTry,r,c,true) ) return true;

			if ( ++c>= cols ) {
				c = 0;
				if ( ++r >= rows) r=0;
			}

		}

		return false;

	}*/

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
	 * Attempt to place word in a random position/orientation.
	 * @param {string} word
	 * @param {bool} [mustMatch=false] - must match existing characters.
	 * @returns {boolean} true on success. false on failure.
	 */
	/*tryRowPlace( word, mustMatch=false ) {

		//console.log('Try place row: ' + word );

		if ( word.length === 0 ) return false;

		// max column where word can start.
		let maxCol = this._cols - word.length;
		if ( maxCol < 0 ) return false;

		//let reverse = strReverse(word);

		let rowTries = this.rows;

		// choose row start.
		let r = randInt( 0, this.rows );

		// choose col start.
		let c = randInt( 0,  maxCol );

		while ( rowTries-- > 0 ) {

			let colTries = maxCol;
			while ( colTries-- > 0 ) {

				if ( this.tryPutRow( word, r, c, mustMatch ) ) {
					return true;
				}
				if ( ++c >= maxCol ) c = 0;

			}

			if ( ++r >= this._rows ) r = 0;

		}

		return false;

	}*/

	/**
	 * Attempt to place word in a random position/orientation.
	 * @param {string} word
	 * @param {bool} [mustMatch=false] - must match existing characters.
	 * @returns {boolean} true on success. false on failure.
	 */
	/*tryColPlace( word, mustMatch=false ) {

		//console.log('Try place col: ' + word );

		if ( word.length === 0 ) return false;

		// max column where word can start.
		let maxRow = this._rows - word.length;
		if ( maxRow < 0 ) return false;

		//let reverse = strReverse(word);

		let colTries = this.cols;

		// choose col start.
		let c = randInt( 0, this.cols );

		// choose row start.
		let r = randInt( 0,  maxRow );

		while ( colTries-- > 0 ) {

			let rowTries = maxRow;
			while ( rowTries-- > 0 ) {

				if ( this.tryPutCol( word, r, c, mustMatch ) ) {
					return true;
				}
				if ( ++r >= maxRow ) r = 0;

			}

			if ( ++c >= this._cols ) c = 0;

		}

		return false;

	}*/

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
				if ( chr != null && chr != word[i]) return false;
				r += rDir;
				c += cDir;

			}

		}
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
			if ( chr != null && chr != word[i]) return true;
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

	}

	/**
	 * Fill any empty spaces with random characters.
	 */
	fillEmpty() {

		let cols = this._cols;
		let rows = this._rows;

		for( let r = 0; r < rows; r++ ) {

			let a = this._chars[r];
			for( let c = 0; c < cols; c++ ) {

				if ( a[c] != null ) continue;
				a[c] = RandChars[ Math.floor( RandChars.length*Math.random() ) ];

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

	initGrid(){

		let a = [];

		for( let r = 0; r < this._rows; r++ ) {
			a[r] = new Array( this._cols );
		}

		this._chars = a;

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


	/**
	 * Attempt to place word on a diagonal ( forward or backward.)
	 * @param {string} word
	 * @param {boolean} mustMatch
	 */
	/*tryDiagonalPlace( word, mustMatch=false) {

	}

	tryFowardDiagonal(word, mustMatch=false) {
	}

	tryBackwardDiagonal(word,mustMatch=false ) {
	}*/

}