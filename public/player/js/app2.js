// https://facebook.github.io/react/docs/component-specs.html

var React    = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;

var Store = require(__dirname + '/store');

//initial state
var App = React.createClass({
  render: function() {
    Store.version = '2.0';
    return (
      <main>
        {this.props.children}
      </main>
    );
  }
});

var Home = React.createClass({
  getInitialState: function(){
    return {
      input: ""
    };
  },
   goToLogin: function(){
     
   browserHistory.push('/login');
  },
  render: function(){
    //alert(Store.version);
    console.log ("go to login");
    return (<div></div>);
  }
  
});
  
//login page
var Login = React.createClass({
  componentDidMount: function() {
    if (window.WebSocket) {
      Store.socket =  io.connect(window.location.origin);
      Store.status = 'login';
      this.setState({});
    } else {
        Store.status = 'incompatible';
      this.setState({});
    }
  },
  handleChange(event){
    this.setState({
      input: event.target.value
    });
  },
  handleSubmit: function(event){
    event.preventDefault();
     Store.status ='waiting';
     Store.player.name = this.state.input;
   this.setState({});
  },
  render: function(){
    if (this.state.Store.status === 'incompatible') {
      alert("Ruh Roh! It don't werk! Try a more modern browser.");
    }
    if (this.state.Store.status === 'login') {
      return (
        <form className="login">
            <input className="login_Name" type="text" onChange={this.handleChange} value={this.state.input}/>
            <button className='login' onClick={this.handleSubmit}>Play!</button>
        </form>
        );
    }
    if (this.state.Store.status === 'waiting'){
      return (
        <div>Hold your horses!</div>
        );
    }

  }
});

// not found "page"
var NotFound = React.createClass({
  render: function() {
    return (
      <div>Not Found!</div>
    );
  }
});

var socket = io.connect(window.location.origin);
socket.on('connect', function(){
    console.log('Connected');
});

socket.on('disconnect', function(){
    console.log('Disconnected');
});
var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="login" component={Login}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);

ReactDOM.render(routes, document.querySelector('#app'));



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
// do I add a router here? 