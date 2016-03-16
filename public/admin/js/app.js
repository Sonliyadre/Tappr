// https://facebook.github.io/react/docs/component-specs.html

var React = require('react');
var ReactDOM = require('react-dom');

var AdminForm = require('./adminForm.js');
var CountDown = require('./countDown.js');
var LeaderBoard = require('./leaderBoard.js');
var WinnerIs = require('./winnerIs.js');
var Howler = require('howler').Howl;

var waitingMusic = new Howler({
            urls: ['/admin/sounds/bensound-theelevatorbossanova.mp3'],
            loop: true
        });

var leaderboardMusic = new Howler({
            urls: ['/admin/sounds/bensound-jazzyfrenchy.mp3'],
            loop: true
        });
        

var applause = new Howler({
            urls: ['/admin/sounds/Audience_Applause-Matthiew11-1206899159.mp3'],
            loop: false
        });

var SessionId = null;

var App = React.createClass({
    getInitialState: function(){
        return {
            admin: {
                username: null
            },
            status: 'loading',
            socket: io.connect(window.location.origin),
            socketId: null,
            leaderBoard: [],
            game_start: false,
            winner: {}
        };
    },
     componentWillMount: function() {
       waitingMusic.play()
    },
    componentDidMount: function(){
        var that = this;
        
        this.state.socket.on('connect', function(){
            that.setState({
                status: 'mounted',
                socketId: this.id
            });

        });
        //listen for game_start
        this.state.socket.on('game_start', function(data){
            waitingMusic.stop();
           leaderboardMusic.play();
            that.setState({
                status: 'leaderBoard',
                max: data.max
            })
        });
        
        //listen for tap_update
       this.state.socket.on('tap_update', function(data){
           if (that.state.status == 'leaderBoard'){
               that.setState({
                   leaderBoard: data
               });
           } else {
                   leaderboardMusic.stop();
                   applause.play();
                   var sortData = function(a, b){
                       return(b.tap_count - a.tap_count);
                   }
                   data.sort(sortData);
                   that.setState({
                       status: 'winnerIs',
                       winner: data[0]
                   });
               
           }
       });

       //listen for game_timer_reset ; not enough players
       this.state.socket.on('game_reset_timer', function(data){
           that.setState({
               players: data.players,
               status: 'loggedIn'
           });
           that.refs.countDown.setState({secondsRemaining: 10, players: data.players, status: 'restarted'});
           that.refs.countDown.handleTimerSubmit();
       });
       
       //listen for game_stop
       this.state.socket.on('game_stop', function(data){
           that.setState({
               status: 'stop'
           });
           that.state.socket.emit('tap_update');
       });
            
    },
    startGame: function (time){
        if(time === 0){
            this.setState({game_start: true, status: "leaderBoard"});
        }
    },
    handleSuccessfulAdminLogin: function(username) {
        this.setState({
            admin: { username: username },
            status: 'loggedIn'
        });
    },
    handleFailedAdminLogin: function() {
        this.setState({
            admin: { username: null },
            status: 'mounted'
        });
    },
    handleTimerSubmit: function(){
      this.setState({
          status: 'loggedIn',
          leaderBoard: [],
          game_start: false,
          winner: {}
      });
      this.state.socket.emit('timer_start');
    },
    render: function(){
        console.log('Rendering with status ' + this.state.status);
        var socketId = this.state.socketId;
        switch(this.state.status) {
            case "mounted":
                return (<AdminForm socketId={socketId} handleSuccessfulAdminLogin={this.handleSuccessfulAdminLogin} handleFailedAdminLogin={this.handleFailedAdminLogin} />);
            case "loggedIn":
                return (
                    <CountDown ref="countDown" startGame={this.startGame} handleTimerSubmit={this.handleTimerSubmit} secondsRemaining="10" />
                );
            case "leaderBoard":
            case "stop":
                return (
                     <LeaderBoard max={this.state.max} scores={this.state.leaderBoard}/>   
                    );
            case "winnerIs":
                return (
                    <WinnerIs winner={this.state.winner}/>
                );
            default:
                return (
                    <div>App State Status {this.state.status} Is Not Defined</div>
                );
        }
    }
});
////

ReactDOM.render(<App />, document.getElementById('app'));



/*ReactDOM.render(<WinnerIs winner={{name: 'Sonia'}}/>, document.getElementById('app'));*/



/*

socket.on('pong', function(data) {
    console.log('Received event pong with data: ', data);
});

socket.on('disconnect', function(){
    console.log('Disconnected');
});*/