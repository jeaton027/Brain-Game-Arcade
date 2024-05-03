"use strict"

let rows = 4;  // default rows
let columns = 4;  // default columns
let allImages = [];
let flippedCards = [];
let matches = 0;
let pairs = (rows * columns) / 2;
let tilesDisabled = false;
let moves = 0;

document.addEventListener("DOMContentLoaded", () => {
	const movesCounter = document.querySelector(".moves");
	let moves = 0;
	movesCounter.textContent = moves;

	// create and place tiles
	restartGame();
	// default theme to start
	changeTheme('carnival');

	document.getElementById('show-themes').addEventListener('click', function() {
		var themeDiv = document.querySelector('.theme-selection');
		// toggle visibility of sub category buttons
        themeDiv.style.display = themeDiv.style.display === 'none' ? 'block' : 'none';
        themeDiv.classList.toggle('visible');
	});
	
});

// hides buttons after selection is made
function settingsMenu() {
	const dropdown = document.getElementById('theme-selection');
	dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// change the set of images
function changeTheme(theme) {
	settingsMenu();
	// console.log('theme selected:', theme);
	let filepath = `./assets/${theme}/cards.json`;
	// console.log('getting cards from:', filepath);

	fetch(filepath)
		.then(response => response.json())
		.then(data => {
			// image array
			allImages = data;
			// shuffle and place tiles
			restartGame();
		})
		.catch(error => console.error('Failed to load theme images:', error));
}

// choose half the number of tiles of random images from passed array
function chooseRandomImages(images, halfTileNum) {
	let shuffled = images.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, halfTileNum);
}

// shuffle tiles
function shuffleTiles(images) {
	for (let i = images.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[images[i], images[j]] = [images[j], images[i]];
	}
	return images;
}

function createTiles() {
	const gameBoard = document.querySelector(".game-board");
	// clear existing tiles
	gameBoard.innerHTML = '';
	gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
	gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

	// choose (nxm) / 2 random images from image array
	const neededImages = chooseRandomImages(allImages, (rows * columns) / 2);
	// duplicate and shuffle tiles
	const imageSet = shuffleTiles([...neededImages, ...neededImages]);

	// create each tile and associate its id with respective image
	imageSet.forEach(item => {
		const tile = document.createElement('div');
		tile.className = 'tile card';
		tile.setAttribute('data-name', item.name);

		const front = document.createElement('div');
		front.className = 'front';
		front.innerHTML = `<img src="${item.image}" alt="${item.name}" class="front-image">`;

		const back = document.createElement('div');
		back.className = 'back';

		tile.appendChild(front);
		tile.appendChild(back);
		tile.addEventListener('click', () => flipCard(tile));
		gameBoard.appendChild(tile);
	});
}

function restartGame() {
	moves = 0;
	matches = 0;
	flippedCards = [];
	const movesCounter = document.querySelector(".moves");
	movesCounter.textContent = moves;
	tilesDisabled = false;	
	createTiles();
	// reset all tiles to clickable and default appearance
	const tiles = document.querySelectorAll('.game-board button');
	
}

function flipCard(tile) {
	if ( tile.classList.contains('flipped') || tile.classList.contains('matched') ) {
		return;
	}
	if (flippedCards.length < 2 ) {
		tile.classList.add('flipped');
		flippedCards.push(tile);

		if (flippedCards.length === 2) {
			setTimeout(checkMatch, 1000); // check for a match after delay
		}
	}
}

function checkMatch() {
	const [first, second] = flippedCards;
	moves++;
	const movesCounter = document.querySelector(".moves");
	movesCounter.textContent = moves;
	if (first.getAttribute('data-name') === second.getAttribute('data-name')) {
		// it's a match
		first.classList.add('matched');
		second.classList.add('matched');
		matches++;
		checkGameOver();
	} else {
		// no match, flip them back
		first.classList.remove('flipped');
		second.classList.remove('flipped');
	}
	// reset flipped cards array for the next turn
	flippedCards = [];
}

function checkGameOver() {
	if (matches === pairs) {
		alert('Congratulations! You matched all pairs.');
		restartGame();
	}
}
