var React = require('react');
var ReactDOM = require('react-dom');



var WinnerIs = React.createClass({
    render: function() {
        return (
            <div className="winner">
                <h1 className="winner">The winner is: <span className="highlight">{this.props.winner.name}</span></h1>
            </div>);
    }
})

module.exports = WinnerIs;

// Add a button to start a new game