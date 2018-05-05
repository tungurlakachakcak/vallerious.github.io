import { Component } from 'preact';

const styles = {
	table: {
		margin: '0 auto'
	},
	snake: {
		background: 'green'
	}
};

export default class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	renderRows(r, c, points) {
		const rows = [];

		for (let rowIdx = 0; rowIdx < r; rowIdx++) {
			const row = [];
			
			for (let colIdx = 0; colIdx < c; colIdx++) {
				const pointExistsInSnake = points.some(p => p.x === colIdx && p.y === rowIdx)
				row.push(<td style={pointExistsInSnake ? styles.snake : {}} />);
			}

			rows.push(<tr>{row}</tr>);
		}

		return rows;
	}

	render() {
		const { rows, cols, snake } = this.props;

		return (
			<table style={styles.table}>
				<tbody>
					{this.renderRows(rows, cols, snake.points)}
				</tbody>
			</table>
		);
	}
}