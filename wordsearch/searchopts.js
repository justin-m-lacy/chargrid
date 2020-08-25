import { BuildOps } from "../builders/buildOps";

/**
 * Options for WordSearch game.
 */
export class SearchOpts extends BuildOps {

	/**
	 * @property {boolean} [noReverse=false] - prevent reverse words.
	*/
	get noReverse(){return this._noReverse}
	set noReverse(v){this._noReverse=v;}

	/**
	 * @property {number} [reverseRate=REVERSE_RATE] - rate at which to attempt to place
	 * word in reverse. Words can still be placed in reverse if they can't be placed
	 * forwards.
	 */
	get reverseRate(){return this._reverseRate; }
	set reverseRate(v){this._reverseRate=v;}

	/**
	 * @property {string} - characters used to fill blank spaces.
	 */
	get filler(){return this._filler;}
	set filler(v){this._filler=v}

	constructor( vars=null ){

		super(vars);

	}

}