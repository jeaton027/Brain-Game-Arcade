"use strict";

let wordToGuess = "";

let currentGuessedWord = []; // ['G', 'U', 'E', 'S', 'S']
let guessedWords = [[]]; 	 // guessedWords[ 0 ] =  ['G', 'U', 'E', 'S', 'S']
let currTileID = 1;
let numGuessedWords = 0;
let wordLength = 5;
let wordLengthToggle = 5;

let gamesWon = 0;
let gamesPlayed = 0;
let sumTries = 0;
let avgTries = 0;

// disables key presses
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
	messageBox.textContent = "Congratulations!";
	messageBox.parentNode.style.display = "block";
}

// handles game over if won or lost
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
	sumTries += numGuessedWords + 1;
}

function tileToYellow(tileID, char) {
	const tile = document.getElementById(tileID.toString());
	const key = document.querySelector(`button[data-key=${char.toUpperCase()}]`);

	if (tile) {
		tile.classList.add("wrong-placement");
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

// gets new word for this game to guess
function getNewWordtoGuess () {
	const wordListFile = wordLength === 4 ? "dataset/4_letter_words.json" : "dataset/5_letter_words.json";
	
	fetch(wordListFile)
		.then(response => response.json())
		.then(data => {
			const randomIndex = Math.floor(Math.random() * data.words.length);
			wordToGuess = data.words[randomIndex].toUpperCase();
			console.log("Current word to guess: ", wordToGuess);
		})
		.catch(error => console.error('Error loading the word list:', error));
}

function compareLetters () {
	let green = 0;
	for (let i = 0; i < currentGuessedWord.length; i++) {
		const char = currentGuessedWord[i];
		let tileIDIndex = i + (numGuessedWords * wordLength) + 1;
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

// handles submission of a word, and moves onto next guess or ends game
function submitWord() {
	if (guessedWords[numGuessedWords] && guessedWords[numGuessedWords].length === wordLength) {
		let numGreenLetters = compareLetters();
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

// handles each keyboard key press
function keyPress(letter) {
	if (letter == "ENTER") {
		if (guessedWords[numGuessedWords].length === wordLength) {
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
	if (guessedWords[numGuessedWords] && guessedWords[numGuessedWords].length < wordLength) {
		currentGuessedWord.push(nextLetter);
		guessedWords[numGuessedWords] = currentGuessedWord;

		// creates new element with specific tile's ID by #
		const nextTileElement = document.getElementById(currTileID.toString());

		currTileID += 1;
		// places newest pressed letter into element/tile
		nextTileElement.textContent = nextLetter;
	}
}

// create playable tiles for each letter of the 6 guesses of the word
function createTiles() {
	const letterBoard = document.getElementById("board")
	
	while (letterBoard.firstChild) {
		letterBoard.removeChild(letterBoard.firstChild);
	}
	// each tile gets unique number ID 1 - 30
	for (let index = 1; index <= wordLength * 6; index++) {
		let tile = document.createElement("div");
		tile.classList.add("tile");
		tile.setAttribute("id", index);
		letterBoard.appendChild(tile);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	createTiles();

	const keys = document.querySelectorAll('keyboard-row button');

	getNewWordtoGuess();
});



function restartGame() {
	if (wordLength != wordLengthToggle) {
		wordLength = wordLengthToggle;
		const board = document.getElementById("board");
    	board.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
		createTiles();
	}
	getNewWordtoGuess();
	currentGuessedWord = []; // ['G', 'U', 'E', 'S', 'S']
	guessedWords = [[]]; 	 // guessedWords[ 0 ] =  ['G', 'U', 'E', 'S', 'S']
	currTileID = 1;
	numGuessedWords = 0;

	const tiles = document.querySelectorAll('.tile');
	// reset each tile's text content and remove any added class tags
	tiles.forEach(tile => {
		tile.textContent = '';
		tile.className = 'tile';
	});

	// seset all keyboard keys to clickable and default appearance
	const keys = document.querySelectorAll('.keyboard button');
	keys.forEach(key => {
		key.disabled = false;
		key.className = 'key';
	});

	// hide message box
	const messageBox = document.querySelector('.message-box');
	messageBox.style.display = 'none';
}

// closes toggle button after selection is made
function settingsMenu() {
	const dropdown = document.getElementById('settings-dropdown');
	dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function setWordLength(length) {
	settingsMenu();
	wordLengthToggle = length;
	if (numGuessedWords === 0) {
		restartGame();
	}
}

function showStatistics() {
	avgTries = (sumTries / gamesPlayed).toFixed(1);
	if (gamesWon === 0) {
		alert(`Games won: ${gamesWon}`);
	} else {
		alert(`Games won: ${gamesWon} \nAverage tries: ${avgTries}`);
	}
	
	
}