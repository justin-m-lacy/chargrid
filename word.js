export class Word {

	/**
	 * @property {number} row - row where word was placed.
	 */
	get row(){return this._row;}
	set row(v){this._row=v}

	/**
	 * @property {number} col - col where word was placed.
	 */
	get col(){return this._col;}
	set col(v){this._col=v}

	get word(){return this._word;}
	set word(v){this._word=v}

	/**
	 * @property {boolean} vertical - whether word is oriented vertically.
	 */
	get vertical(){ return this._vertical;}
	set vertical(v){this._vertical =v}

	/**
	 * @property {boolean} reversed - whether word appears backwards.
	 */
	get reversed(){return this._reversed;}
	set reversed(v){this._reversed=v}

	constructor(vars){

		Object.assign( this, vars );

	}

}