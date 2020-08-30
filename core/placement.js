/**
 * @class Placement
 * Indicates a potential placement for a word, with the number of
 * matching characters crossed from other words.
 * The more characters crossed the better, since it means the available
 * space is being utilized to squeeze in more words.
 */
export class Placement {

	get matches(){return this._matches;}
	set matches(v){this._matches=v}

	get row(){return this._row;}
	set row(v){this._row=v}

	get col(){return this._col}
	set col(v){this._col = v}

	get dr(){return this._dr;}
	set dr(v){this._dr=v}

	get dc(){return this._dc;}
	set dc(v){this._dc =v}

	/**
	 * @property {number} cutOff - number of matches at which to stop any search.
	 */
	get cutOff(){return this._cutoff;}
	set cutOff(v){this._cutoff=v}

	constructor( cutOff=0 ){

		this._matches=-1;
		this.cutOff = cutOff;

		// indicates no valid placement.
		this._row = -1;
		this._col = -1;

	}

	isValid(){return this._matches>=0;}

	setBest(r,c,dr,dc,matches ) {

		this._row =r;
		this._col = c;
		this._dr = dr;
		this._dc = dc;
		this._matches = matches;

	}

}