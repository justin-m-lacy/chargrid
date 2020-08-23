/**
 * @class Selection - grid range selected.
 * r1,c1 is inclusive.
 */
export class Selection {

	toJSON(){

		return {
			r0:this._r0,
			c0:this._c0,
			r1:this._r1,
			c1:this._c1
		}
	}

	get r0(){return this._r0;}
	set r0(v){this._r0=v}

	get c0(){return this._c0;}
	set c0(v){this._c0=v}

	get r1(){return this._r1;}
	set r1(v){this._r1=v}

	get c1(){return this._c1;}
	set c1(v){this._c1=v}

	/**
	 * @property {string} word - word being selected.
	 */
	//get word(){return this._word;}
	//set word(v){this._word=v}

	constructor( r0=0, c0=0, r1=0, c1=0 ){

		this.r0 = r0;
		this.c0 = c0;

		this.r1 = r1;
		this.c1 = c1;

	}

	/**
	 * Test if two selections are equal.
	 * @param {Selection} s - selection to test for equality.
	 * @returns {boolean}
	 */
	equals(s){

		if ( this.r0 === s.r0 && this.c0 === s.c0 ) {
			return this.r1 === s.r1 && this.c1 === s.c1;
		} else if ( this.r0 === s.r1 && this.c0 === s.c1 ) {
			return this.r1 === s.r0 && this.c1 === s.c0;
		}

	}

	/**
	 * Set the selection endpoint and ensure any diagonal
	 * matches rows,columns in size.
	 * NOTE: This can cause the adjusted r1,c1 to go off grid.
	 * @param {number} endRow
	 * @param {number} endCol
	 */
	setEnd( endRow, endCol ){

		let dr = Math.abs( endRow - this.r0 );
		let dc = Math.abs( endCol - this.c0 );

		if ( dr > dc ) {

			// match column change to row change.
			if ( dc !== 0 ) {

				if ( endCol > this.c0 ) {
					endCol = this.c0 + dr;
				} else {
					endCol = this.c0 - dr;
				}

			}

		} else if ( dc > dr ) {

			if ( dr !== 0 ) {

				if ( endRow > this.r0 ) {
					endRow = this.r0 + dc;
				} else {
					endRow = this.r0 - dc;
				}

			}

		}
		this.r1 = endRow;
		this.c1 = endCol;

	}

}