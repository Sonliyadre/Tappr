// https://facebook.github.io/react/docs/component-specs.html

var React = require('react');
var ReactDOM = require('react-dom');

var AdminForm = require('./adminForm.js');
var CountDown = require('./countDown.js');

var SessionId = null;

var App = React.createClass({
    getInitialState: function(){
        return {
            admin: {
                username: null
            },
            status: 'loading',
            socket: io.connect(window.location.origin),
            socketId: null
        };
    },
    /*
    componentWillMount: function(){
        this.setState({
            socket: io.connect(window.location.origin)
        });
    },*/
    componentDidMount: function(){
        var that = this;
        this.state.socket.on('connect', function(){
            that.setState({
                status: 'mounted',
                socketId: this.id
            });
            
        });
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
        var socketId = this.state.socketId
        switch(this.state.status) {
            case "mounted":
                return (<AdminForm socketId={socketId} handleSuccessfulAdminLogin={this.handleSuccessfulAdminLogin} handleFailedAdminLogin={this.handleFailedAdminLogin} />);
            case "loggedIn":
                return (
                    <div>Logged In as {this.state.admin.username}
                        <CountDown handleTimerSubmit={this.handleTimerSubmit} secondsRemaining="300"/>
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