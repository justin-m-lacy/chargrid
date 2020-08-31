import { BLOCK_CHAR } from "../consts";

/**
 * @const {RegExp} NonWord - matches nonword characters.
 */
export const NonWord = /\W+/gi;
/**
 * @const {RegExp} WhiteSpace - regex matching whitespace.
 */
export const WhiteSpace = /\s+/gi;

/**
 * Get length of longest word.
 * @param {string[]} words
 */
export function longest( words ) {

	let max = 0;
	for( let i = words.length-1; i >= 0; i-- ) {
		let w = words[i];
		if ( w && w.length>max ) max = w.length;
	}

	return max;

}

export function isEmpty(c) {
	return c == null || c === '' || c === BLOCK_CHAR;
}


export function reverse(s){

	let r = '';
	for( let i = s.length-1; i>=0; i-- ) {
		r += s[i];
	}
	return r;

}

/**
 * Join a grid into a single string.
 * @param {string[][]} grid,
 * @param {string} [nullChar='_'] - character to use in place of any null values.
 * @param {string} [rowDelim='\n'] - end of row character.
 * @param {string} [cellDelim=''] - character between grid cells.
 */
export function joinGrid( grid, nullChar='_', rowDelim='\n', cellDelim='') {

	let res = '';

	let rows = grid.length;
	for( let r = 0; r < rows; r++ ) {

		let a = grid[r];
		let cols = a.length;
		for( let c = 0; c < cols; c++ ) {

			let chr = a[c];
			if ( chr == null ) res += nullChar + cellDelim;
			else res += chr + cellDelim;

		}

		res += rowDelim;
	}

	return res;

}