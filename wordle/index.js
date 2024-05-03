// const wordDataBase = ["amend", "amino", "among", "angel", "anger"];

let wordToGuess = "";

let currentGuessedWord = []; // ['G', 'U', 'E', 'S', 'S']
let guessedWords = [[]]; 	 // guessedWords[ 0 ] =  ['G', 'U', 'E', 'S', 'S']
let currTileID = 1;
let numGuessedWords = 0;
let wordLength = 5;

let gamesWon = 0;
let gamesPlayed = 0;
let sumTries = 0;
let avgTries = 0;

function disableKeyboard() {
	const buttons = document.querySelectorAll('.keyboard button');

	buttons.forEach(button => {
		button.disabled = true;
	});
}

function gameIsLost() {
	disableKeyboard();
	window.alert("All guesses used.");
}

function gameIsWon() {
	disableKeyboard();
	// winningAnimation();
	const messageBox = document.querySelector('.message-box p');
	messageBox.classList.add('won');
	// messageBox.querySelector('p').textContent = "Congratulations!";
	messageBox.textContent = "Congratulations!";
	messageBox.parentNode.style.display = "block";
	// window.alert("Congratulations!");
}

function gameIsOver(bool) {
	disableKeyboard();
	const messageBox = document.querySelector('.message-box p');
	if (bool === true) {
		messageBox.classList.add("won");
		messageBox.textContent = "Congratulations!";
		gamesWon++;
	} else {
		messageBox.classList.add("lost");
		messageBox.innerHTML = `Game Over, all guesses used.<br>The word was:<br>${wordToGuess}`;
	}
	messageBox.parentNode.style.display = "block";
	gamesPlayed++;
	sumTries += numGuessedWords;
}

function tileToYellow(tileID, char) {
	const tile = document.getElementById(tileID.toString());
	const key = document.querySelector(`button[data-key=${char.toUpperCase()}]`);

	// if ((tile && !tile.classList.contains("correct")) && key) {
		// if ((tile ) && (key && !key.classList.contains("correct"))) {
	if (tile) {
		tile.classList.add("wrong-placement");
		// tile.classList.add("flip");
	}
	if (!key.classList.contains("correct")) {	
		key.classList.add("wrong-placement");
	}
}

function tileToGrey(tileID, char) {
	const tile = document.getElementById(tileID.toString());
	const key = document.querySelector(`button[data-key=${char.toUpperCase()}]`);

	if (tile && key) {
		tile.classList.add("incorrect");
		key.classList.add("incorrect");
	}
}

function tileToGreen(tileID, char) {
	const tile = document.getElementById(tileID.toString());
	const key = document.querySelector(`button[data-key=${char.toUpperCase()}]`);

	if (tile && key) {
		key.classList.remove("wrong-placement");
		tile.classList.add("correct");
		key.classList.add("correct");
	}
}

function getNewWordtoGuess () {
	fetch("dataset/5_letter_words.json")
		.then(response => response.json())
		.then(data => {
			const randomIndex = Math.floor(Math.random() * data.words.length);
			wordToGuess = data.words[randomIndex].toUpperCase();
			console.log("Current word to guess: ", wordToGuess);
		})
		.catch(error => console.error('Error loading the word list:', error));
}

function compareLetters () {
	// console.log("currentGuessedWord ", currentGuessedWord)
	let green = 0;
	for (let i = 0; i < currentGuessedWord.length; i++) {
		const char = currentGuessedWord[i];
		let tileIDIndex = i + (numGuessedWords * 5) + 1;
		if( char === wordToGuess[i]) {
			tileToGreen(tileIDIndex, char);
			green += 1;
		} else if (wordToGuess.includes(char)) {
			tileToYellow(tileIDIndex, char);
		}
		else {
			tileToGrey(tileIDIndex, char);
		}
	}
	return green;
}

function submitWord() {
	if (guessedWords[numGuessedWords] && guessedWords[numGuessedWords].length === 5) {
		numGreenLetters = compareLetters();
		if (numGreenLetters === wordLength) {
			gameIsOver(true);
		} else if (numGuessedWords === 5) {
			gameIsOver(false);
		}
		
		numGuessedWords += 1;
		guessedWords.push([]);
		currentGuessedWord = [];
	}
}

function deleteLetter () {
	if (guessedWords[numGuessedWords] && guessedWords[numGuessedWords].length > 0) {
		// remove last element of the current guessed word's array
		currentGuessedWord.pop();
		guessedWords[numGuessedWords] = currentGuessedWord;
		
		// creates new element with specific tile's ID by #
		const nextTileElement = document.getElementById(String(currTileID - 1));
		currTileID -= 1;

		// 'deletes' last letter in element/tile
		nextTileElement.textContent = "";
	}
	
}

function keyPress(letter) {
	if (letter == "ENTER") {
		if (guessedWords[numGuessedWords].length === 5) {
			submitWord();
		}
	}
	else if (letter == "BACK") {
		deleteLetter();
	}
	else {
		enterNextLetter(letter);
	}
	
}

function enterNextLetter(nextLetter) {
	// console.log("guessedWords", guessedWords, guessedWords[numGuessedWords])
	if (guessedWords[numGuessedWords] && guessedWords[numGuessedWords].length < 5) {
		currentGuessedWord.push(nextLetter);
		guessedWords[numGuessedWords] = currentGuessedWord;
		// console.log("guessedWords[",numGuessedWords,"] = ", guessedWords[numGuessedWords]);

	
		// creates new element with specific tile's ID by #
		const nextTileElement = document.getElementById(currTileID.toString());

		currTileID += 1;
		// console.log("next tile ID", currTileID);
		// places newest pressed letter into element/tile
		nextTileElement.textContent = nextLetter;
	}
	// console.log("guessedWords[numGuessedWords].length ", guessedWords[numGuessedWords].length);
}

document.addEventListener("DOMContentLoaded", () => {
	createTiles();

	const keys = document.querySelectorAll('keyboard-row button');

	
	// create playable tiles for each letter of the 6 guesses of the word
	function createTiles() {
		const letterBoard = document.getElementById("board")

		// each tile get unique number ID 1 - 30
		for (let index = 1; index <= 30; index++) {
			let tile = document.createElement("div");
			tile.classList.add("tile");
			tile.setAttribute("id", index);
			letterBoard.appendChild(tile);
		}
	}
	getNewWordtoGuess();
	// document.getElementById("restart-button").addEventListener("click", restartGame); //TODO here??
});

function restartGame() {
	getNewWordtoGuess();
	currentGuessedWord = []; // ['G', 'U', 'E', 'S', 'S']
	guessedWords = [[]]; 	 // guessedWords[ 0 ] =  ['G', 'U', 'E', 'S', 'S']
	currTileID = 1;
	numGuessedWords = 0;
	// wordLength = 5;

	const tiles = document.querySelectorAll('.tile');
	tiles.forEach(tile => {
		tile.textContent = '';
		tile.className = 'tile';  // This removes any additional classes like 'correct', 'wrong-placement', 'incorrect'
	});

	// Reset all keyboard keys to clickable and default appearance
	const keys = document.querySelectorAll('.keyboard button');
	keys.forEach(key => {
		key.disabled = false;
		key.className = 'key';  // This removes any additional classes
	});

	// Hide the message box
	const messageBox = document.querySelector('.message-box');
	messageBox.style.display = 'none';
}

function settingsMenu() {
	const dropdown = document.getElementById('settings-dropdown');
	dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function setWordLength(length) {
	wordLength = length;
	console.log("Word length =", wordLength);
	settingsMenu();
}

function showStatistics() {
	avgTries = sumTries / gamesPlayed;
	if (gamesWon === 0) {
		alert(`Games won: ${gamesWon}`);
	} else {
		alert(`Games won: ${gamesWon} \nAverage tries: ${avgTries}`);
	}
	
	
}

// window.onclick = function(event) {
// 	if (!event.target.matches('#settings-button, #settings-dropdown button')) {
// 		var dropdowns = document.getElementsByClassName("dropdown-menu");
// 		for (var i = 0; i < dropdowns.length; i++) {
// 			var openDropdown = dropdowns[i];
// 			if (openDropdown.style.display === 'block') {
// 				openDropdown.style.display = 'none';
// 			}
// 		}
// 	}
// }