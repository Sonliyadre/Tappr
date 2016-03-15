var React    = require('react');
var ReactDOM = require('react-dom');

var AdminForm = React.createClass({
    getInitialState: function(){
        console.log(this.props);
        return {
            socketId: this.props.socketId
        }
    },
    handleSubmit: function(event) {
        event.preventDefault();
        var username = this.refs.username.value;
        var password = this.refs.password.value;
        var socketId = this.props.socketId;

        var that = this;
        var data = {'username': username,'password': password, 'socketId': socketId};
             $.ajax({
               url: '/admin/login',
               type: 'POST',
               contentType:'application/json',
               data: JSON.stringify(data),
               dataType:'json'
             }).done(function(data){
                 var credentialsAreValid = data.authentication;
        
                if (credentialsAreValid) {
                    that.props.handleSuccessfulAdminLogin(that.refs.username.value);
                } else {
                    that.props.handleFailedAdminLogin();
                }
                     });
                     
        // @TOFIX ALL CREDENTIALS ARE TRUE RIGHT NOW.
        
    },
    render : function (){
        return (
            <div className="adminForm">
            <h1>Tappr Admin</h1>
            <form>
            <p>
              <input className="adminInput" type="password" ref="username" placeholder="Username" />
              </p>
              <p>
              <input className="adminInput" type="password" ref="password" placeholder="Password" />
              </p>
              <input className="buttonAdmin" type="button" value="LOGIN" onClick={this.handleSubmit}/>
            </form>
            </div>
            );
    }
});

module.exports = AdminForm;