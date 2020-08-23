/**
 * Tracks state of word in an active game.
 */
export class WordState {

	get word(){return this._word;}
	set word(v){this._word=v}

	/**
	 * @property {boolean} found
	 */
	get found(){return this._found;}
	set found(v){this._found=v}

	constructor( word, id=0 ){

		this.word = word;
		this._found = false;

		this.id = id;

	}

}