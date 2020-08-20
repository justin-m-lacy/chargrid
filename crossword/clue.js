import { Word } from "../word";

export class Clue extends Word {


	get clue(){return this._clue; }
	set clue(v){this._clue=v}

	constructor( vars=null ){

		super(vars);

	}

}