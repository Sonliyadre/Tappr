var React = require('react');
var ReactDOM = require('react-dom');


var CountDown = React.createClass({
  getInitialState: function() {
    return {
      secondsRemaining: 0
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
    console.log(this.props.handleTimerSubmit)
    this.props.handleTimerSubmit();
    },
  componentDidMount: function() {
   this.setState({ secondsRemaining: this.props.secondsRemaining });
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    console.log(this.state)
    return (
      <div>
      <div>It's time for you to register at this url:</div>
      <div>Game will start in:</div> 
      <div className="time"><span>{this.state.secondsRemaining}</span></div> 
      <div>seconds</div>
      <input className="button" type="button" value="Start the Game" onClick={this.handleTimerSubmit}/>
      </div>
    );
  }
});

/*ReactDOM.render(<Countdown secondsRemaining="300" />, document.querySelector('#timer'));
*/
module.exports = CountDown;