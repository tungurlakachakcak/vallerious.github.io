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

	renderRows(r, c, x, y) {
		const rows = [];


		for (let rowIdx = 0; rowIdx < r; rowIdx++) {
			const row = [];
			
			for (let colIdx = 0; colIdx < c; colIdx++) {
				row.push(<td style={x === colIdx && y === rowIdx ? styles.snake : {}} />);
			}

			rows.push(<tr>{row}</tr>);
		}

		return rows;
	}

	render() {
		const { rows, cols, snake } = this.props;
		const { x, y } = snake.point;
		return (
			<table style={styles.table}>
				<tbody>
					{this.renderRows(rows, cols, x, y)}
				</tbody>
			</table>
		);
	}
}