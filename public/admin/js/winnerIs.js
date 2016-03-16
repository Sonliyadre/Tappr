var React = require('react');
var ReactDOM = require('react-dom');



var WinnerIs = React.createClass({
    render: function() {
        return (
            <div className="winner">
                <h1 className="winnerName size-medium">The winner is: <br/><span className="highlight">{this.props.winner.name}</span></h1>
                <div><img src="/admin/img/winnerBeaver.png"/></div>
                <div><input className="button size-small" type="button" value="Restart the Game" onClick={this.props.handleNewGame} /></div>
            </div>);
    }
})

module.exports = WinnerIs;

// Add a button to start a new game