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
        
        var max = 0;
        this.props.scores.forEach(function(score){
            if(score.tap_count > max){
                max = score.tap_count;
            }
        })
        var bars = this.props.scores.map(function(score){
            
            var heightPourcentage = (score.tap_count / max) * 100
            return (
                <div style={{height: heightPourcentage + "%"}}>{score.name}: {score.tap_count}</div>
                )
        })
        
            return (
                <div className="leaderboard">
                   {bars} 
                </div>
            );
    }
});


module.exports = LeaderBoard