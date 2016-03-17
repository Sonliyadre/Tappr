# Tappr
DecodeMTL Final Project

### Installation
* ```npm install```

### NPM Commands
* ```npm run dev```
* ```npm run webpack```
* ```npm run dist```
* 


==========================

# READ ME

#### Demo URL http://cheekybeaversgame.com

## Admin Login
* POST request

### Request
* username
* password

### Response
```{"isAuthenticated": true | false}```

* GET: ```/admin```
* res.send:```/public/admin/index.html```

### Player:
* GET: ```/*```
* res.send: ```/public/player/index.html```


### Socket Connect / Disconnect
This happens automactically whenever a player connects or disconnects from the game.
When a player connects, we ask for their name a verify that that name is not current in the list of players (see: Player List).
##### Request: 
connect / disconnect
##### Response: 
socket connected / socket_id disconnected

### Player List


##### Request: Player_add
When a player connects they are asked for their name. First we verify that the name is not currently in the list of players. If not, we add the player:

##### Response:
```players.push({name: data.name, socket_id: this.id, tap_count:0, effects: []});```

to the players array (```players: []```) and they are joined to the current gameId.

```socket.join(gameId);```

```socket.emit(CONFIG.game.event.PLAYER_ADD, {'addition': true, 'message': 'Welcome!'});```

### Game Start Timer:
This is used to start the countdown to the game start. This is the time when players will be allowed to join the current game.

##### Request:
```Game_start_timer```

##### Response:
The timer is started. Once finsihed a ```game_start``` event is sent out the admin and all players.

### Game Status:
This let the players and admin know if the game is currently accepting new players, if the game has already started or if the game has stopped because someone has won.	

##### Request:
```game_status = ```
##### Response:
The responses can be:
- waiting: currently accepting players, waiting for game to start.
- started: game in progress
- stopped: game is over, someone has won and we switch to "winner" screen.

- example code: ```game_status = CONFIG.game.status.WAITING;```

### Player Click:
This happens evrytime a player clicks their tap button.
##### Request:
player_click

##### Response: 
tap count plus one unless there's a power-up:

* freeze (timed): no taps
* double tap (timed): taps count double
* half (instant): player loses half his tap count
* plus ten (instant): player tap count increases by 10
* minus ten (isntant): player tap count decreases by 10
* leetch (instant): player's tap is given to another player (selected at random)
		

```tapIncrement = 1```

###### timed effects for 'player_click' event:

* player_effect_lasting:
	
```{player: players[index], type: randomEffect, status: active}```   ==> ON

```{player: players[index], type: randomEffect, status: inactive}``` ==> OFF

###### instant effects for 'player_click' event:
	
* player_effect_instant:

```{player: players[index], type:ramdomEffect, value: tapIncrement}```

### Credits

* Admin Front End & Graphics: Sonia Badeau (https://github.com/sonia-badeau)
* Player Front End: Aliyah Jessa (https://github.com/aliyahmaliyah)
* Server (Back End): Dre Storelli (https://github.com/dreboom)

##### Music Credits
Songs played on Admin/Leaderboard display courtesy of http://bensound.com.

##### Sound Effect Credits
Sound effects on player game app courtesy of http://soundbible.com.

