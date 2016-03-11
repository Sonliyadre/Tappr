var React = require('react');
var ReactDOM = require('react-dom');



var WinnerIs = React.createClass({
    render: function() {
        return (
            <div className="winner">
                        <h1>The winner is: {this.props.winner.name} </h1>
                       <img src="/admin/img/coupe.png"/>
            </div>);
    }
})


module.exports = WinnerIs;