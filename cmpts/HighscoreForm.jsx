import { Component } from 'preact';

export default class HighscoreForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    };
  }

  onSave = () => {
    if (!this.state.name) return;
    this.props.saveHighscore(this.state.name);
    this.setState({name: ''});
  }

  render() {
    return (
      <div>
        <span>Game over!</span>
        <br />
        <span>Enter your name:</span>
        <br />
        <input type="text" onInput={e => this.setState({name: e.target.value})} value={this.state.name} />
        <button onClick={this.onSave}>Save</button>
      </div>
    )
  }
}