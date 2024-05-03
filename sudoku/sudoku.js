// Variables
let numSelected = null;
let tileSelected = null;
let errors = 0;
let board = [];
let solution = [];
let finalSolution = [];

// Load the game
window.onload = function() {
	setGame();
}

// Set up the game
function setGame() {
	// Digits 1-9
	for (let i = 1; i <= 9; i++) {
		let number = document.createElement("div");
		number.id = i;
		number.innerText = i;
		number.addEventListener("click", selectNumber);
		number.classList.add("number");
		document.getElementById("digits").appendChild(number);
	}

	// 9x9 board
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			let tile = document.createElement("div");
			tile.id = r.toString() + "-" + c.toString();
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

	// Generate a new Sudoku board
	generateBoard();
}

// Generate a new Sudoku board
function generateBoard() {
	// Clear the board
	board = [];
	for (let r = 0; r < 9; r++) {
		board[r] = [];
		for (let c = 0; c < 9; c++) {
			board[r][c] = 0;
		}
	}

	// Fill the board with a valid solution
	solve(board);

	// Deep copy the board
	finalSolution = board.map(row => [...row]);

	// Remove some numbers to create the puzzle
	for (let i = 0; i < 40; i++) {
		let r = Math.floor(Math.random() * 9);
		let c = Math.floor(Math.random() * 9);
		board[r][c] = 0;
	}

	// Save the solution for later
	solution = [];
	for (let r = 0; r < 9; r++) {
		solution[r] = [];
		for (let c = 0; c < 9; c++) {
			solution[r][c] = board[r][c];
		}
	}

	// Update the board on the page
	updateBoard();
}

// Update the board on the page
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

// Select a number
function selectNumber() {
	if (numSelected != null) {
		numSelected.classList.remove("number-selected");
	}
	numSelected = this;
	numSelected.classList.add("number-selected");
}

// Select a tile
function selectTile() {
	if (numSelected) {
		let coords = this.id.split("-");
		let r = parseInt(coords[0]);
		let c = parseInt(coords[1]);

		// Check if the tile is empty
		if (board[r][c] == 0) {
			// Check if the selected number is valid for this tile
			if (isValid(board, r, c, parseInt(numSelected.id))) {
				// Insert the number into the tile
				this.innerText = numSelected.id;
				board[r][c] = parseInt(numSelected.id);

				// Check if the board is complete
				if (checkComplete()) {
					alert("Congratulations! You've won!");
				}
			} else {
				// Increment errors count for wrong selection
				errors += 1;
				document.getElementById("errors").innerText = errors;
			}
		}
	}
}

// Check if the board is complete
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

// Solve the Sudoku board
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

// Check if the board is solved
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

// Check if a number is valid in a cell
function isValid(board, row, col, num) {
	// Check row
	for (let c = 0; c < 9; c++) {
		if (board[row][c] == num) {
			return false;
		}
	}

	// Check column
	for (let r = 0; r < 9; r++) {
		if (board[r][col] == num) {
			return false;
		}
	}

	// Check 3x3 box
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
	// Fill the board with the solution
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			board[r][c] = finalSolution[r][c];
		}
	}

	// Update the board on the page
	updateBoard();
}

// Restart the game
function restartGame() {
	errors = 0;
	document.getElementById("errors").innerText = errors;
	generateBoard();
}