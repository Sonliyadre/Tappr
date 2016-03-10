// https://facebook.github.io/react/docs/component-specs.html

var React = require('react');
var ReactDOM = require('react-dom');
var BarChart = require("react-chartjs").bar;

var AdminForm = require('./adminForm.js');
var CountDown = require('./countDown.js');
var LeaderBoard = require('./leaderBoard.js');

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
            game_start: false
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
       console.log(data);
       if (that.state.status != 'stop'){
           that.setState({
               leaderBoard: data
           });
       }
       else {
           console.log('last information');
       }
       });
           
       //listen for game_stop
       this.state.socket.on('game_stop', function(data){
           that.setState({
               status: 'stop'
           })
           setTimeout(function(){
               that.state.socket.emit('tap_update');
           },1000)
               
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
                    return (
                        <div>
                         <LeaderBoard scores={this.state.leaderBoard}/>   
                        </div>
                        
                        );
            default:
                return (
                    <div>App State Status {this.state.status} Is Not Defined</div>
                );
        }
    }
});


ReactDOM.render(<App />, document.getElementById('app'));



/*

socket.on('pong', function(data) {
    console.log('Received event pong with data: ', data);
});

socket.on('disconnect', function(){
    console.log('Disconnected');
});*/