/**
 * @class Puzzle Information about a puzzle.
 */
export class Puzzle {

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
	set title(v){this._title=v}

	/**
	 * @property {string} type - type of puzzle (wordsearch,crossword,etc.)
	 */
	get type(){return this._type;}
	set type(v){this._type=v}

	/**
	 * @property {string} creator - id of creator.
	 */
	get creator(){return this._creator; }
	set creator(v){this._creator=v}

	/**
	 * @property {string} creator - id of creator.
	 */
	get difficulty(){return this._difficulty; }
	set difficulty(v){this._difficulty=v}

	/**
	 * @property {CharGrid} grid - rows in puzzle.
	 */
	get grid(){return this._grid; }
	set grid(v){this._grid=v}

	constructor(){
	}


}