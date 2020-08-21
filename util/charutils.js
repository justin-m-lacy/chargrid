/**
 * @const {RegExp} NonWord - matches nonword characters.
 */
export const NonWord = /\W+/gi;

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
	return c == null || c === '' || c === ' ';
}