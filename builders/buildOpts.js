export class BuildOpts {

	/**
	 * @property {boolean} [noReverse=false] - prevent reverse words.
	 */
	get noReverse(){return this._noReverse}
	set noReverse(v){this._noReverse=v;}

	/**
	 * @property {boolean} [noDiagonal=false] - Prevent diagonal words.
	 */
	get noDiagonal(){return this._noDiagonal;}
	set noDiagonal(v){this._noDiagonal=v}

	/**
	 * @property {boolean} [allowNonword=false] - allow non-word chars
	 */
	get allowNonword(){return this._allowNonword;}
	set allowNonword(v){this._allowNonword =v}

	/**
	 * @property {boolean} [noTrim=false] - don't remove leading and trailing whitespace.
	 */
	get noTrim(){return this._noTrim;}
	set noTrim(v){this._noTrim =v}

	get minRows(){return this._minRows;}
	set minRows(v){ this._minRows = Number(v) }

	get maxRows(){return this._maxRows;}
	set maxRows(v){ this._maxRows= Number(v) }

	get rows(){return this._rows;}
	set rows(v){this._rows = Number(v) }

	get minCols(){return this._minCols;}
	set minCols(v){ this._minCols = Number(v) }

	get maxCols(){return this._maxCols;}
	set maxCols(v){ this._maxCols = Number(v) }

	get cols(){return this._cols;}
	set cols(v){this._cols = Number(v) }

	/**
	 * @property {string} rowDelim - character for separating rows in encoding.
	 */
	get rowDelim(){return this._rowDelim;}
	set rowDelim(v){this._rowDelim=v}

	/**
	 * @property {string} colDelim - character for separating cols in encoding.
	*/
	get colDelim(){return this._colDelim}
	set colDelim(v){this._colDelim=v}

	constructor(vars=null){

		if ( vars ) {
			Object.assign(this,vars);
		}

	}

}