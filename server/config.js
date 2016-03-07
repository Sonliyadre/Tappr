'use strict';

module.exports = {

    environment: {
        name:    process.env.NODE_ENV    || 'development',
        port:    process.env.PORT_SERVER || 8888
    }

}