'use strict';

module.exports = {

    environment: {
        name: process.env.NODE_ENV  || 'development',
        host: process.env.HOSTNAME  || '127.0.0.1',
        port: process.env.PORT      || 8080
    },

    game: {
        maxTap:              process.env.MAX_TAP               || 300,
        intervalLeaderboard: process.env.INTERVAL_LEADERBOARD  || 333,
        intervalTimer:       process.env.INTERVAL_TIMER        || 10000,
        effectMinimumTime:   process.env.EFFECT_MINIMUM_TIME   || 2500,
        effectAdditionTime:  process.env.EFFECT_ADDITION_TIME  || 2500,
        effectLastingChance: process.env.EFFECT_CHANCE_LASTING || 50,
        effectInstantChance: process.env.EFFECT_CHANCE_INSTANT || 75,
        minimumPlayers     : process.env.MINIMUM_PLAYERS || 1,

        status: {
            STARTED: 'started',
            WAITING: 'waiting',
            STOPPED: 'stopped'
        },

        event: {
            PLAYER_ADD:            'add_player',
            PLAYER_CLICK:          'player_click',
            PLAYER_DATA:           'tap_update',
            PLAYER_EFFECT_LASTING: 'effect-lasting',
            PLAYER_EFFECT_INSTANT: 'effect-instant',
            GAME_START_TIMER:      'timer_start',
            GAME_START:            'game_start',
            GAME_STOP:             'game_stop',
            GAME_STATUS:           'game_status',
            GAME_RESTART:          'game_restart',
            GAME_RESET_TIMER:      'game_reset_timer'
        }
        
    },
    
    credentials: {
        username: process.env.ADMIN_USERNAME || 's',
        password: process.env.ADMIN_PASSWORD || 'a'
    }

}