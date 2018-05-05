import './style';
import { Component } from 'preact';
import Board from './cmpts/Board';

const rows = 30; const cols = 20;

class Snake {
	constructor(points) {
		this.points = points;
	}

	moveSnake({x, y}) {
		// We can delete the last dot and add the new one at the start.

		this.points.splice(-1, 1);

		this.points.unshift(new Point(this.points[0].x + x, this.points[0].y + y))
	}

	isMoveAllowed(nextDirection, rows, cols) {
		const snakeHead = this.points[0];

		if (snakeHead.x + nextDirection.x >= cols || snakeHead.x + nextDirection.x < 0 ||
			snakeHead.y + nextDirection.y >= rows || snakeHead.y + nextDirection.y < 0) {
				return false;
			}
		return true;
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			score: 0,
			snake: null,
			direction: 1 // 1: up, 2: right, 3: down, 4: left
		};
	}

	componentWillMount = () => {
		// Initialize the starting point of the snake
		this.state.snake = new Snake([new Point(12, 10), new Point(11, 10), new Point(10, 10)]);
	}

	componentDidMount = () => {
		this.initializeMovement();
		this.attachKeyboardListeners();
	}

	componentWillUnmount = () => {
		window.document.removeEventListener('keydown', this.onKeyPress);
	}
	
	onKeyPress = ({keyCode}) => {
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
		
		this.setState({direction: keyMap[keyCode] || dir})
	}

	attachKeyboardListeners() {
		window.document.addEventListener('keydown', this.onKeyPress);
	}

	initializeMovement = () => {
		const movement = {
			1: {x: 0, y: 1},
			2: {x: 1, y: 0},
			3: {x: 0, y: -1},
			4: {x: -1, y: 0}
		};

		setInterval(() => {
			const {direction, snake} = this.state;
			const currentDirection = movement[direction];

			// Limit the movement of the snake to the walls of the board. Later we will kill the snake if it hits a wall.
			if (!snake.isMoveAllowed(currentDirection, rows, cols)) {
					return;
				}

				// change the coordinates of the snake so it moves
			snake.moveSnake(currentDirection);
			
			this.setState({ snake });
		}, 200);
	}

	render() {
		const { snake } = this.state;

		return (
			<div>
				<h1>Snake</h1>
				<div>Score: {this.state.score}</div>
				<Board rows={rows} cols={cols} snake={snake} />
			</div>
		);
	}
}
