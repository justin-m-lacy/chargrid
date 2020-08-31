import { Builder, NoDiagonals } from "./builder";
import { Crossword } from "../crossword/crossword";
import { BuildOpts } from "./buildOpts";
import {  NonWord } from "../util/charutils";
import { CASE_LOWER, CASE_UPPER } from "../consts";

export class CrossBuilder extends Builder {

	constructor( opts=null, puzzle=null ){

		super( opts || new BuildOpts(), puzzle || new Crossword() );

		this.opts.noDiagonal = true;
		this.opts.noReverse = true;

		this.unused=[];

	}

	/**
	 * Attempt to place all listed clues in the crossword.
	 * @param {Clue[]} words
	 * @returns {string[]} list of words that couldn't be placed.
	 */
	build( clues ) {

		if ( !Array.isArray(clues) ) throw new Error('Clues must be array.');

		// fit large words first.
		clues = clues.concat().sort((a,b)=>a.length-b.length);
		this.prepareClues( clues, this.opts );

		this.createGrid( clues );

		let tries = 40;
		do {

			this.puzzle.clearPlaced();
			this._placeClues( clues );

		} while ( --tries > 0 );

		this.fillEmpty();

		this.puzzle.assignNums();

		super.build();

		return this.puzzle;

	}

	/**
	 * Prepare words before being added.
	 * @param {Clues[]} clues
	 */
	prepareClues( clues, opts ) {

		for( let i = clues.length-1; i>= 0; i--) {

			let w = clues[i].word;
			if (!opts.noTrim) w = w.trim();
			if ( opts.forceCase === CASE_LOWER ) {
				w = w.toLocaleLowerCase();
			} else if ( opts.forceCase === CASE_UPPER ) {
				w = w.toLocaleUpperCase();
			}
			if ( !opts.allowNonword ) {
				w = w.replace( NonWord, '' );
			}

			clues[i].word = w;

		}

		return clues;

	}

	_placeClues( clues ){

		let unused = [];
		let placed = this._puzzle.clues = [];

		let dirs = NoDiagonals;

		for( let i = clues.length-1; i >= 0; i-- ) {

			let clue = clues[i];

			let place = this.placeBest( clue.word, dirs );
			if ( place == null ) {

				clue.row = clue.col = -1;
				unused.push(clue);

			} else {

				this._puzzle.placeItem( clue, place );

			}

		}

		this.unused = unused;

	}

}