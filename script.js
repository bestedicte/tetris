let canvas;
let ctx;
let gBArrayHeight = 20; // The number of cells in array height
let gBArrayWidth = 12; // The number of cells in array weight
let startX = 4; // Starting X position for Tetromino
let startY = 0; // Starting Y position for Tetromino
let score = 0; // Tracks the score of the player
let level = 1; // Tracks the current level of the player
let winOrLose = 'Playing';

/* Used as a lookup table, each value in the array contains 
the X & Y position we can use to draw the box on the canvas. */
let coordinateArray = [...Array(gBArrayHeight)].map(e =>
	Array(gBArrayWidth).fill(0)
);

let currentTetromino = [
	[1, 0],
	[0, 1],
	[1, 1],
	[2, 1],
];

// Will hold all the Tetrominos
let tetrominos = [];
// The Tetromino colors matched to the tetronimos array
let tetrominoColors = [
	'purple',
	'cyan',
	'blue',
	'yellow',
	'orange',
	'green',
	'red',
];
// The current Tetromino color
let currentTetrominoColor;

// Creating a gameboard array so we know where other squares are
let gameBoardArray = [...Array(20)].map(e =>
	Array(12).fill(0)
);
// Array for storing stopped shapes. It will hold colors when a shape stops and is added
let stoppedShapeArray = [...Array(20)].map(e =>
	Array(12).fill(0)
);

// Created to track the direction I'm moving the Tetromino
let DIRECTION = {
	IDLE: 0,
	DOWN: 1,
	LEFT: 2,
	RIGHT: 3,
};

let direction;

class Coordinates {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

// Excecuting SetUpCanvas when the page loads
document.addEventListener('DOMContentLoaded', SetupCanvas);

//Creates the array with square coordinates
function CreateCoordinateArray() {
	let xR = 0, yR = 19;
	let i = 0, j = 0;
	for (let y = 9; y <= 446; y += 23) {
		for (let x = 11; x <= 264; x += 23) {
			coordinateArray[i][j] = new Coordinates(x, y);
			i++;
		}
		j++;
		i = 0;
	}
}

function SetupCanvas() {
	canvas = document.getElementById('tetris');
	ctx = canvas.getContext('2d');
	canvas.width = 936;
	canvas.height = 956;

	// Double the size of elements to fit the screen
	ctx.scale(2, 2);

	// Draw canvas background
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw gameboard rectangle
	ctx.strokeStyle = 'black';
	ctx.strokeRect(8, 8, 280, 462);

	tetrisLogo = new Image(161, 54);
	tetrisLogo.onload = DrawTetrisLogo;
	tetrisLogo.src = 'tetrislogo.gif';

	// Set font for score label text and draw
	ctx.fillStyle = 'black';
	ctx.font = '21px Arial';
	ctx.fillText('SCORE', 300, 98);

	// Draw score rectangle
	ctx.strokeRect(300, 107, 161, 24);
	// Draw score
	ctx.fillText(score.toString(), 310, 127);

	// Draw level label text
	ctx.fillText('LEVEL', 300, 157);
	// Draw level rectangle
	ctx.strokeRect(300, 171, 161, 24);
	// Draw level
	ctx.fillText(level.toString(), 310, 190);

	// Draw next label next
	ctx.fillText('WIN / LOSE', 300, 221);
	// Draw playing condition
	ctx.fillText(winOrLose, 310, 261);
	// Draw playing condition rectangle
	ctx.strokeRect(300, 232, 161, 95);

	// Draw controls label text
	ctx.fillText('CONTROLS', 300, 354);
	// Draw controls rectangle
	ctx.strokeRect(300, 366, 161, 104);
	// Draw controls text
	ctx.font = '19px Arial';
	ctx.fillText('A : Move Left', 310, 388);
	ctx.fillText('D : Move Right', 310, 413);
	ctx.fillText('S : Move Down', 310, 438);
	ctx.fillText('E : Rotate', 310, 463);

	// Handle keyboard presses
	document.addEventListener('keydown', HandleKeyPress);

	// Create the array of Tetromino arrays
	CreateTetrominos();
	// Generate random Tetromino
	CreateTetromino();

	// Create the rectangle lookup table
	CreateCoordinateArray();
	DrawTetromino();
}

function DrawTetrisLogo() {
	ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino() {
/* Cycle through the X & Y array for the Tetromino looking 
for all the places a square would be drawn */
	for (let i = 0; i < currentTetromino.length; i++) {
		/* Move the Tetromino X & Y values to the Tetromino shown in the middle of 
		the gameboard */
		let x = currentTetromino[i][0] + startX;
		let y = currentTetromino[i][1] + startY;
		// Put Tetromino shape in the gameboard array
		gameBoardArray[x][y] = 1;
		let coordinateX = coordinateArray[x][y].x;
		let coordinateY = coordinateArray[x][y].y;
		// Draw a square at the X & Y coordinates that the lookup table provides
		ctx.fillStyle = currentTetrominoColor;
		ctx.fillRect(coordinateX, coordinateY, 21, 21);
	}
}
/* Move and delete old Tetromino. */
/* Each time a key is pressed we change either the starting X or Y value for where we want to
draw the new Tetromino. We also delete the previously drawn shape and draw the new one */
function HandleKeyPress(key) {
	if (winOrLose != 'Game Over') {
		// a keykode (LEFT)
		if (key.keyCode === 65) {
			// Check if it will hit the wall
			direction = DIRECTION.LEFT;
			if (!HittingTheWall() && !CheckForHorizontalCollision()) {
				DeleteTetromino();
				startX--;
				DrawTetromino();
			}
			// d keykode (RIGHT)
		} else if (key.keyCode === 68) {
			// Check if it will hit the wall
			direction = DIRECTION.RIGHT;
			if (!HittingTheWall() && !CheckForHorizontalCollision()) {
				DeleteTetromino();
				startX++;
				DrawTetromino();
			}
			// s keykode (DOWN)
		} else if (key.keyCode === 83) {
			MoveTetrominoDown();
			// e keykode (rotation)
		} else if (key.keyCode === 69) {
			RotateTetromino()
		}
	}
}

function MoveTetrominoDown() {
	// Track that I want to move down
	direction = DIRECTION.DOWN;
	// Check for vertical collision
	if (!CheckForVerticalCollision()) {
		DeleteTetromino();
		startY++;
		DrawTetromino();
	}
}

// Automatically calls for a Tetromino to fall every second
window.setInterval(function() {
	if (winOrLose != 'Game Over'){
		MoveTetrominoDown()
	}
}, 1000)

// Clears the previously drawn Tetromino
// Do the same stuff when we drew originally, but make the square white this timne
function DeleteTetromino() {
	for (let i = 0; i < currentTetromino.length; i++) {
		let x = currentTetromino[i][0] + startX;
		let y = currentTetromino[i][1] + startY;
		// Delete Tetromino square from the gameboard array
		gameBoardArray[x][y] = 0;
		// Draw white where colored squares used to be
		let coordinateX = coordinateArray[x][y].x;
		let coordinateY = coordinateArray[x][y].y;
		ctx.fillStyle = 'white';
		ctx.fillRect(coordinateX, coordinateY, 21, 21);
	}
}
/* Generate random Tetrominos with color. 
We'll define every index where there is a colored block */
function CreateTetrominos() {
	// T Tetromino
	tetrominos.push([
		[1, 0],
		[0, 1],
		[1, 1],
		[2, 1],
	]);
	// I Tetromino
	tetrominos.push([
		[0, 0],
		[1, 0],
		[2, 0],
		[3, 0],
	]);
	// J Tetromino
	tetrominos.push([
		[0, 0],
		[0, 1],
		[1, 1],
		[2, 1],
	]);
	// Square Tetromino
	tetrominos.push([
		[0, 0],
		[1, 0],
		[0, 1],
		[1, 1],
	]);
	// L Tetromino
	tetrominos.push([
		[2, 0],
		[0, 1],
		[1, 1],
		[2, 1],
	]);
	// S Tetromino
	tetrominos.push([
		[1, 0],
		[2, 0],
		[0, 1],
		[1, 1],
	]);
	// Z Tetromino
	tetrominos.push([
		[0, 0],
		[1, 0],
		[1, 1],
		[2, 1],
	]);
}

function CreateTetromino() {
	// Get a random Tetromino index
	let randomTetromino = Math.floor(Math.random() * tetrominos.length);
	// Set the one to draw
	currentTetromino = tetrominos[randomTetromino];
	// Get the color for it
	currentTetrominoColor = tetrominoColors[randomTetromino];
}


/* Check if the Tetromino hits the wall
	Cycle throough the squares adding the upper left hand corner position
	to see if the value is <= 0 or >=11
	If they are also moving in a direction that would be off the board stop movement */
function HittingTheWall() {
	for (let i = 0; i < currentTetromino.length; i++) {
		let newX = currentTetromino[i][0] + startX;
		if (newX <= 0 && direction === DIRECTION.LEFT) {
			return true;
		} else if (newX >= 11 && direction === DIRECTION.RIGHT) {
			return true;
		}
	}
	return false;
}
// Check for vertical collision
function CheckForVerticalCollision() {
	/* Make a copy of the Tetromino so that I can move a fake Tetromino 
	and check for collisions before I move the real Tetromino */	
	let tetrominoCopy = currentTetromino;
	// Will change values based on collisions
	let collision = false;
	// Cycle through all Tetromino squares
	for (let i = 0; i < tetrominoCopy.length; i++) {
		/* Get each square of the Tetromino and adjust the 
		square position so I can check for collions */
		let square = tetrominoCopy[i];
		/* Move into position based on the changing upper left hand corner
		of the entire Tetromino shape */
		let x = square[0] + startX;
		let y = square[1] + startY;
		// If I'm moving down increment y to check for a collision
		if (direction === DIRECTION.DOWN) {
			y++;
		}
		/* Check if I'm going to hit a previously set piece */
			if (typeof stoppedShapeArray[x][y + 1] === 'string') {
				// If so delete Tetromino
				DeleteTetromino();
				// Increment to put into place and draw
				startY++;
				DrawTetromino();
				collision = true;
				break;
			}
			if (y >= 20) {
				collision = true;
				break;
			}
	}
	if (collision) {
		// Check for game over and if so set game over text
		if (startY <= 2) {
			winOrLose = 'Game Over';
			ctx.fillStyle = 'white';
			ctx.fillRect(310, 242, 140, 30);
			ctx.fillStyle = 'black';
			ctx.fillText(winOrLose, 310, 261);
		} else {
			// Add stoppped Tetronimo to stopped shape array so I can check for future collisions
			for (let i = 0; i < tetrominoCopy.length; i++) {
				let square = tetrominoCopy[i];
				let x = square[0] + startX;
				let y = square[1] + startY;
				// Add the current Tetronimo color
				stoppedShapeArray[x][y] = currentTetrominoColor;
			}
			// Check for completed rows
			CheckForCompletedRows();
			CreateTetromino();

			// Create the next Tetronimo and draw it and reset direction
			direction = DIRECTION.IDLE;
			startX = 4;
			startY = 0;
			DrawTetromino;
		}
	}
}
// Check for horizontal shape collision
function CheckForHorizontalCollision() {
	/* Copy the Tetronimo so I can manipulate its x value and check if it's new
	value would collide with a stopped Tetronimo */
	let tetrominoCopy = currentTetromino;
	let collision = false;
	// Cycle through all Tetronimo squares
	for (let i = 0; i < tetrominoCopy.length; i++) {
		// Get the square and move it into position using the upper left hand coordinates
		let square = tetrominoCopy[i];
		let x = square[0] + startX;
		let y = square[1] + startY;
		// Move Tetronimo clone square into position based on a direction moving
		if (direction === DIRECTION.LEFT) {
			x--;
		} else if (direction === DIRECTION.RIGHT) {
			x++;
		}
		// Get the potential stopped square that may exist
		var stoppedShapeValue = stoppedShapeArray[x][y];
		// If it's a string we know a stopped square is there
		if (typeof stoppedShapeValue === 'string') {
			collision = true;
			break;
		}
	}
	return collision;
}

// Check for completed rows
function CheckForCompletedRows() {
	// Track how many rows to delete and where to start deleting
	let rowsToDelete = 0;
	let startOfDeletion = 0;
	// Check every row to see if it has been completed
	for (let y = 0; y < gBArrayHeight; y++) {
		let completed = true;
		// Cycle through x values
		for (let x = 0; x < gBArrayWidth; x++) {
			// Get values stored in the stopped block array
			let square = stoppedShapeArray[x][y];
			// Check if nothing is there
			if (square === 0 || typeof square === 'undefined') {
				// If there is nothing there once then jump out because the row isn't completed
				completed = false;
				break;
			}
		}
		// If a row has been completed
		if(completed) {
			// Used to shift down the rows
			if (startOfDeletion === 0) startOfDeletion = y
			rowsToDelete++
			// Delete the line everywhere
			for (let i = 0; i < gBArrayWidth; i++) {
				// Update the arrays by deleting previous squares
				stoppedShapeArray[i][y] = 0
				gameBoardArray[i][y] = 0
				// Look for the X & Y values in the lookup table
				let coordinateX = coordinateArray[i][y].x
				let coordinateY = coordinateArray[i][y].y
				// Draw the square as white
				ctx.fillStyle = 'white'
				ctx.fillRect(coordinateX, coordinateY, 21, 21)
			}
		}
	}
	if(rowsToDelete > 0) {
		score += 10
		ctx.fillStyle = 'white'
		ctx.fillRect(310, 109, 140, 19)
		ctx.fillStyle = 'black'
		ctx.fillText(score.toString(), 310, 127)
		MoveAllRowsDown(rowsToDelete, startOfDeletion)
	}
}
// Move rows down after a row has been deleted
function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
	for (var i = startOfDeletion - 1; i >= 0; i--) {
		for (var x = 0; x < gBArrayWidth; x++) {
			var y2 = i + rowsToDelete
			var square = stoppedShapeArray[x][i]
			var nextSquare = stoppedShapeArray[x][y2]
			if (typeof square === 'string') {
				nextSquare = square
				gameBoardArray[x][y2] = 1; // Put block into GBA
				stoppedShapeArray[x][y2] = square // Draw color into stopped
				let coordinateX = coordinateArray[x][y2].x
				let coordinateY = coordinateArray[x][y2].y
				ctx.fillStyle = nextSquare
				ctx.fillRect(coordinateX, coordinateY, 21, 21)

				square = 0;
				gameBoardArray[x][i] = 0
				stoppedShapeArray[x][i] = 0
				coordinateX = coordinateArray[x][i].x
				coordinateY = coordinateArray[x][i].y
				ctx.fillStyle = 'white'
				ctx.fillRect(coordinateX, coordinateY, 21, 21)
			}
		}
	}
}

function RotateTetromino() {
	let newRotation = new Array()
	let tetrominoCopy = currentTetromino;
	let currentTetrominoBackUp
	for (let i = 0; i < tetrominoCopy.length; i++) {
		currentTetrominoBackUp = [...currentTetromino]
		let x = tetrominoCopy[i][0]
		let y = tetrominoCopy[i][1]
		let newX = (GetLastSquareX() - y)
		let newY = x
		newRotation.push([newX, newY])
	}
	DeleteTetromino()
	try {
		currentTetromino = newRotation
		DrawTetromino()
	} catch (e) {
		if (e instanceof TypeError) {
			currentTetromino = currentTetrominoBackUp;
			DeleteTetromino()
			DrawTetromino()
		}
	}
}

function GetLastSquareX() {
	let lastX = 0
	for (let i = 0; i < currentTetromino.length; i++) {
		let square = currentTetromino[i]
		if (square[0] > lastX)
		lastX = square[0]
	}
	return lastX
}