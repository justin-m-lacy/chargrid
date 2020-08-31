import {Crossword} from 'crossword';
import { BLANK_CHAR, BLOCK_CHAR } from '../consts';
import { joinGrid } from '../util/charutils';

/**
 * Game progress information for a Crossword Game.
 */
export class CrossGame {

	toJSON(){

		return {

			grid:this._grid,
			entries:joinGrid( this._entries ),
			time:this.time
		}

	}

	/**
	 * @property {WordSearch} puzzle - wordsearch puzzle.
	 */
	get puzzle(){return this._puzzle }

	/**
	 * @property {WordSearch} grid - wordsearch grid.
	 */
	get grid(){return this._puzzle.grid; }

	/**
	 * @property {string[][]} entries - characters entered into the crossword by user.
	 */
	get entries(){return this._entries; }
	set entries(v){this._entries = v;}

	/**
	 * @property {number} [time=0] - time taken in millseconds.
	 * number is not a timestamp, since game can be paused.
	 */
	get time(){return this._time;}
	set time(v){this._time=v}

	/**
	 *
	 * @param {CrossGame|object} [vars=null]
	 */
	constructor( vars=null ){

		if ( vars instanceof Crossword ) {

			this._puzzle = vars;
			this.entries = this.makeEntries( vars, this._puzzle.grid );
			this.time = 0;


		} else {

			this._puzzle = new Crossword( vars.crossword );
			this.reviveEntries( this._grid, vars.entries );

			this.time = Number(vars.time||0);

		}

	}

	reviveEntries( grid, entryStr ) {

		let rows = grid.rows;
		let cols = grid.cols;

		let arr = entryStr.split('\n');
		if ( entryStr.length !== rows ) {
			console.error('Bad Placed Rows. Expected: ' + rows +
			'. Got ' + entryStr.length );
		}
		for( let r = 0; r < rows; r++ ) {

			let row = arr[r].split('');
			if ( row.length !== cols ) {
				console.error('Bad Placed Cols at row: ' + r +
				'. Expected: '+ cols +
				'. Got ' + row.length );
			}
			arr[r] = row;

		}

		this.entries = arr;

	}

	/**
	 * Initialize entry guesses with blank spaces.
	 * @param {*} grid
	 * @param {CharGrid} original - original grid.
	 */
	makeEntries( grid, original ){

		let rows = grid.rows;
		let cols = grid.cols;

		let arr = new Array(rows);

		for( let r = 0; r < rows; r++ ) {

			let sub = arr[r] = new Array(cols);
			for( let c = 0; c < cols; c++ ) {

				if ( original.getChar(r,c) === BLOCK_CHAR ) sub[c] = BLOCK_CHAR;
				else sub[c] = BLANK_CHAR;
			}

		}

		return arr;

	}


}