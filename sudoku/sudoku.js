"use strict"

// Variables
let numSelected = null;
let tileSelected = null;
let errors = 0;
let board = [];
let finalSolution = [];

// Load the game
window.onload = function() {
	setGame();
}

// Set up the game board and inner clickable tiles
function setGame() {
	// clickable digits to select to insert into following grid
	for (let i = 1; i <= 9; i++) {
		let number = document.createElement("div");
		number.id = i;
		number.innerText = i;
		number.addEventListener("click", selectNumber);
		number.classList.add("number");
		document.getElementById("digits").appendChild(number);
	}

	// create a 9x9 grid of clickable tiles
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			let tile = document.createElement("div");

			// assigns a unique id to each tile based on its row and column positions
			tile.id = r.toString() + "-" + c.toString();

			// adds visual lines to make the subsections of the board
			if (r == 2 || r == 5) {
				tile.classList.add("horizontal-line");
			}
			if (c == 2 || c == 5) {
				tile.classList.add("vertical-line");
			}

			tile.addEventListener("click", selectTile);
			tile.classList.add("tile");

			document.getElementById("board").append(tile);
		}
	}

	generateBoard();
}

// generates a new Sudoku board
function generateBoard() {
	// clear the board
	board = [];
	for (let r = 0; r < 9; r++) {
		board[r] = [];
		for (let c = 0; c < 9; c++) {
			board[r][c] = 0;
		}
	}

	// fill board with a valid solution
	solve(board);

	// deep copy/save the board for solve button use
	finalSolution = board.map(row => [...row]);

	// remove numbers to create solvable puzzle
	for (let i = 0; i < 40; i++) {
		let r = Math.floor(Math.random() * 9);
		let c = Math.floor(Math.random() * 9);
		board[r][c] = 0;
	}

	// Update the board on the page
	updateBoard();
}

// update the board on the page
function updateBoard() {
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			if (board[r][c] != 0) {
				tile.innerText = board[r][c];
				tile.classList.add("tile-start");
			} else {
				tile.innerText = "";
				tile.classList.remove("tile-start");
			}
		}
	}
}

// user selects a number
function selectNumber() {
	if (numSelected != null) {
		numSelected.classList.remove("number-selected");
	}
	numSelected = this;
	numSelected.classList.add("number-selected");
}

// select a tile and place selected digit within
function selectTile() {
	if (numSelected) {
		let coords = this.id.split("-");
		let r = parseInt(coords[0]);
		let c = parseInt(coords[1]);

		// check if the tile is empty
		if (board[r][c] == 0) {
			// check if the selected number is valid for this tile
			if (isValid(board, r, c, parseInt(numSelected.id))) {
				// insert the number into the tile
				this.innerText = numSelected.id;
				board[r][c] = parseInt(numSelected.id);

				// check if the board is complete
				if (checkComplete()) {
					alert("Congratulations! You've won!");
				}
			} else {
				// increase errors count for wrong selection
				errors += 1;
				document.getElementById("errors").innerText = errors;
			}
		}
	}
}

// check if the board is complete
function checkComplete() {
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			if (board[r][c] == 0) {
				return false;
			}
		}
	}
	return true;
}

// solve the sudoku board
function solve(board) {
	if (isSolved(board)) {
		return true;
	}

	let r, c;
	for (r = 0; r < 9; r++) {
		for (c = 0; c < 9; c++) {
			if (board[r][c] == 0) {
				break;
			}
		}
		if (board[r][c] == 0) {
			break;
		}
	}

	for (let num = 1; num <= 9; num++) {
		if (isValid(board, r, c, num)) {
			board[r][c] = num;
			if (solve(board)) {
				return true;
			}
			board[r][c] = 0;
		}
	}

	return false;
}

// check if the board is solved
function isSolved(board) {
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			if (board[r][c] == 0) {
				return false;
			}
		}
	}
	return true;
}

// check if a number is valid in a cell
function isValid(board, row, col, num) {
	// row
	for (let c = 0; c < 9; c++) {
		if (board[row][c] == num) {
			return false;
		}
	}

	// column
	for (let r = 0; r < 9; r++) {
		if (board[r][col] == num) {
			return false;
		}
	}

	// 3x3 box check
	let boxRow = Math.floor(row / 3) * 3;
	let boxCol = Math.floor(col / 3) * 3;
	for (let r = boxRow; r < boxRow + 3; r++) {
		for (let c = boxCol; c < boxCol + 3; c++) {
			if (board[r][c] == num) {
				return false;
			}
		}
	}

	return true;
}

function solveBoard() {
	// fill entire board with solution
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			board[r][c] = finalSolution[r][c];
		}
	}
	// print to page
	updateBoard();
}

// restart the game
function restartGame() {
	errors = 0;
	document.getElementById("errors").innerText = errors;
	generateBoard();
}