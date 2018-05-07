import Point from './Point';

export default class Snake {
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