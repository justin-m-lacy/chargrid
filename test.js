import { WordSearch } from "./wordsearch/wordsearch";

const smallList = [
	'cat',
	'dog',
	'street'
];

const medList = [

	'cat',
	'amphibian',
	'at',
	'to',
	'confiscate',
	'dilemma',
	'computer',
	'program',
	'density',
	'pidgeon',
	'keyboard',
	'zebra',
	'yellow',
	'walrus'

];

const longList = [

	'cat',
	'amphibian',
	'at',
	'to',
	'cataract',
	'persiflage',
	'mendacious',
	'bedroom',
	'chair',
	'obscure',
	'confiscate',
	'dilemma',
	'computer',
	'program',
	'density',
	'pidgeon',
	'keyboard',
	'zebra',
	'yellow',
	'eyeball',
	'zenith',
	'walrus',
	'monitor',
	'lizard',
	'purple',
	'liquid',
	'sky',
	'a'

];

console.log('RUNNING TEST');

searchTest();

function searchTest() {

	console.log('Creating Search');
	let search = new WordSearch( 14, 14 );

	search.placeAndFill( longList );

	//console.log( search.toString() );

}