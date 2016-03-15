var React = require('react');
var ReactDOM = require('react-dom');



var WinnerIs = React.createClass({
    render: function() {
        return (
            <div className="winner">
                <h1 className="winner">The winner is: <span>{this.props.winner.name}</span></h1>
                <div><img src="/admin/img/winnerBeaver.png"/></div>
            </div>);
    }
})


module.exports = WinnerIs;