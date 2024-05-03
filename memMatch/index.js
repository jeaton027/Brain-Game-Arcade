let rows = 4;  // Default rows
let columns = 4;  // Default columns
let allImages = [];
let flippedCards = [];
let matches = 0;
let pairs = (rows * columns) / 2;
let tilesDisabled = false;


document.addEventListener("DOMContentLoaded", () => {
	const movesCounter = document.querySelector(".moves");
	let moves = 0;
	movesCounter.textContent = moves;

	// winw.changeThedow.restartGame = restartGame;  // Expose function to global scope for the HTML button
	// windome = changeTheme;  // Expose function to global scope for the HTML button

	restartGame();  // Initial setup and grid creation
	changeTheme('carnival');

	document.getElementById('show-themes').addEventListener('click', function() {
		var themeDiv = document.querySelector('.theme-selection');
		// Toggle visibility
		if (themeDiv.style.display === 'none') {
			themeDiv.style.display = 'block';  // Show the div
			themeDiv.classList.add('visible'); // Add class for CSS transition (if used)
		} else {
			themeDiv.style.display = 'none';   // Hide the div
			themeDiv.classList.remove('visible'); // Remove class for CSS transition (if used)
		}
	});
	
});

function changeTheme(theme) {
	console.log('Theme selected:', theme);
	let filepath = `./assets/${theme}/cards.json`;
	console.log('Fetching cards from:', filepath);

	fetch(filepath)
		.then(response => response.json())
		.then(data => {
			allImages = data;  // Store all images globally
			restartGame();  // Call restartGame to shuffle and display tiles
		})
		.catch(error => console.error('Failed to load theme images:', error));
}

function chooseRandomImages(images, count) {
	let shuffled = images.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

function shuffleTiles(images) {
	for (let i = images.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[images[i], images[j]] = [images[j], images[i]]; // ES6 destructuring assignment for swapping
	}
	return images;
}

function createTiles() {
	const gameBoard = document.querySelector(".game-board");
	gameBoard.innerHTML = '';  // Clear existing tiles
	gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
	gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

	const neededImages = chooseRandomImages(allImages, (rows * columns) / 2);
	const imageSet = shuffleTiles([...neededImages, ...neededImages]);  // Duplicate and shuffle tiles

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
	let matches = 0;
	const movesCounter = document.querySelector(".moves");
	movesCounter.textContent = moves;
	tilesDisabled = false;
	// changeTheme('carnival');  // You can change this default or make it dynamic
	
	createTiles();
	// Reset all tiles to clickable and default appearance
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
			setTimeout(checkMatch, 1000); // Check for a match after a brief delay
		}
	}
}

function checkMatch() {
	const [first, second] = flippedCards;
	moves++;
	const movesCounter = document.querySelector(".moves");
	movesCounter.textContent = moves;
	if (first.getAttribute('data-name') === second.getAttribute('data-name')) {
		// It's a match
		first.classList.add('matched');
		second.classList.add('matched');
		matches++;
		checkGameOver();
	} else {
		// No match, flip them back
		first.classList.remove('flipped');
		second.classList.remove('flipped');
	}
	
	flippedCards = []; // Reset flipped cards array for the next turn
}

function checkGameOver() {
	if (matches === pairs) {
		console.log('Game Over! You matched all pairs.');
		alert('Congratulations! You matched all pairs.');
		restartGame(); // Optionally restart the game or offer the player to restart
	}
}
