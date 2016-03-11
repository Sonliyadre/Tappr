// https://facebook.github.io/react/docs/component-specs.html

var React = require('react');
var ReactDOM = require('react-dom');

var AdminForm = require('./adminForm.js');
var CountDown = require('./countDown.js');
var LeaderBoard = require('./leaderBoard.js');
var WinnerIs = require('./winnerIs.js');

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
            that.setState({
                status: 'leaderBoard'
            })
        });
        
        //listen for tap_update
       this.state.socket.on('tap_update', function(data){
           if (that.state.status == 'leaderBoard'){
               that.setState({
                   leaderBoard: data
               });
           } else {
               var winner = { name:'faux', tap_count:1 };
               
               var sortData = function(a, b){
                   return(a.tap_count - b.tap_count);
               }
                data.sort(sortData);
                
                winner= data.pop()

               
               // Loop a travers les objets dans data
               // retourner dans variable winner celui qui a le plus haut tap_count
               
               
               console.log(data);
    
               that.setState({
                   status: 'winnerIs',
                   winner: winner
               });
           }
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
                    <div>{/*Logged In as {this.state.admin.username}*/}
                        <CountDown startGame={this.startGame} handleTimerSubmit={this.handleTimerSubmit} secondsRemaining="10"/>
                    </div>
                );
            case "leaderBoard":
            case "stop":
                return (
                    <div>
                     <LeaderBoard scores={this.state.leaderBoard}/>   
                    </div>
                    );
            case "winnerIs":
                console.log('WE SHOULD BE HERE');
                return (
                    <div>
                    <WinnerIs winner={this.state.winner}/>
                    </div>
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



/*

socket.on('pong', function(data) {
    console.log('Received event pong with data: ', data);
});

socket.on('disconnect', function(){
    console.log('Disconnected');
});*/