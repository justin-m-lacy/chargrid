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

console.log('RUNNING TEST');

searchTest();

function searchTest() {

	console.log('Creating Search');
	let search = new WordSearch( 10, 10 );

	console.log('Placing words.');

	search.placeAndFill( medList );

	console.log( search.toString() );

}