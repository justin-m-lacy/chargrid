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
	 * Read off the word in the given range.
	 * @param {Range} range
	 */
	readWord(range){

		let s = '';

		let dr = range.r1 - range.r0;
		let dc = range.c1 - range.c0;

		let len = Math.abs( dr || dc );
		if ( len > 0 ) {
			dr /= len;
			dc /= len;
		}

		let r = range.r0;
		let c = range.c0;

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

		this.prepareWords(arr);

		for( let i = arr.length-1; i >= 0; i-- ) {

			let w = arr[i];

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

		let dr = Math.abs( endRow - sel.r0 );
		let dc = Math.abs( endCol - sel.c0 );

		if ( dr === 0 || dc === 0 || dr === dc ) {
			sel.r1 = endRow;
			sel.c1 = endCol;
			return;
		}

		if ( dc > dr ){

			if ( dr < 0.6*dc ){
				sel.r1 = sel.r0;
				return;
			}
			dr = dc;

		} else {

			if ( dc < 0.6*dr ) {
				sel.c1 = sel.c0;
				return;
			}
			dc = dr;

		}

		// dr,dc now equal abs.
		let maxR = endRow > sel.r0 ? this.rows-1 - sel.r0 : sel.r0; //r0-0
		let maxC = endCol > sel.c0 ? this.cols-1 - sel.c0 : sel.c0; //c0-0

		if ( dr > maxR ) {
			dr = maxR;
			dc = maxR;
		}
		if ( dr > maxC ) {
			dc = maxC
			dr = maxC;
		}

		sel.c1 = sel.c0 + (endCol > sel.c0  ? dr : -dr );
		sel.r1 = sel.r0 + ( endRow > sel.r0 ? dr : -dr );

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