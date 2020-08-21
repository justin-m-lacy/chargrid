/**
 * Get maximum word length
 * @param {string[]} words
 */
export function maxSize( words ) {

	let max = 0;
	for( let i = words.length-1; i >= 0; i-- ) {
		let w = words[i];
		if ( w && w.length>max ) max = w.length;
	}

	return max;

}