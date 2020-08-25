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

export function	shuffle( a ){

   let len = a.length;

   for( let i = len; i >= 0; i-- ) {

	   let ind1 = Math.floor( len*Math.random() );
	   let ind2 = Math.floor( len*Math.random() );

	   let e1 = a[ind1];
	   a[ind1] = a[ind2];
	   a[ind2] = e1;

   }

}