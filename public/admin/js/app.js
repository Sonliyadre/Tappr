var React = require('react');
var ReactDOM = require('react-dom');

var AdminForm = React.createClass({
    render : function (){
        return (
        <div>
            <h1>Tappr Admin</h1>
            <form>
            <p>
              <label for="username">Username</label><br/>
              <input type="password" ref="name" placeholder="Username" />
              </p>
              <p>
              <label for="password">Username</label><br/>
              <input type="password" ref="password" placeholder="Password" />
              </p>
              <input className="button" type="submit" value="SEND"/>
            </form>
            </div>
            );
    }
});

ReactDOM.render(<AdminForm />, document.querySelector('#app'));






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