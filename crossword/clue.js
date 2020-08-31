import { Word } from "../word";
import { DIR_ACROSS } from "../consts";
import {defineVars} from 'objecty';

export class Clue extends Word {

	/**
	 * @property {number} - across or down number of the clue.
	 */
	get num(){return this._num;}
	set num(v){this._num = v;}

	get clue(){return this._clue; }
	set clue(v){this._clue=v}

	/**
	 * @property {across|down} direction
	 */
	get direction(){ return this._dir }
	set direction(v){ this._dir=v; }

	get id(){return this._num + ( this._dir === DIR_ACROSS ? 'A' : 'D' ); }

	constructor( vars=null ){

		super(vars);

		if (!this._word ) this._word = '';
		if (!this._clue) this._clue = '';
		// define undefined vars for Vue reactivity.
		defineVars( this );

	}

}