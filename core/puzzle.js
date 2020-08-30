/**
 * @class Puzzle Information about a puzzle.
 */
export class Puzzle {

	toString(){
		return 'untitled';
	}

	toJSON(){

		return {
			id:this.id,
			type:this.type,
			url:this.url||undefined,
			title:this.title||undefined,
			creator:this._creator||undefined,
			difficulty:this._difficulty||undefined,
			grid:this._grid
		}

	}

	/**
	 * @property {string} id - id of object.
	 */
	get id(){return this._id; }
	set id(v){this._id=v}

	/**
	 * @property {string} url - url where object is stored.
	 */
	get url(){return this._url; }
	set url(v){this._url=v}

	/**
	 * @property {string} title - title of game/grid.
	 */
	get title(){return this._title;}
	set title(v){
		//console.log('setting title: ' + v );
		this._title=v
	}

	/**
	 * @property {string} type - type of puzzle (wordsearch,crossword,etc.)
	 */
	get type(){return this._type;}
	set type(v){this._type=v}

	/**
	 * @property {number} created - timestamp of date created.
	 */
	get created(){return this._created}
	set created(v){this._created=v}

	/**
	 * @property {string} creator - id of creator.
	 */
	get creator(){return this._creator; }
	set creator(v){this._creator=v}

	/**
	 * @property {string} difficulty - puzzle difficulty.
	 */
	get difficulty(){return this._difficulty; }
	set difficulty(v){this._difficulty=v}

	/**
	 * @property {CharGrid} grid - rows in puzzle.
	 */
	get grid(){return this._grid; }
	set grid(v){ this._grid=v }

	get rows(){return this._grid.rows;}
	get cols(){return this._grid.cols;}

	constructor(){

		this.title = '';
		this.difficulty = '';
		this.creator = '';
		this.created = 0;
		this.id = null;
		this.url = null;

		/*if ( vars ) {
			this.revive(vars);
		} else {

			this.created = Date.now();
		}*/

	}

	revive( vars ){

		//Object.assign( this, vars );
		this.id = vars.id || null;
		this.difficulty = vars.difficulty || null;
		this.title = vars.title || '';
		this.creator = vars.creator || '';
		this.url = vars.url || '';


	}

}