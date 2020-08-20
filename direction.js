export class Direction {

	get dr(){ return this._dr; }
	set dr(v){
		this._dr = v > 0 ? 1 : ( v < 0 ? -1 : 0);
	}

	get dc(){ return this._dc; }
	set dc(v){

		this._dc = v > 0 ? 1 : ( v < 0 ? -1 : 0);

	}

	toJSON(){
	}

	constructor( dr, dc ){

		this.dr = dr;
		this.dc = dc;

	}

}