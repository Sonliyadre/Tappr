'use strict';

module.exports = {

    environment: {
        name: process.env.NODE_ENV  || 'development',
        host: process.env.HOSTNAME  || '127.0.0.1',
        port: process.env.PORT      || 8080
    },

    game: {
        maxTap:              process.env.MAX_TAP              || 10,
        intervalLeaderboard: process.env.INTERVAL_LEADERBOARD || 1000,
        intervalTimer:       process.env.INTERVAL_TIMER       || 10000
    },
    
    credentials: {
        username: process.env.ADMIN_USERNAME || 's',
        password: process.env.ADMIN_PASSWORD || 'a'
    }

}