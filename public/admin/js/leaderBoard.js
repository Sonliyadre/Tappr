var React = require('react');
var ReactDOM = require('react-dom');



var LeaderBoard = React.createClass({
    getInitialState(){
        return {
            winner: {}
        }
    },
    render: function() {
        
        this.props.scores.sort(
            function(a,b) {
                return b.tap_count - a.tap_count;
            }
        )
        
        var that = this;
        var bars = this.props.scores.map(function(score){
            
            var heightPourcentage = (score.tap_count / that.props.max) * 100;
            return (<div className="log" style={{height: heightPourcentage + "%"}}>
                  <div className="log_top"></div>
                  <div className="log_body"></div>
                  <div className="log_bottom"><p className="vertical-text">{score.name}: {score.tap_count}</p></div>
                </div>);
        })
        
            return (<div className="logs">{bars} </div>);
    }
});


module.exports = LeaderBoard