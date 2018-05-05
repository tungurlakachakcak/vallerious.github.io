import './style';
import { Component } from 'preact';
import Board from './cmpts/Board';

const rows = 30; const cols = 20;

class Snake {
	constructor(point) {
		this.point = point;
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
			snake: null
		};
	}

	componentWillMount = () => {
		this.state.snake = new Snake(new Point(10, 10));
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
