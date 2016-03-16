var React = require('react');
var ReactDOM = require('react-dom');


var CountDown = React.createClass({
  getInitialState: function() {
    return {
      secondsRemaining: 0,
      url: window.location.protocol + '//' + window.location.hostname,
      status: 'started',
      players: null,
      interval: null
    };
  },
  tick: function() {
    this.setState({secondsRemaining: this.state.secondsRemaining - 1});
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.state.interval);
    }
  },
  handleTimerSubmit: function(){
    event.preventDefault();
    clearInterval(this.state.interval);
    var interval = setInterval(this.tick, 1000);
    this.setState({ interval: interval });
    console.log(this.props.handleTimerSubmit);
    if (this.state.status === 'started') {
      this.props.handleTimerSubmit();
    }
  },
  componentDidMount: function() {
   this.setState({ secondsRemaining: this.props.secondsRemaining });
  },
  componentWillUnmount: function() {
    clearInterval(this.state.interval);
  },
  render: function() {
    if (this.state.status === 'started') {
      return (
        <div className="waiting">
        <div className="header">
        <h1 className="size-small">Get tappin’</h1>
        <h2 className="size-small">http://cheekybeaversgame.com</h2>
        </div>
        <div className="counter">
        <h1 className="start size-small">Game will start in:</h1>
        <div className="time size-medium">{this.state.secondsRemaining}</div>
        <h2 className="size-small">seconds</h2>
        <input className="button size-small" type="button" value="Start the Game" onClick={this.handleTimerSubmit}/>
        </div>
        <div className="movingCloud2"><img src="/admin/img/cloud-small.png"/></div>
        <div className="movingCloud"><img src="/admin/img/cloud-small.png"/></div>
        </div>
      );
    } else {
       return (
        <div className="waiting">
        <div className="header">
        <h1 className="size-small">WE NEED MORE THAN {this.state.players} PLAYERS!</h1>
        <h2 className="size-small">http://cheekybeaversgame.com</h2>
        </div>
        <div className="counter">
        <h1 className="start size-small">Game will restart in:</h1>
        <div className="time size-medium">{this.state.secondsRemaining}</div>
        <h2 className="size-small">seconds</h2>
        <input className="button size-small" type="button" value="Start the Game" onClick={this.handleTimerSubmit}/>
        </div>
        <div className="movingCloud2"><img src="/admin/img/cloud-small.png"/></div>
        <div className="movingCloud"><img src="/admin/img/cloud-small.png"/></div>
        </div>
      );
    }
  }
});

module.exports = CountDown;