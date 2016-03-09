var React = require('react');
var ReactDOM = require('react-dom');
  
// var Store = require(__dirname + '/store');

var App = React.createClass({
  getInitialState: function(){
    
    return {
      player: {name: null, valid:false}, 
      status: 'loading',
      input: "",
      socket: null,
    };
  },
  componentWillMount: function(){
    if (window.WebSocket) {
      var socket = io.connect(window.location.origin)
      this.setState({
        status: 'login',
        socket: socket
      });
      socket.on('add_player', this.handleAddPlayerSocketEvent);
      socket.on('game_start', this.handleStartGameSocketEvent);
      socket.on('game_stop', this.handleEndGameSocketEvent);
      socket.on('game_status', this.handleCheckGameStatus);
    } else {
      this.setState({
        status: 'incompatible'
      });
    }
  },
  componentDidMount: function() {
    //create a set interval to do a game_status check on whether someone can log in
    setInterval(function(data){
      this.state.socket.emit('game_status');
    }, 5000);
  },
  handleCheckGameStatus: function(data){
     if (data.status === 'started'){
        this.setState({
          status:'game_already_started'
        });
      }
      else if (data.status === 'waiting'){
        this.setState({
          status: 'login'
        });
      }
      else {
        this.setState({
          status: 'game_stopped'
        })
      }
  },
  handleAddPlayerSocketEvent: function(data) {
    if (data.addition === true) {
     this.setState({
       status:'waiting'
     });
    }
    else {
      this.setState({
        status: 'bad_name',
        player: {name: this.state.player.name, valid:true}
      });
    }
  },
  handleChange: function(event){
    this.setState({
      input: event.target.value
      
    });
  },

  handleSubmit: function(event){
    event.preventDefault();
    var player = {
      player: this.state.input
    };
    this.state.socket.emit('add_player', this.state.player);
    
    this.setState(player);
  },
  handleStartGameSocketEvent: function(data){
    if (data.started === true){
      this.setState({
        status: 'game_started'
      });
    }
  },
  handleTap: function(event){
    event.preventDefault();
    this.state.socket.emit('player_click');
  },
  handleEndGameSocketEvent: function(data){
    if (data.winner === true){
      this.setState({
        status: 'game_winner'
      });
    }
    else {
      this.setState({
        status: 'game_loser'
      });
    }
  },
  
  render: function(){
    //check status of browser
    if (this.state.status === 'incompatible') {
      alert("Ruh Roh! It don't werk! Try a more modern browser.");
    }
    // check if game has already started
    if (this.set.status === 'game_already_started'){
      return (
        <div>
          <h1>Sorry! The game has already started. Wait here for the next game to start.</h1>
        </div>
        );
    }
    //login form
    if (this.state.status === 'login'){
      return (
        <form className="login">
            <input className="login_Name" type="text" onChange={this.handleChange} value={this.state.input}/>
            <button className='login' onClick={this.handleSubmit}>Play!</button>
        </form>
        );
    }
    //waiting page
    if (this.state.status === 'waiting'){
      return (
        <div>Hold your horses!</div>
        );
    }
    // bad username
    if (this.state.status === 'bad_name'){
      return (
        <div>
          <h1>Sorry! That name is already taken!</h1>
          <form className="login">
              <input className="login_Name" type="text" onChange={this.handleChange} value={this.state.input}/>
              <button className='login' onClick={this.handleSubmit}>Play!</button>
          </form>
        </div>
        );
    }
    //game started - tap screen
    if (this.state.status === 'game_started'){
      return (
        <div>
          <button className = 'tap_button' onClick={this.handleTap}>Tap Me!</button>
        </div>
        );
    }
    // game winner
    if (this.state.status === 'game_winner'){
      return (
        <div>
          <h1>Winner! Winner! Chicken Dinner!</h1>
        </div>
        );
    }
    //game losers
    if (this.state.status === 'game_loser'){
      return (
        <div>
          <h1>Not fast enough! You lose!</h1>
        </div>
        );
    }
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
