import './style';
import { Component } from 'preact';
import Board from './cmpts/Board';

const rows = 30; const cols = 20;

class Snake {
	constructor(point) {
		this.point = point;
	}

	incrementX(x) {
		this.point.x += x;
	}

	incrementY(y) {
		this.point.y += y;
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
		this.state.snake = new Snake(new Point(10, 10));
	}

	componentDidMount = () => {
		this.initializeMovement();
		this.attachKeyboardListeners();
	}

	componentWillUnmount = () => {
		window.document.removeEventListener('keydown', this.onKeyPress);
	}
	
	onKeyPress = (e) => {
		let dir = this.state.direction;
		const keyMap = {
			37: 4,
			38: 3,
			39: 2,
			40: 1
		};
		
		this.setState({direction: keyMap[e.keyCode] || dir})
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
			if (snake.point.x + currentDirection.x >= cols || snake.point.x + currentDirection.x < 0 ||
				snake.point.y + currentDirection.y >= rows || snake.point.y + currentDirection.y < 0) {
					return;
				}
			snake.incrementX(currentDirection.x);
			snake.incrementY(currentDirection.y);
			
			// Limit the movement of the snake to the walls of the board. Later we will kill the snake if it hits a wall.

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
