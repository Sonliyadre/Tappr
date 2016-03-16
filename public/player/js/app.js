var React = require('react');
var ReactDOM = require('react-dom');
var Howler = require('howler').Howl;
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var Slider = require('./slider');

var sounds = {
  freeze: new Howler({
            urls: ['player/sounds/flyby-Conor-1500306612.mp3'],
            loop: false
        }),
  plusTen: new Howler({
            urls: ['player/sounds/glass_ping-Go445-1207030150.mp3'],
            volume: 0.25,
            loop: false
        }),
  dbltap: new Howler({
            urls: ['player/sounds/Power-Up-KP-1879176533.mp3'],
            loop: false
        }),
  leech: new Howler({
            urls: ['player/sounds/Slap-SoundMaster13-49669815.mp3'],
            loop: false
        }),
  loseTen: new Howler({
            urls: ['player/sounds/Swords_Collide-Sound_Explorer-2015600826.mp3'],
            loop: false
        }),
  half: new Howler({
            urls: ['player/sounds/Water Noise-SoundBible.com-204152072 (mp3cut.net).mp3'],
            loop: false
        }),
  winner: new Howler({
            urls: ['player/sounds/Short_triumphal_fanfare-John_Stracke-815794903.mp3'],
            loop: false,
            volume: 1
        }),
  loser: new Howler({
            urls: ['player/sounds/Sad_Trombone-Joe_Lamb-665429450.mp3'],
            loop: false
        }) 
};

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
      socket.on('game_restart', this.handleGameRestart);
      socket.on('tap_update', this.handleGameWinner);
      socket.on('effect-lasting', this.handleEffectLasting);
      socket.on('effect-instant', this.handleEffectInstant);
      this.setState({
        status: 'game_ended',
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
  //game restart
  handleGameRestart: function(data) {
    console.log('received game restart');
    this.setState({
      player: {name: null, valid:false}, 
      status: 'loading',
      substatus: 'none',
      calculated: true,
      input: "",
      effectStatus: []
    });//
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
    else if (data.addition === false) {
      this.setState({
        substatus: 'bad_name'
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
  handleClick: function(event){
    event.preventDefault();
    this.state.socket.emit('player_click');
  },
  handleTouchTap: function(event){
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
      sounds[data.type].play();
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
      sounds[data.type].play();
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
      }, 1000);////
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
        sounds['winner'].play();
        this.setState({
          substatus: 'game_winner',
          calculated: true
        });
      }
      else {
        sounds['loser'].play();
        this.setState({
          substatus: 'game_loser',
          calculated: true //
        });
      }
    }
  },
  ////
  render: function(){
    //check status of browser
    if (this.state.status === 'incompatible') {
      alert("Ruh Roh! It don't werk! Try a more modern browser.");
    }//
    // check if game has already started
    if (this.state.status === 'game_already_started'){
      return (
        <div className='game_started'>
          <h1 className='title'>Cheeky Beavers</h1>
          <h3 className='subTitle'>Sorry! The game has already started. Wait here for the next game to start.</h3>
          <p className= 'Developed by Sonliyadre for DecodeMTL'></p>
        </div>
        );
    }
    //login form
    
    if (this.state.status === 'login'){
      var login_string = 'Pick a name, any name!'
      if (this.state.substatus === 'bad_name'){
        login_string = 'Sorry! That name is already taken! Try being more original.';
      }
      return (
        <div className='login_page'>
          <h1 className='title'>Cheeky Beavers</h1>
          <h2 className='subTitle'>{login_string}</h2>
          <form className="login">
              <input className="login_name" type="text" onChange={this.handleChange} value={this.state.input}/>
              <button id='login_button' onClick={this.handleSubmit}>Play!</button>
          </form>
        </div>
        );
    }
    //waiting page
    if (this.state.status === 'waiting'){
      return (<div className='waiting_page'>
          <h1 className='title'>Cheeky Beavers</h1>
          <h3 className='subTitle'>We're waiting for more players to join. But since we're here...</h3>
          <Slider />
      </div>);
    }
    // bad username
    if (this.state.status === 'bad_name'){
      return (
        <div className='bad_name'>
          <h1 className='title'>Cheeky Beavers</h1>
          <h3 className='subTitle'>Sorry! That name is already taken! Try being more original.</h3>
          <form className="login">
              <input className="login_name" type="text" onChange={this.handleChange} value={this.state.input}/>
              <button className='login_button' onClick={this.handleSubmit}>Play!</button>
          </form>
        </div>
        );
    }
    //game started tap game
     if (this.state.status === 'started'){
        var buttonImg = '/player/images/normalBeaverButton-1.png';
        var buttonString = 'Tapity tap tap!';
        if (this.state.effectStatus.indexOf('freeze') !== -1){
          buttonImg = '/player/images/icedBeaverButton.png';
          buttonString = "You're frozen! Tappy no worky.";
        } else if (this.state.effectStatus.indexOf('half') !== -1){
          buttonString = "Dam you! You've lost half your dam!";
        } else if (this.state.effectStatus.indexOf('leech') !== -1){
          buttonImg = '/player/images/cheekyBeaverButton.png';
          buttonString = "Someone is stealing your logs!";
        } else if (this.state.effectStatus.indexOf('dbltap') !== -1){
          buttonImg = '/player/images/doubleTapButton.png';
          buttonString = "Look at you go! You're building twice as fast!";
        }
        else if (this.state.effectStatus.indexOf('plusTen') !== -1){
          buttonString = '+10 logs';
        }
        else if (this.state.effectStatus.indexOf('loseTen') !== -1){
          buttonString ='-10 logs';
        }
        return (
          <div className= 'game_play'>
            <h3 className = 'button_text'>{buttonString}</h3>
            <input id='fade' type='image' className = {this.state.effectStatus.concat(['tap_button']).join('_')} src={buttonImg} onTouchTap={this.handleTouchTap} onClick={this.handleClick}/>
          </div>
        );
    }
    // game winner
    if (this.state.substatus === 'game_winner'){
      return (
        <div className='game_winner'>
          <h1 className='title'>Woooo!! You won!</h1>
          <img src="/player/images/coupe.png"/>
        </div>
        );
    }
    //game losers
    if (this.state.substatus === 'game_loser'){
      return (
        <div className= 'game_loser'>
          <h1 className= 'title'>Not fast enough! You lose!</h1>
          <img src="/player/images/cryingBeaver.png"/>
        </div>
        );
    }
    //game ended
    if (this.state.status === 'game_ended'){
      return (
        <div className='title_page'>
          <h1 className='title'>Cheeky Beavers</h1>
          <h3 className='subTitle'>Dam'd if you do. Dam'd if you don't.</h3>
          <p className='title_instructions'>Your game is loading!</p>
          <p className='footer'>Developed by Sonliyadre for DecodeMTL</p>
        </div>
        );
    }
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
