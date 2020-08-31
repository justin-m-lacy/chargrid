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

	}

	/**
	 *
	 * @param {string} word
	 * @param {number} r
	 * @param {number} c
	 * @param {number} endR
	 * @param {number} endC
	 * @returns {boolean}
	 */
	canPlace( word, r, c, endR, endC ) {

		if ( dc !== 0 ) {
			// across
			return this.canPlaceAcross( r, c, endC );
		} else {
			return this.canPlaceDown( c, r, endR );
		}

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

	insertAcross( clue, place ){

		let a = this._across;
		let len = a.length;
		for( let i = a.length-1; i >= 0; i-- ) {



		}

	}

}