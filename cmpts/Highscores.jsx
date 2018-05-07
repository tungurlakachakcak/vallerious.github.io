import { Component } from 'preact';

export default class Highscores extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderHighscores = (highScores) => {
    let lis = [];

    for (let i = 0; i < highScores.length; i++) {
      lis.push(<li key={i}>{highScores[i].name} - {highScores[i].score}</li>)
    }

    return lis;
  }

  render() {
    const {highScores} = this.props;
    return (
      <div>
        <ol>
          {this.renderHighscores(highScores)}
        </ol>
      </div>
    );
  }
}