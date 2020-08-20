export class Direction {

	/**
	 * @property {number} dr - row direction.
	 */
	get dr(){ return this._dr; }
	set dr(v){
		this._dr = v > 0 ? 1 : ( v < 0 ? -1 : 0);
	}

	/**
	 * @property {number} dc - column direction.
	 */
	get dc(){ return this._dc; }
	set dc(v){

		this._dc = v > 0 ? 1 : ( v < 0 ? -1 : 0);

	}

	toJSON(){
		return dr + ',' + dc;
	}

	/**
	 *
	 * @param {number|string} dr
	 * @param {number|null} dc
	 */
	constructor( dr, dc ){

		if ( typeof dr === 'string' ) {

			let a = dr.split(',');
			dr = parseInt(a[0]);
			dc = parseInt(a[1]);

		} else {

			this.dr = dr;
			this.dc = dc;
		}

	}

}