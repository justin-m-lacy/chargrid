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


	/**
	 * Set the selection endpoint and ensure any diagonal
	 * matches rows,columns in size.
	 * @param {number} endRow
	 * @param {number} endCol
	 */
	setEnd( endRow, endCol ){

		let dr = Math.abs( endRow - this.startRow );
		let dc = Math.abs( endCol - this.startCol );

		if ( dr > dc ) {

			// match column change to row change.
			if ( dc !== 0 ) {

				if ( endCol > this.startCol ) {
					endCol = this.startCol + dr;
				} else {
					endCol = this.startCol - dr;
				}

			}

		} else if ( dc > dr ) {

			if ( dr !== 0 ) {

				if ( endRow > this.startRow ) {
					endRow = this.startRow + dc;
				} else {
					endRow = this.startRow - dc;
				}

			}

		}
		this.endRow = endRow;
		this.endCol = endCol;

	}

}