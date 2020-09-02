import { Word } from "../word";
import { DIR_ACROSS, DIR_DOWN } from "../consts";
import {defineVars} from 'objecty';

export class Clue extends Word {

	/**
	 * @property {number} - across or down number of the clue.
	 */
	get num(){return this._num;}
	set num(v){this._num = v;}

	get text(){return this._text; }
	set text(v){this._text=v}

	/**
	 * @property {across|down} direction
	 */
	get direction(){ return this._dir }
	set direction(v){ this._dir=v; }

	get id(){ return this._num + ( this._dir === DIR_ACROSS ? 'A' : 'D' ); }

	constructor( vars=null ){

		super(vars);

		if (!this._word ) this._word = '';
		if (!this._text) this._text = '';
		// define undefined vars for Vue reactivity.
		defineVars( this );

	}

}