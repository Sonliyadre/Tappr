// https://facebook.github.io/react/docs/component-specs.html

var React = require('react');
var ReactDOM = require('react-dom');

// var Store = require(__dirname + '/store');

var App = React.createClass({
  getInitialState: function(){
    
    return {
      player: {name: null}, 
      status: 'loading',
      input: "",
      socket: null,
    };
  },
  componentDidMount: function() {
    if (window.WebSocket) {
      var socket = io.connect(window.location.origin)
      this.setState({
        status: 'login',
        socket: socket
      });
      socket.on('add_player', this.handleAddPlayerSocketEvent);
    } else {
      this.setState({
        status: 'incompatible'
      });
    }
  },
  handleAddPlayerSocketEvent: function(data) {
    if (data.addition === true) {
     this.handleSubmit;
     this.setState({
       status:'waiting'
     });
    }
    else {
      this.setState({
        status: 'bad_name'
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
   this.setState({
      player: this.state.input
   });
   this.state.socket.emit('add_player', this.state.player); 
  },
  
  render: function(){
    //check status
    if (this.state.status === 'incompatible') {
      alert("Ruh Roh! It don't werk! Try a more modern browser.");
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
    return (<div>{this.state.status}</div>);
  }
});


ReactDOM.render(<App />, document.getElementById('app'));



/*
var socket = io.connect(window.location.origin);
socket.on('connect', function(){
    console.log('Connected');
});


socket.on('disconnect', function(){
    console.log('Disconnected');
});
*/