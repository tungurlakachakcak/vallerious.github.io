import './style';
import { Component } from 'preact';
import Board from './cmpts/Board';

const rows = 30; const cols = 20;

class Snake {
	constructor(points) {
		this.points = points;
	}

	moveSnake({ x, y }, apple) {
		// We can delete the last dot and add the new one at the start.
		this.points.splice(-1, 1);
		this.points.unshift(new Point(this.points[0].x + x, this.points[0].y + y))

		const snakeHead = this.points[0];

		if (snakeHead.x === apple.x && snakeHead.y === apple.y) {
			return true;
		}

		return false;
	}

	grow() {
		const lastEl = Object.assign({}, this.points[this.points.length - 1]);

		this.points.push(lastEl);
	}

	isMoveInBorders(nextDirection, rows, cols) {
		const snakeHead = this.points[0];

		if (snakeHead.x + nextDirection.x >= cols || snakeHead.x + nextDirection.x < 0 ||
			snakeHead.y + nextDirection.y >= rows || snakeHead.y + nextDirection.y < 0) {
			return false;
		}
		return true;
	}

	checkIfCrashingInSelf(nextDirection) {
		let isCrashing = false;
		const snakeHead = this.points[0];

		for (let i = 0; i < this.points.length; i++) {
			const currPoint = this.points[i];
			if (snakeHead.x + nextDirection.x === currPoint.x &&
				snakeHead.y + nextDirection.y === currPoint.y) {
				isCrashing = true;
				break;
			}
		}

		return isCrashing;
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

const defaultSnakeElements = [new Point(12, 10), new Point(11, 10), new Point(10, 10)];
let int;

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			score: 0,
			snake: null,
			direction: 1, // 1: up, 2: right, 3: down, 4: left,
			lives: 3,
			apple: null,
			speed: 150,
			status: 'pause' // start or pause
		};
	}

	componentWillMount = () => {
		// Initialize the starting point of the snake
		this.setState({ snake: new Snake(Object.assign([], defaultSnakeElements)) });
		this.setState({ apple: this.generateApple(this.state.snake) })
	}

	componentDidMount = () => {
		// this.initializeMovement();
		this.attachKeyboardListeners();
	}

	componentWillUnmount = () => {
		window.document.removeEventListener('keydown', this.onKeyPress);
	}

	generateApple(snake) {
		const { points } = snake;

		let randomX, randomY;

		while (true) {
			randomX = getRandomInt(0, cols - 1);
			randomY = getRandomInt(0, rows - 1);
			let doesExists = false;

			for (let i = 0; i < points.length; i++) {
				const currentPoint = points[i];

				if (currentPoint.x === randomX && currentPoint.y === randomY) {
					doesExists = true;
					break;
				}
			}

			if (!doesExists) {
				break;
			}
		}

		return new Point(randomX, randomY);
	}

	onKeyPress = ({ keyCode }) => {
		if (keyCode === 32 && this.state.score >= 1000) {
			this.setState({ score: this.state.score - 1000, lives: this.state.lives + 1 });
			return;
		}

		if (keyCode === 13) {
			if (this.state.status === 'pause') {
				this.initializeMovement();
			} else {
				clearInterval(int);
			}
	
			this.setState({status: this.state.status === 'start' ? 'pause' : 'start'});
			return;
		}

		let dir = this.state.direction;
		const keyMap = {
			37: 4,
			38: 3,
			39: 2,
			40: 1
		};

		if ((keyMap[keyCode] === 1 && dir === 3) ||
			(keyMap[keyCode] === 3 && dir === 1) ||
			(keyMap[keyCode] === 2 && dir === 4) ||
			(keyMap[keyCode] === 4 && dir === 2)) {
			return;
		}

		this.setState({ direction: keyMap[keyCode] || dir })
	}

	attachKeyboardListeners() {
		window.document.addEventListener('keydown', this.onKeyPress);
	}

	initializeMovement = () => {
		const movement = {
			1: { x: 0, y: 1 },
			2: { x: 1, y: 0 },
			3: { x: 0, y: -1 },
			4: { x: -1, y: 0 }
		};

		int = setInterval(() => {
			const { direction, snake } = this.state;
			const currentDirection = movement[direction];

			// Limit the movement of the snake to the walls of the board. Later we will kill the snake if it hits a wall.
			if (!snake.isMoveInBorders(currentDirection, rows, cols) || snake.checkIfCrashingInSelf(currentDirection)) {
				const currentLifePoints = this.state.lives - 1;

				if (currentLifePoints <= 0) {
					this.setState({status: 'pause', lives: 3, score: 0, snake: new Snake(Object.assign([], defaultSnakeElements))});
					clearInterval(int);
				} else {
					this.setState({ lives: currentLifePoints, snake: new Snake(Object.assign([], defaultSnakeElements)), direction: 1 });
				}
				return;
			}

			// change the coordinates of the snake so it moves
			const hasCauthApple = snake.moveSnake(currentDirection, this.state.apple);

			if (hasCauthApple) {
				snake.grow();
				this.setState({ score: this.state.score + 100, apple: this.generateApple(this.state.snake) });
			}

			this.setState({ snake });
		}, this.state.speed);
	}

	render() {
		const { snake, apple, status } = this.state;

		return (
			<div className="wrapper-game">
				<h1>Snake</h1>
				<div className="row">
					<div className="col-1 p-10 text-right">
						<div><strong className="label">Score:</strong> {this.state.score}</div>
						<div><strong className="label">Lives:</strong> {this.state.lives}</div>
					</div>
					<div className="col-1">
						<div>
							<Board rows={rows} cols={cols} snake={snake} apple={apple} />
						</div>
					</div>
					<div className="col-1">
						<div><em>*Press enter to start/pause game.</em></div>
						<div><em>*Press space to exchange 1000 points for 1 life.</em></div>
					</div>
				</div>
			</div>
		);
	}
}
