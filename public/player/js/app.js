var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  getInitialState: function(){
    return {
      player: {name: null, valid:false}, 
      status: 'loading',
      substatus: 'none',
      calculated: true,
      input: "",
      socket: null,
      effectStatus: [],
    };
  },
  componentWillMount: function(){
    if (window.WebSocket) {
      var socket = io.connect(window.location.origin)
      socket.on('add_player', this.handleAddPlayerSocketEvent);
      socket.on('game_start', this.handleStartGameSocketEvent);
      socket.on('game_status', this.handleCheckGameStatus);
      socket.on('tap_update', this.handleGameWinner);
      socket.on('effect-lasting', this.handleEffectLasting);
      socket.on('effect-instant', this.handleEffectInstant);
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
          this.state.socket.emit('tap_update', {});
          this.setState({
            status: 'game_ended',
            effectStatus: []
          });
     }
    }
  },
  //When I get a confirmation from the server that the username is unique
  handleAddPlayerSocketEvent: function(data) {
    if (data.addition === true) {
     this.setState({
       status:'waiting',
       player: {name: this.state.player.name, valid:true},
       calculated: false
     });
    }
    else {
      this.setState({
        status: 'bad_name'
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
    this.state.socket.emit('add_player', player);
    this.setState({ player: player });
  },
  //When I receive the notification from the server, the game will begin
  handleStartGameSocketEvent: function(data){
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
  
  //POWER UPS
  
  // Effect Lasting Power ups
  handleEffectLasting: function(data){
    if (data.status === 'active') {
      console.log(data.type + ' is now active');
      var newEffectStatus = this.state.effectStatus;
      newEffectStatus.push(data.type);
      this.setState({
        effectStatus: newEffectStatus
      });
    } else {
      console.log(data.type + ' is now inactive');
      var effectIndex = this.state.effectStatus.indexOf(data.type);
      if (effectIndex != -1) {
        var newEffectStatus = this.state.effectStatus;
        delete newEffectStatus[effectIndex];
        this.setState(function() {
          effectStatus: newEffectStatus
        });
      }
    }
  },
  
  // Effect Instant Power ups
  handleEffectInstant: function(data){
      var that = this;
      var newEffectStatus = this.state.effectStatus;
      newEffectStatus.push(data.type);
      this.setState({
        effectStatus: newEffectStatus
      });
      setTimeout(function(){
        var effectIndex = that.state.effectStatus.indexOf(data.type);
        if (effectIndex != -1) {
          delete newEffectStatus[effectIndex];
          that.setState({
            effectStatus: newEffectStatus
          });
        }
      }, 1000);
  },
  
 // Determines winner of game and announces on the device
  handleGameWinner: function(data){
    if (this.state.status == 'game_ended' && this.state.calculated === false) {
      var myTapCount = 0;
      var maxTapCount = 0;
      for (var index in data){
        if (data[index].name == this.state.player.name) {
          myTapCount = data[index].tap_count;
        }
        if (maxTapCount < data[index].tap_count) {
          maxTapCount = data[index].tap_count;
        }
      }
      if (myTapCount >= maxTapCount){
        this.setState({
          substatus: 'game_winner',
          calculated: true
        });
      }
      else {
        this.setState({
          substatus: 'game_loser',
          calculated: true
        });
      }
    }
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
        <div>
          <h2>Pick a name, any name.</h2>
          <form className="login">
              <input className="login_Name" type="text" onChange={this.handleChange} value={this.state.input}/>
              <button className='login' onClick={this.handleSubmit}>Play!</button>
          </form>
        </div>
        );
    }
    //waiting page
    if (this.state.status === 'waiting'){
      return (
        <h1>Hang tight! The game will start soon.</h1>
        );
    }
    // bad username
    if (this.state.status === 'bad_name'){
      return (
        <div>
          <h2>Sorry! That name is already taken! Try being more original.</h2>
          <form className="login">
              <input className="login_Name" type="text" onChange={this.handleChange} value={this.state.input}/>
              <button className='login' onClick={this.handleSubmit}>Play!</button>
          </form>
        </div>
        );
    }
    //game started tap game
    if (this.state.status === 'started'){
        var buttonString = 'Tapity tap tap!';
        if (this.state.effectStatus.indexOf('freeze') !== -1){
          buttonString = "You're frozen! Tappy no worky."
        } else if (this.state.effectStatus.indexOf('half') !== -1){
          buttonString = "Goodbye taps! Half your taps are lost"
        } else if (this.state.effectStatus.indexOf('leech') !== -1){
          buttonString = "Someone's stolen your tap!"
        } else if (this.state.effectStatus.indexOf('dbltap') !== -1){
          buttonString = 'Double time!'
        }
        return (
          <div>
            <button className = {this.state.effectStatus.concat(['tap_button']).join(' ')} onClick={this.handleTap}>{buttonString}</button>
          </div>
        );
    }
        // game winner
    if (this.state.substatus === 'game_winner'){
      return (
        <div>
          <h1>Winner! Winner! Chicken Dinner!</h1>
        </div>
        );
    }
    //game losers
    if (this.state.substatus === 'game_loser'){
      return (
        <div>
          <h1>Not fast enough! You lose!</h1>
        </div>
        );
    }
    //game ended
    if (this.state.status === 'game_ended'){
      return (
        <div>
          <h1>Welcome to Tappr! Your game will start soon.</h1>
        </div>
        );
    }
  }
});

ReactDOM.render(<App />, document.getElementById('app'));

// App does not render game, goes form "Hold Horses" to "sorry game already started"
//Check line 44