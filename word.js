export class Word {

	toJSON(){
	}

	/**
	 * @property {string} length - length of word.
	 */
	get length(){return this._word.length }

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

	/**
	 * @property {string} word - word represented.
	 */
	get word(){return this._word;}
	set word(v){this._word=v}

	/**
	 * @property {boolean} reversed - whether word appears backwards.
	 */
	get reversed(){return this._reversed;}
	set reversed(v){this._reversed=v}

	constructor(vars){

		Object.assign( this, vars );

	}

}