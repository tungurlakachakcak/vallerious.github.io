import './style';
import { Component } from 'preact';
import Board from './cmpts/Board';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			score: 0
		};
	}
	render() {
		return (
			<div>
				<h1>Tetris</h1>
				<div>Score: {this.state.score}</div>
				<Board />
			</div>
		);
	}
}
