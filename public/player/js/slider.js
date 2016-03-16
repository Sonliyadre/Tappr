var React   = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      slideInterval: null,
      currentSlide : 0,
      totalSlides  : 7
    };
  },
  _getCurrentSlide: function() {
    return this.state.currentSlide;
  },
  componentDidMount: function() {
    var that = this;
    var slideInterval = setInterval(function(){
      var nextSlide = that._getCurrentSlide() + 1;
      if (nextSlide > that.state.totalSlides) {
        nextSlide = 1;
      }
      that.setState({
        currentSlide: nextSlide
      });
    }, 15000);
  },
  render: function(){
    switch(this.state.currentSlide) {
    case 1: 
        return (<div>
        <p className='game_instructions_title'>Plain ol' beaver</p>
        <p className="game_instructions"><img src="/player/images/normalBeaverButton-1.png"/></p>
        <p className="game_instructions">You're a busy beaver! Tap the beaver to build your dam. Every tap is worth one log.</p>
        </div>);
    case 2: 
         return (<div>
         <p className='game_instructions_title'>-10 Logs</p>
         <p className="game_instructions"><img src="/player/images/normalBeaverButton-1.png"/></p>
         <p className="game_instructions">#Sadface. You'll randomly lose 10 of your logs.</p>
         </div>);
    case 3: 
         return (<div>
         <p className='game_instructions_title'>+10 Logs</p>
         <p className="game_instructions"><img src="/player/images/normalBeaverButton-1.png"/></p>
         <p className="game_instructions">#Happyface! You'll randomly get 10 extra logs!</p>
         </div>);
    case 4: 
         return (<div>
         <p className='game_instructions_title'>Flood</p>
         <p className="game_instructions"><img src="/player/images/normalBeaverButton-1.png"/></p>
         <p className="game_instructions">Dam! The river can flood and wash away half your logs. Listen for the sound of rushing water.</p>
         </div>); 
    case 5: 
         return (<div>
         <p className='game_instructions_title'>Double Beaver Power</p>
         <p className="game_instructions"><img src="/player/images/doubleTapButton.png"/></p>
         <p className="game_instructions">You've got super speed! Every tap is worth TWO logs!</p>
         </div>);
    case 6: 
         return (<div>
         <p className='game_instructions_title'>Freeze!</p>
         <p className="game_instructions"><img src="/player/images/icedBeaverButton.png"/></p>
         <p className="game_instructions">Ruh roh! There's a cold snap. You can't build your dam while you're frozen! No logs are counted while it's subzero.</p>
         </div>);
    case 7: 
         return (<div>
         <p className='game_instructions_title'>Cheeky Beaver</p>
         <p className="game_instructions"><img src="/player/images/cheekyBeaverButton.png"/></p>
         <p className="game_instructions">Watch out for that cheeky beaver stealing your logs. Every time you hit this button, a tree cries... at the paws of another beaver who stole it from you.</p>
         </div>);
    default:
        return (<div>
          <p className='game_instructions_title'>Instructions</p>
          <p className="game_instructions">You're a cheeky beaver! Tap your beaver (don't be gross) to build your dam.</p> 
          <p className="game_instructions">Watch your dam grow on the big screen, but be careful of floods, other cheeky beavers, and the cold! </p>
          <p className="game_instructions">Keep an eye out for other power ups that will help you build your dam faster and don't forget to turn your sound on.</p> 
          <p className="game_instructions">First beaver to build a dam wins.</p>
        </div>);
    }
  }
});
