'use strict';

module.exports = {

    environment: {
        name:    process.env.NODE_ENV  || 'development',
        host:    process.env.HOSTNAME  || '127.0.0.1',
        port:    process.env.PORT      || 8000
    }

}