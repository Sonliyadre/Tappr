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
         <p className='game_instructions_title'>Normal Tap</p>
         <p className="game_instructions"><img src="/player/images/normalBeaverButton-1.png"/></p>
         <p className="game_instructions">Lorem ipsum.</p>
         </div>);
      case 2: 
         return (<div>
         <p className='game_instructions_title'>Power-Up : Double Tap</p>
         <p className="game_instructions"><img src="/player/images/doubleTapButton.png"/></p>
         <p className="game_instructions">Lorem ipsum.</p>
         </div>);
      case 3: 
         return (<div>
         <p className='game_instructions_title'>Power-Down : Freeze</p>
         <p className="game_instructions"><img src="/player/images/icedBeaverButton.png"/></p>
         <p className="game_instructions">Lorem ipsum.</p>
         </div>);
      case 4: 
         return (<div>
         <p className='game_instructions_title'>Power-Down : Leech</p>
         <p className="game_instructions"><img src="/player/images/cheekyBeaverButton.png"/></p>
         <p className="game_instructions">Lorem ipsum.</p>
         </div>);
      case 5: 
         return (<div>
         <p className='game_instructions_title'>Power-Down : -10 Taps</p>
         <p className="game_instructions"><img src="/player/images/cheekyBeaverButton.png"/></p>
         <p className="game_instructions">Lorem ipsum.</p>
         </div>);
      case 6: 
         return (<div>
         <p className='game_instructions_title'>Power-Up : +10 Tap</p>
         <p className="game_instructions"><img src="/player/images/normalBeaverButton-1.png"/></p>
         <p className="game_instructions">Lorem ipsum.</p>
         </div>);
     case 7: 
         return (<div>
         <p className='game_instructions_title'>Power-Down : Log Halving</p>
         <p className="game_instructions"><img src="/player/images/cheekyBeaverButton.png"/></p>
         <p className="game_instructions">Lorem ipsum.</p>
         </div>); 
      default:
        return (<div>
          <p className='game_instructions_title'>Instructions</p>
          <p className="game_instructions">You're a cheeky beaver! Tap your beaver (don't be gross) to build your dam.</p> 
          <p className="game_instructions">Watch your dam get bigger on the big screen, but watch out for floods, other cheeky beavers, and the cold! </p>
          <p className="game_instructions">Keep an eye out for other power ups that will help you build your dam faster. First beaver to build a dam wins.</p>
        </div>);
    }
  }
});
