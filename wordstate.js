/**
 * Tracks state of word in an active game.
 */
export class WordState {

	toJSON(){
		return {
			remaining:this.remaining,
			found:this.found.length>0?this.found:null
		}
	}

	/*
	No advantage to storing the word since the state is indexed
	by object property.
	get word(){return this._word;}
	set word(v){this._word=v}*/

	/**
	 * @property {number} total - total words expected.
	 */
	get total(){return this._remaining +this._found.length }

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

	/**
	 * @param {number|object} [remaining=1] - number remaining or json save object.
	 */
	constructor( remaining=1 ){

		if ( typeof remaining === 'number' ) {

			//this.word = word;
			this.remaining = remaining;
			this._found = [];

		} else {

			this.revive(remaining);

		}

	}

	revive( obj ) {

		this.remaining = obj.remaining;

		if ( obj.found ) {

			this.found = obj.found.map(v=>new Selection(v.r0, v.c0, v.r1, v.c1) );

		} else {

			this.found = [];
		}

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