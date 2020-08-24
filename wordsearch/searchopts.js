import { BuildOps } from "../builders/buildOps";

/**
 * Options for WordSearch game.
 */
export class SearchOpts extends BuildOps {

	/**
	 * @property {string} - characters used to fill blank spaces.
	 */
	get filler(){return this._filler;}
	set filler(v){this._filler=v}

	constructor( vars=null ){

		if ( vars ) {
			Object.assign(this,vars);
		}

	}

}