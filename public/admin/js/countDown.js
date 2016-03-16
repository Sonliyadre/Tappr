var React = require('react');
var ReactDOM = require('react-dom');


var CountDown = React.createClass({
  getInitialState: function() {
    return {
      secondsRemaining: 0,
      url: window.location.protocol + '//' + window.location.hostname,
      status: 'started',
      players: null
    };
  },
  tick: function() {
    this.setState({secondsRemaining: this.state.secondsRemaining - 1});
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval);
    }
  },
  handleTimerSubmit: function(){
      event.preventDefault();
    this.interval = setInterval(this.tick, 1000);
    console.log(this.props.handleTimerSubmit);
    if (this.state.status === 'started') {
      this.props.handleTimerSubmit();
    }
    },
  componentDidMount: function() {
   this.setState({ secondsRemaining: this.props.secondsRemaining });
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    if (this.state.status === 'started') {
      return (
        <div className="waiting">
        <div className="header">
        <div className="movingCloud"><img src="/admin/img/cloud-small.png"/></div>
        <h2>It's time for you to register at this url: {this.state.url}</h2>
        <h1>Game will start in:</h1>
        </div>
        <div className="counter">
        <div className="time">{this.state.secondsRemaining}</div>
        <h2>seconds</h2>
        <input className="button" type="button" value="Start the Game" onClick={this.handleTimerSubmit}/>
        </div>
        </div>
      );
    } else {
       return (
        <div className="waiting">
        <div className="header">
        <div className="movingCloud"><img src="/admin/img/cloud-small.png"/></div>
        <h1>WE NEED MORE THAN {this.state.players} PLAYERS!</h1>
        <h2>It's time for you to register at this url: {this.state.url}</h2>
        <h1>Game will restart in:</h1>
        </div>
        <div className="counter">
        <div className="time">{this.state.secondsRemaining}</div>
        <h2>seconds</h2>
        </div>
        </div>
      );
    }
  }
});

/*ReactDOM.render(<Countdown secondsRemaining="300" />, document.querySelector('#timer'));
*/
module.exports = CountDown;