/**
 * Returns integer >= min and < max.
 * @param {number} min
 * @param {number} max
 */
export function randInt(min,max) {
	return Math.floor( min + Math.random()*(max-min) );
}

export function rand(max){
	return Math.floor( Math.random()*max );
}

export function strReverse(s){

	let r = '';
	for( let i = s.length-1; i>=0; i-- ) {
		r += s[i];
	}
	return r;

}