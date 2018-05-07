import './style';
import { Component } from 'preact';
import Board from './cmpts/Board';
import Snake from './models/Snake';
import Point from './models/Point';
import firebase from './firebaseSetup';
import Highscores from './cmpts/Highscores';
import HighscoreForm from './cmpts/HighscoreForm';
import Summary from './cmpts/Summary';

const rows = 30;
const cols = 20;
const defaultSnakeElements = [new Point(12, 10), new Point(11, 10), new Point(10, 10)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
let int;

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
			status: 'pause', // start or pause,
			highScores: [],
			gameOver: false,
			name: '',
			lastHighScore: 0,
			currentPage: 'snake'
		};
	}

	componentWillMount = () => {
		// Initialize the starting point of the snake
		this.setState({ snake: new Snake(Object.assign([], defaultSnakeElements)) });
		this.setState({ apple: this.generateApple(this.state.snake) })
	}

	componentDidMount = () => {
		this.attachKeyboardListeners();
		this.getHighScores();
	}

	componentWillUnmount = () => {
		window.document.removeEventListener('keydown', this.onKeyPress);
	}

	getHighScores = () => {
		firebase.database().ref('/').once('value')
			.then(snapshop => {
				const hiscores = snapshop.val();
				const bestScoresArray = Object.keys(hiscores).map(k => {
					return { name: k, score: hiscores[k] };
				});
				bestScoresArray.sort((a, v) => v.score - a.score);
				this.setState({ highScores: bestScoresArray.slice(0, 10) });
			});
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
		const { score, status, lives, direction } = this.state;

		if (keyCode === 32 && score >= 1000) {
			this.setState({ score: score - 1000, lives: lives + 1 });
			return;
		}

		if (keyCode === 13) {
			if (status === 'pause') {
				this.setState({ gameOver: false });
				this.initializeMovement();
			} else {
				clearInterval(int);
			}

			this.setState({ status: status === 'start' ? 'pause' : 'start' });
			return;
		}

		let dir = direction;
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
			const { direction, snake, score, lives, apple } = this.state;
			const currentDirection = movement[direction];

			// Limit the movement of the snake to the walls of the board. Later we will kill the snake if it hits a wall.
			if (!snake.isMoveInBorders(currentDirection, rows, cols) || snake.checkIfCrashingInSelf(currentDirection)) {
				const currentLifePoints = lives - 1;

				if (currentLifePoints <= 0) {
					this.setState({ lastHighScore: score, status: 'pause', lives: 3, gameOver: true, score: 0, snake: new Snake(Object.assign([], defaultSnakeElements)) });
					clearInterval(int);
				} else {
					this.setState({ lives: currentLifePoints, snake: new Snake(Object.assign([], defaultSnakeElements)), direction: 1 });
				}
				return;
			}

			// change the coordinates of the snake so it moves
			const hasCauthApple = snake.moveSnake(currentDirection, apple);

			if (hasCauthApple) {
				snake.grow();
				this.setState({ score: score + 100, apple: this.generateApple(snake) });
			}

			this.setState({ snake });
		}, this.state.speed);
	}

	saveHighscore = (name) => {
		// lets send it to backend
		const updates = {};

		updates[name] = this.state.lastHighScore;
		firebase.database().ref().update(updates).then(() => {
			this.getHighScores();
		});

		this.setState({ lastHighScore: 0, gameOver: false });
	}

	togglePage = e => {
		e.preventDefault();

		this.setState({ currentPage: this.state.currentPage === 'snake' ? 'cv' : 'snake' });
	}

	render() {
		const { snake, apple, status, highScores, gameOver, currentPage } = this.state;

		return (
			<div>
				<header>
					<a href="#" onClick={this.togglePage}>{currentPage === 'snake' ? 'About Me' : 'Snake Game'}</a>
				</header>
				{currentPage === 'snake' ?
				<div>
					<h1 className="text-center mb-5">Snake</h1>
					<div className="row mr-0 ml-0">
						<div className="col-4 p-10 text-right">
							<div><strong className="label">Score:</strong> {this.state.score}</div>
							<div><strong className="label">Lives:</strong> {this.state.lives}</div>
						</div>
						<div className="col-4">
							<div>
								<Board rows={rows} cols={cols} snake={snake} apple={apple} />
							</div>
						</div>
						<div className="col-3">
							<div><em>*Press enter to start/pause game.</em></div>
							<div className="mb-3"><em>*Press space to exchange 1000 points for 1 life.</em></div>
							<Highscores highScores={highScores} />
							{gameOver ? <HighscoreForm saveHighscore={this.saveHighscore} /> : null}
						</div>
					</div>
				</div> : <Summary />}
			</div>
		);
	}
}
