import { Puzzle } from "../core/puzzle";

export class Crossword extends Puzzle {

	toJSON(){

	}

	/**
	 * @property {Clue[]} clues
	 */
	get clues(){return this._clues;}
	set clues(v){this._clues=v}

	/**
	 * @property {Clue[]} across
	 */
	get across(){ return this._across;}
	set across(v){this._across=v}

	/**
	 * @property {Clue[]} down
	 */
	get down(){return this._down;}
	set down(v){this._down=v}

	constructor( rows, cols ){

		super(rows,cols);

		this.allowDiagonal = false;
		this.allowReverse = false;

		this._down = [];
		this._across = [];
		this._clues = [];

	}

	/**
	 * TODO: length-1 words.
	 * @param {string} word
	 * @param {number} r
	 * @param {number} c
	 * @param {number} endR
	 * @param {number} endC
	 * @returns {boolean}
	 */
	canPlace( word, r, c, endR, endC ) {

		/**
		 * NOTE: This order must match placeClue() below for consistency.
		 * Across is the fallback so edge-case 1-length words are considered
		 * 'across' not 'down'
		 */
		if ( r !== endR ) {
			return this.canPlaceDown( c, r, endR );

		} else {
			// across
			return this.canPlaceAcross( r, c, endC );
		}

	}

	/**
	 * Sorts clues by row,col and assigns clue numbers.
	 */
	assignNums(){

		this.sortClues();

		let num = 0;
		let lastR = -1, lastC = -1;

		let len = this._clues.length;
		for( let i = 0; i < len; i++ ) {

			let cl = this._clues[i];
			if ( cl.row !== lastR || cl.col !== lastC ) {
				// across/down clues can share a number.
				num++;
				lastR = cl.row;
				lastC = cl.col;
			}
			cl.num = num;

		}

	}

	sortClues(){

		this._clues.sort( (cl1,cl2)=>{
			return (cl1.row !== cl2.row ) ? cl1.row - cl2.row : cl1.col - cl2.col;
		});

	}

	clearPlaced(){

		// not vue reactive.
		this._down.length = 0;
		this._across.length = 0;
		this._clues.length = 0;

	}

	/**
	 *
	 * @param {number} r
	 * @param {number} c
	 * @param {number} endC
	 * @returns {boolean}
	 */
	canPlaceAcross( r, c, endC ) {

		for( let i = this._across.length-1; i>= 0; i-- ) {

			let cur = this._across[i];
			if ( cur.row < r ) return true;	// remaining rows all lower.
			else if ( cur.row > r ) continue;

			// same row.
			if ( cur.col >= c ){
				if ( cur.col <= endC ) return false;
			} else {
				// cur.col < c
				if ( cur.col+cur.length-1 >= c ) return false;
				// next is to left of cur.col & does not pass cur.col.
				return true;
			}

		}

		return true;

	}

	/**
	 *
	 * @param {number} c
	 * @param {number} r
	 * @param {number} endR
	 * @returns {boolean}
	 */
	canPlaceDown( c, r, endR ) {

		for( let i = this._down.length-1; i>= 0; i-- ) {

			let cur = this._down[i];
			if ( cur.col < c ) return true;	// remaining cols all lower.
			else if ( cur.col > c ) continue;

			// same col.
			if ( cur.row >= r ){
				if ( cur.row <= endR ) return false;
			} else {
				// cur.row < r
				if ( cur.row+cur.length-1 >= r ) return false;
				// next is to left of cur.row & does not pass cur.row.
				return true;
			}

		}

		return true;

	}

	placeItem( clue, place ) {

		clue.row = place.row;
		clue.col = place.col;

		if ( place.dr !== 0 ) {

			clue.direction = 'down';
			this.insertDown(clue);

		} else {

			clue.direction = 'across';
			this.insertAcross(clue);
		}

		this._clues.push(clue);

	}

	/**
	 * Insert a clue in the 'across' list.
	 * Does not check or guard against overlaps.
	 * @param {Clue} clue
	 */
	insertAcross( clue ){

		let a = this._across;

		let r = clue.row;
		let i = a.length-1;
		for( ; i >= 0; i-- ) {

			let cur = a[i];
			if ( cur.row > r ) continue;
			else if ( cur.row === r && cur.col >= clue.col ) continue;

			break;

		}

		a.splice( i+1, 0, clue );

	}

	/**
	 * Insert a clue in the 'down' list.
	 * Does not check or guard against overlaps.
	 * @param {Clue} clue
	 */
	insertDown( clue ){

		let a = this._down;

		let c = clue.col;
		let i = a.length-1;
		for( ; i >= 0; i-- ) {

			let cur = a[i];
			if ( cur.col > c ) continue;
			else if ( cur.col === c && cur.row >= clue.row ) continue;

			break;

		}
		a.splice( i+1, 0, clue );

	}

}