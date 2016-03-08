// https://facebook.github.io/react/docs/component-specs.html

var React = require('react');
var ReactDOM = require('react-dom');

var AdminForm = require(__dirname + '/adminForm');
var CountDown = require(__dirname + '/countDown');

var App = React.createClass({
    getInitialState: function(){
        return {
            admin: {
                username: null
            },
            status: 'loading',
            socket: null
        };
    },
    /*
    componentWillMount: function(){
        this.setState({
            socket: io.connect(window.location.origin)
        });
    },*/
    componentDidMount: function(){
        this.setState({
            status: 'mounted',
            socket: io.connect(window.location.origin)
        });
    }, 
    render: function(){
        switch(this.state.status) {
            case "mounted":
                return (<AdminForm handleSuccessfulAdminLogin={this.handleSuccessfulAdminLogin} handleFailedAdminLogin={this.handleFailedAdminLogin} />);
            case "loggedIn":
                return (<div>Logged In as {this.state.admin.username}</div>);
            default:
                return (
                    <div>App State Status {this.state.status} Is Not Defined</div>
                );
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
    }
});

ReactDOM.render(<App />, document.getElementById('app'));















/*
var socket = io.connect(window.location.origin);

socket.on('connect', function(){
    console.log('Connected');
});

socket.on('pong', function(data) {
    console.log('Received event pong with data: ', data);
});

socket.on('disconnect', function(){
    console.log('Disconnected');
});
*/