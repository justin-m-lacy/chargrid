export class BuildOps {

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
	set minRows(v){this._minRows=v}

	get maxRows(){return this._maxRows;}
	set maxRows(v){this._maxRows=v}

	get rows(){return this._rows;}
	set rows(v){this._rows =v }

	constructor(vars=null){

		if ( vars ) {
			Object.assign(this,vars);
		}

	}

}