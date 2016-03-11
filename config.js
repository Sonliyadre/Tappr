'use strict';

module.exports = {

    environment: {
        name: process.env.NODE_ENV  || 'development',
        host: process.env.HOSTNAME  || '127.0.0.1',
        port: process.env.PORT      || 8080
    },

    game: {
        maxTap:              process.env.MAX_TAP              || 1000,
        intervalLeaderboard: process.env.INTERVAL_LEADERBOARD || 500,
        intervalTimer:       process.env.INTERVAL_TIMER       || 10000,
        effectMinimumTime:  2500,
        effectAdditionTime: 2500,
        effectLastingChance: 100,
        effectInstantChance: 100,

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
            GAME_STATUS:           'game_status'
        }
        
    },
    
    credentials: {
        username: process.env.ADMIN_USERNAME || 's',
        password: process.env.ADMIN_PASSWORD || 'a'
    }

}