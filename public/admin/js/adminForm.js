var React    = require('react');
var ReactDOM = require('react-dom');

var AdminForm = React.createClass({
    handleSubmit: function(event) {
        event.preventDefault();
        var username = this.refs.username.value;
        var password = this.refs.password.value;
        
        // VALIDATE USERNAME + PASSWORD IS VALID WITH POST REQUEST
        //Il faut faire un AJAX post ==> demander à DRE la route (/admin/login)
        
        var that = this;
        var data = {'username': username,'password': password};
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
            <div>
            <h1>Tappr Admin</h1>
            <form>
            <p>
              <label for="username">Username</label><br/>
              <input type="password" ref="username" placeholder="Username" />
              </p>
              <p>
              <label for="password">Password</label><br/>
              <input type="password" ref="password" placeholder="Password" />
              </p>
              <input className="button" type="button" value="LOGIN" onClick={this.handleSubmit}/>
            </form>
            </div>
            );
    }
});

module.exports = AdminForm;