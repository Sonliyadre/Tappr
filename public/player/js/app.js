var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  getInitialState: function(){
    return {
      player: {name: null, valid:false}, 
      status: 'loading',
      input: "",
      socket: null
    };
  },
  componentWillMount: function(){
    if (window.WebSocket) {
      var socket = io.connect(window.location.origin)
      socket.on('add_player', this.handleAddPlayerSocketEvent);
      socket.on('game_start', this.handleStartGameSocketEvent);
      socket.on('game_stop', this.handleEndGameSocketEvent);
      socket.on('game_status', this.handleCheckGameStatus);
      this.setState({
        status: 'login',
        socket: socket
      });
     
    } else {
      this.setState({
        status: 'incompatible'
      });
    }
  },
  componentDidMount: function() {
    var that = this;
    //create a set interval to do a game_status check on whether someone can log in
    setInterval(function(){
      that.state.socket.emit('game_status');
    }, 1000);
  },
  //see where the game is at: started, waiting, or stopped
  handleCheckGameStatus: function(data){
    if (this.state.status !== data.status){
      if (data.status === 'started'){
        if (this.state.status === 'started' || this.state.status === 'login' || this.state.status == 'game_already_started') {
          this.setState({
            status:'game_already_started'
          });
        } else {
          this.setState({
            status:'started'
          });
        }
      }
     if (data.status === 'waiting'){
        this.setState({
          status: 'login'
        });
      }
     if (data.status === 'stopped'){
        if (this.state.status === 'started') {
          this.setState({
            status: 'game_ended'
          });
        }
        else {
          this.setState({
            status: 'game_stopped'
          });
        }
     }
    }
  },
  //When I get a confirmation from the server that the username is unique
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
  //this is referring to the name input in the login form
  handleChange: function(event){
    this.setState({
      input: event.target.value
      
    });
  },
  //When the submit button is clicked, it transmit the info to the server
  handleSubmit: function(event){
    event.preventDefault();
    var player = {
      name: this.state.input
    };
    console.log(player)
    this.state.socket.emit('add_player', player);
    this.setState(player);
  },
  //When I receive the notification from the server, the game will begin
  handleStartGameSocketEvent: function(data){
    console.log('received start game with ', data);
    if (data === 'game_start'){
      this.setState({
        status: 'started'
      });
    }
  },
  // When someone taps, I send a click notification to the server
  handleTap: function(event){
    event.preventDefault();
    this.state.socket.emit('player_click');
  },
  //When I am told the game is over, I'll display who the game winner and losers are depending on the info I receive y
  handleEndGameSocketEvent: function(data){
    if (data === 'game_stop'){
      this.setState({
        status: 'game_ended'
      });
    //   if (data.winner === true){
    //   this.setState({
    //     status: 'game_winner'
    //   });
    // }
    // else {
    //   this.setState({
    //     status: 'game_loser'
    //   });
    // }
    }
    console.log('received end game with ', data);
    
  },
  
  render: function(){
    //check status of browser
    if (this.state.status === 'incompatible') {
      alert("Ruh Roh! It don't werk! Try a more modern browser.");
    }
    // check if game has already started
    if (this.state.status === 'game_already_started'){
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
    //game started tap game
    if (this.state.status === 'started'){
      return (
        <div>
          <button className = 'tap_button' onClick={this.handleTap}>Tap Me!</button>
        </div>
        );
    }
    // game stopped - trying to login before timer has begun/between games
    if (this.state.status === 'game_stopped'){
      return (
        <div>
          <h1>Hang tight! The next game will start shortly.</h1>
        </div>
        )
    }
    //game ended
    if (this.state.status === 'game_ended'){
      return (
        <div>
          <h1>Game has ended and I don't know how to announce the winner yet!</h1>
        </div>
        )
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

// App does not render game, goes form "Hold Horses" to "sorry game already started"
//Check line 44