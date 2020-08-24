export class WordGame {

	/**
	 * @property {number} time - time taken so far in millseconds.
	 * number is not a timestamp, since game can be paused.
	 */
	get time(){return this._time;}
	set time(v){this._time=v}

}