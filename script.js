let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let winOrLose = 'Playing';

let coordinateArray = [...Array(gBArrayHeight)].map((e) =>
	Array(gBArrayWidth).fill(0)
);

let currentTetromino = [
	[1, 0],
	[0, 1],
	[1, 1],
	[2, 1],
];

let tetrominos = [];

let tetrominoColors = [
	'purple',
	'cyan',
	'blue',
	'yellow',
	'orange',
	'green',
	'red',
];

let currentTetrominoColor;

let gameBoardArray = [...Array(gBArrayHeight)].map((e) =>
	Array(gBArrayWidth).fill(0)
);

let stoppedShapeArray = [...Array(gBArrayHeight)].map((e) =>
	Array(gBArrayWidth).fill(0)
);

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

document.addEventListener('DOMContentLoaded', SetupCanvas);

function CreateCoordinateArray() {
	let i = 0,
		j = 0;
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

	ctx.scale(2, 2);

	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = 'black';
	ctx.strokeRect(8, 8, 280, 462);

	tetrisLogo = new Image(161, 54);
	tetrisLogo.onload = DrawTetrisLogo;
	tetrisLogo.src = 'tetrislogo.gif';

	ctx.fillStyle = 'black';
	ctx.font = '21px Arial';
	ctx.fillText('SCORE', 300, 98);

	ctx.strokeRect(300, 107, 161, 24);

	ctx.fillText(score.toString(), 310, 127);

	ctx.fillText('LEVEL', 300, 157);
	ctx.strokeRect(300, 171, 161, 24);
	ctx.fillText(level.toString(), 310, 190);

	ctx.fillText('WIN / LOSE', 300, 221);
	ctx.fillText(winOrLose, 310, 261);
	ctx.strokeRect(300, 232, 161, 95);

	ctx.fillText('CONTROLS', 300, 354);
	ctx.strokeRect(300, 366, 161, 104);
	ctx.font = '19px Arial';

	ctx.fillText('A : Move Left', 310, 388);
	ctx.fillText('D : Move Right', 310, 413);
	ctx.fillText('S : Move Down', 310, 438);
	ctx.fillText('E : Rotate', 310, 463);

	document.addEventListener('keydown', HandleKeyPress);
	CreateTetrominos();
	CreateTetromino();

	CreateCoordinateArray();
	DrawTetromino();
}

function DrawTetrisLogo() {
	ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino() {
	for (let i = 0; i < currentTetromino.length; i++) {
		let x = currentTetromino[i][0] + startX;
		let y = currentTetromino[i][1] + startY;
		gameBoardArray[x][y] = 1;
		let coordinateX = coordinateArray[x][y].x;
		let coordinateY = coordinateArray[x][y].y;
		ctx.fillStyle = currentTetrominoColor;
		ctx.fillRect(coordinateX, coordinateY, 21, 21);
	}
}

function HandleKeyPress(key) {
	if (winOrLose != 'Game Over') {
		if (key.keyCode === 65) {
			direction = DIRECTION.LEFT;
			if (!HittingTheWall() && !CheckForHorizontalCollision()) {
				DeleteTetromino();
				startX--;
				DrawTetromino();
			}
		} else if (key.keyCode === 68) {
			direction = DIRECTION.RIGHT;
			if (!HittingTheWall() && !CheckForHorizontalCollision()) {
				DeleteTetromino();
				startX++;
				DrawTetromino();
			}
		} else if (key.keyCode === 83) {
			MoveTetrominoDown();
		}
	}
}

function MoveTetrominoDown() {
	direction = DIRECTION.DOWN;
	if (!CheckForVerticalCollision()) {
		DeleteTetromino();
		startY++;
		DrawTetromino();
	}
}

function DeleteTetromino() {
	for (let i = 0; i < currentTetromino.length; i++) {
		let x = currentTetromino[i][0] + startX;
		let y = currentTetromino[i][1] + startY;
		gameBoardArray[x][y] = 0;
		let coordinateX = coordinateArray[x][y].x;
		let coordinateY = coordinateArray[x][y].y;
		ctx.fillStyle = 'white';
		ctx.fillRect(coordinateX, coordinateY, 21, 21);
	}
}

function CreateTetrominos() {
	// T
	tetrominos.push([
		[1, 0],
		[0, 1],
		[1, 1],
		[2, 1],
	]);
	// I
	tetrominos.push([
		[0, 0],
		[1, 0],
		[2, 0],
		[3, 0],
	]);
	// J
	tetrominos.push([
		[0, 0],
		[0, 1],
		[1, 1],
		[2, 1],
	]);
	// Square
	tetrominos.push([
		[0, 0],
		[1, 0],
		[0, 1],
		[1, 1],
	]);
	// L
	tetrominos.push([
		[2, 0],
		[0, 1],
		[1, 1],
		[2, 1],
	]);
	// S
	tetrominos.push([
		[1, 0],
		[2, 0],
		[0, 1],
		[1, 1],
	]);
	// Z
	tetrominos.push([
		[0, 0],
		[1, 0],
		[1, 1],
		[2, 1],
	]);
}

function CreateTetromino() {
	let randomTetromino = Math.floor(Math.random() * tetrominos.length);
	currentTetromino = tetrominos[randomTetromino];
	currentTetrominoColor = tetrominoColors[randomTetromino];
}

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

function CheckForVerticalCollision() {
	let tetrominoCopy = currentTetromino;
	let collision = false;
	for (let i = 0; i < tetrominoCopy.length; i++) {
		let square = tetrominoCopy[i];
		let x = square[0] + startX;
		let y = square[1] + startY;
		if (direction === DIRECTION.DOWN) {
			y++;
		}
		if (gameBoardArray[x][y + 1] === 1) {
			if (typeof stoppedShapeArray[x][y + 1] === 'string') {
				DeleteTetromino();
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
	}
	if (collision) {
		if (startY <= 2) {
			winOrLose = 'Game Over';
			ctx.fillStyle = 'white';
			ctx.fillRect(310, 242, 140, 30);
			ctx.fillStyle = 'black';
			ctx.fillText(winOrLose, 310, 261);
		} else {
			for (let i = 0; i < tetrominoCopy.length; i++) {
				let square = tetrominoCopy[i];
				let x = square[0] + startX;
				let y = square[1] + startY;
				stoppedShapeArray[x][y] = currentTetrominoColor;
			}
			CheckForCompletedRows();
			CreateTetromino();
			direction = DIRECTION.IDLE;
			startX = 4;
			startY = 0;
			DrawTetromino;
		}
	}
}

function CheckForHorizontalCollision() {
	let tetrominoCopy = currentTetromino;
	let collision = false;
	for (let i = 0; i < tetrominoCopy.length; i++) {
		let square = tetrominoCopy[i];
		let x = square[0] + startX;
		let y = square[1] + startY;
		if (direction === DIRECTION.LEFT) {
			x--;
		} else if (direction === DIRECTION.RIGHT) {
			x++;
		}
		var stoppedShapeValue = stoppedShapeArray[x][y];
		if (typeof stoppedShapeValue === 'string') {
			collision = true;
			break;
		}
	}
	return collision;
}
