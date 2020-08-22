/**
 * @class Selection - grid range selected.
 * endRow,endCol is inclusive.
 */
export class Selection {

	get startRow(){return this._startRow;}
	set startRow(v){this._startRow=v}

	get startCol(){return this._startCol;}
	set startCol(v){this._startCol=v}

	get endRow(){return this._endRow;}
	set endRow(v){this._endRow=v}

	get endCol(){return this._endCol;}
	set endCol(v){this._endCol=v}

	/**
	 * @property {string} word - word being selected.
	 */
	//get word(){return this._word;}
	//set word(v){this._word=v}

	constructor( startRow, startCol, endRow, endCol ){

		this.startRow = startRow;
		this.startCol = startCol;

		this.endRow = endRow;
		this.endCol = endCol;

	}

}