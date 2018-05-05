import { Component } from 'preact';

const styles = {
	table: {
		margin: '0 auto'
	},
	snake: {
		background: 'green'
	},
	apple: {
		background: 'red'
	}
};

export default class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	renderRows(r, c, points, apple) {
		const rows = [];

		for (let rowIdx = 0; rowIdx < r; rowIdx++) {
			const row = [];
			
			for (let colIdx = 0; colIdx < c; colIdx++) {
				const pointExistsInSnake = points.some(p => p.x === colIdx && p.y === rowIdx); // O(n3) :/ 
				const appleStyles = apple.x === colIdx && apple.y === rowIdx ? styles.apple : {};

				row.push(<td style={pointExistsInSnake ? styles.snake : appleStyles} />);
			}

			rows.push(<tr>{row}</tr>);
		}

		return rows;
	}

	render() {
		const { rows, cols, snake, apple } = this.props;

		return (
			<table style={styles.table}>
				<tbody>
					{this.renderRows(rows, cols, snake.points, apple)}
				</tbody>
			</table>
		);
	}
}