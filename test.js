import { WordSearch } from "./wordsearch/wordsearch";

/**
 * @const {small|med|large} size - size of test.
 */
const size = 'med'

const Sizes = {

	small:10,
	med:15,
	large:20

}

const Lists = {

	small:[
	'cat',
	'dog',
	'street'
	],

	med:[

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
	'diagonal',
	'fissure',
	'zebra',
	'yellow',
	'walrus'],

	large: [

	'cat',
	'amphibian',
	'at',
	'to',
	'cataract',
	'persiflage',
	'mendacious',
	'radiant',
	'bellowing',
	'numinous',
	'vagrant',
	'bedroom',
	'chair',
	'obscure',
	'confiscate',
	'lion',
	'masticate',
	'leg',
	'arm',
	'backpack',
	'idle',
	'dilemma',
	'computer',
	'kitten',
	'puppy',
	'duck',
	'alligator',
	'program',
	'density',
	'pidgeon',
	'keyboard',
	'zebra',
	'yellow',
	'eyeball',
	'zenith',
	'walrus',
	'potato',
	'meager',
	'visceral',
	'clandestine',
	'nothing',
	'universe',
	'blank',
	'mashed',
	'boil',
	'stew',
	'monitor',
	'lizard',
	'vertigo',
	'alpha',
	'math',
	'integral',
	'addition',
	'purple',
	'liquid',
	'sky',
	'a'
	]

};

console.log('RUNNING TEST');

//searchTest();
/**
 * Out of dATe.
 */
function searchTest() {

	console.log('Creating Search');

	let gridSize = Sizes[size];
	let list = Lists[size];
	let search = new WordSearch( gridSize, gridSize );

	search.placeAndFill( list );

	console.log( search.toString() );

}