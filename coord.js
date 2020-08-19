export class Coord {

	toJSON(){
		return [this._row,this._col]
	}

	/**
	 * @property {number} row - grid row.
	 */
	get row(){return this._row;}
	set row(v){this._row=v}

	/**
	 * @property {number} col - grid col.
	 */
	get col(){return this._col;}
	set col(v){this._col=v}

	constructor( row, col ){

		this._row = row;
		this._col = col;

	}

}