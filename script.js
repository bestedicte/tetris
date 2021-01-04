let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;

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
	CreateCoordinateArray();
	DrawTetromino();
}

document.addEventListener('keydown', HandleKeyPress);
CreateTetrominos();
CreateTetromino();

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
	if (key.keyCode === 65) {
		direction = DIRECTION.LEFT;
		if (!HittingTheWall()) {
			DeleteTetromino();
			startX--;
			DrawTetromino();
		}
	} else if (key.keyCode === 68) {
		direction = DIRECTION.RIGHT;
		if (!HittingTheWall()) {
			DeleteTetromino();
			startX++;
			DrawTetromino();
		}
	} else if (key.keyCode === 83) {
		direction = DIRECTION.DOWN;
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
	tetrominos.push([[1, 0], [0, 1], [1, 1][(2, 1)]]);
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
