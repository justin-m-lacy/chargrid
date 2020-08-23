/**
 * Tracks state of word in an active game.
 */
export class WordState {

	toJSON(){

	}

	get word(){return this._word;}
	set word(v){this._word=v}

	/**
	 * @property {number} remaining - total words remaining in puzzle.
	 * Total could be more by coincidence, especially for small words.
	 */
	get remaining(){return this._remaining;}
	set remaining(v){this._remaining=v}

	/**
	 * @property {Selection[]} found - Locations where word was found.
	 * The locations cannot be known in advance because small words
	 * might appear more times than expected by coincidence.
	 */
	get found(){return this._found;}
	set found(v){this._found=v}

	constructor( word, remaining=0 ){

		this.word = word;
		this.remaining = remaining;
		this._found = [];

	}

	/**
	 * Attempt to add selection to list of found words.
	 * The selected word is assumed to be a word match.
	 * @param {Selection} sel - selected coordinates where word match was found.
	 * @returns {boolean} false if no more of the selected word remain,
	 * or the exact selection was already used.
	 */
	tryAdd(sel) {

		if ( this.remaining <= 0 ) return false;
		if ( this.has(sel) ) return false;
		this.addFound(sel);

		return true;

	}

	/**
	 * Check if a selection was already found.
	 * The selection is assumed to be a selection matching this word.
	 * @param {*} sel
	 * @returns {boolean}
	 */
	has(sel) {

		for( let i = this._found.length-1; i>=0; i-- ) {
			if ( this._found[i].equals(sel) ) return true;
		}
		return false;


	}

	/**
	 * Add selection coordinates of a found word.
	 * @param {Selection} sel
	 */
	addFound(sel){

		this._found.push(sel);
		this._remaining--;

	}

}