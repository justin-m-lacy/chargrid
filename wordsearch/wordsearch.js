import {CharGrid} from '../chargrid';

export class WordSearch extends CharGrid {

	toJSON(){

	}

	/**
	 * @property {Word[]} words - words already placed in wordsearch.
	 */
	get words(){return this._words}
	set words(v){this._words=v;}

	constructor( rows=10, cols=10 ){

		super( rows, cols );

		this._words = [];

	}

	/**
	 * Read off the word crossed by the word selection.
	 * @param {*} sel
	 */
	readWord(sel){

		let s = '';

		let dr = sel.endRow - sel.startRow;
		let dc = sel.endCol - sel.startCol;

		let len = Math.abs( dr || dc );
		if ( len > 0 ) {
			dr /= len;
			dc /= len;
		}

		let r = sel.startRow;
		let c = sel.startCol;

		//console.log('ReadWord: ' + r+','+c + ' len: ' + len );

		//endpoints inclusive.
		for( let i = 0; i <= len;i++ ){

			if ( r < 0 || r >= this.rows) {
				console.error('Invalid r: ' + r );
				continue;
			} else if ( c <0 || c >= this.cols ) {
				console.error('Invalid col: ' +c );
				continue;
			}
			s += this.chars[r][c];
			r += dr;
			c += dc;

		}

		return s;

	}

	/**
	 * Attempt to place all listed words in the grid.
	 * @param {string[]} words
	 * @returns {string[]} list of words that couldn't be placed.
	 */
	placeWords( words ) {

		//console.time( testName );

		if ( !Array.isArray(words) ) throw new Error('Words must be array.');

		// fit large words first.
		let arr = words.concat().sort((a,b)=>a.length-b.length);
		let unused = [];

		for( let i = arr.length-1; i >= 0; i-- ) {

			let w = arr[i].trim();

			if ( !this.placeWord( w ) ) {
				unused.push( w );
			} else {
				this.words.push( w );
			}
		}

		//console.log('created size: ' + this.rows +','+this.cols);
		//console.timeEnd( testName );

		console.log('Words Unused: ' + unused.length );

		return unused;

	}

	has( w ){

		console.log('inc: ' + this.words.includes(w));
		return this.words.includes(w);
	}

	setEnd( sel, endRow, endCol ){

		let dr = Math.abs( endRow - sel.startRow );
		let dc = Math.abs( endCol - sel.startCol );

		if ( dr === 0 || dc === 0 || dr === dc ) {
			sel.endRow = endRow;
			sel.endCol = endCol;
			return;
		}

		if ( dc > dr ){

			if ( dr < 0.6*dc ){
				sel.endRow = sel.startRow;
				return;
			}
			dr = dc;

		} else {

			if ( dc < 0.6*dr ) {
				sel.endCol = sel.startCol;
				return;
			}
			dc = dr;

		}

		// dr,dc now equal abs.
		let maxR = endRow > sel.startRow ? this.rows-1 - sel.startRow : sel.startRow; //startRow-0
		let maxC = endCol > sel.startCol ? this.cols-1 - sel.startCol : sel.startCol; //startCol-0

		if ( dr > maxR ) {
			dr = maxR;
			dc = maxR;
		}
		if ( dr > maxC ) {
			dc = maxC
			dr = maxC;
		}

		sel.endCol = sel.startCol + (endCol > sel.startCol  ? dr : -dr );
		sel.endRow = sel.startRow + ( endRow > sel.startRow ? dr : -dr );

	}

	/**
	 * Place all words from list and fill empty spaces
	 * with random letters.
	 * @param {string[]} words
	 * @returns {string[]} list of words that couldn't be placed.
	 */
	placeAndFill( words ) {

		// empty current letters.
		this.fillAll();

		let unused = this.placeWords(words);

		this.fillEmpty();

		return unused;

	}

	addToWordList(w){

		this._words[w.word] = w;

	}

}