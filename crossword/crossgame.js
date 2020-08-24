import {Crossword} from 'crossword';
import { BLANK_CHAR } from '../consts';

/**
 * Game progress information for a Crossword Game.
 */
export class CrossGame {

	toJSON(){

		return {

			grid:this._grid,
			placed:this._placed,
			time:this.time
		}

	}

	/**
	 * @property {string[][]} placed - characters placed in the crossword.
	 */
	get placed(){return this._placed; }
	set placed(v){this._placed = v;}

	/**
	 * @property {number} [time=0] - time taken so far in millseconds.
	 * number is not a timestamp, since game can be paused.
	 */
	get time(){return this._time;}
	set time(v){this._time=v}

	/**
	 * @property {Crossword} grid - crossword grid.
	 */
	get grid(){return this._grid }

	/**
	 *
	 * @param {CrossGame|object} [vars=null]
	 */
	constructor( vars=null ){

		if ( vars instanceof Crossword ) {

			this._grid = vars;
			this.placed = this.makePlaces( vars );


		} else {

			this._grid = new Crossword( vars.crossword );
			this.revivePlaced( this._grid, vars.placed );

			time = Number(vars.time||0);

		}

	}

	revivePlaced( grid, placed ) {

		let rows = grid.rows;
		let cols = grid.cols;

		let arr = placed.split('\n');
		if ( placed.length !== rows ) {
			console.error('Bad Placed Rows. Expected: ' + rows +
			'. Got ' + placed.length );
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

		this.placed = arr;

	}

	makePlaces( grid ){

		let rows = grid.rows;
		let cols = grid.cols;

		let arr = new Array(rows);

		for( let r = 0; r < rows; r++ ) {

			let sub = arr[r] = new Array(cols);
			for( let c = 0; c < cols; c++ ) {

				sub[c] = BLANK_CHAR;
			}

		}

		return arr;

	}


}