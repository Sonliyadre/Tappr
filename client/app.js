'use strict';

var CONFIG  = require(__dirname + '/config');

var express = require('express');

var app     = express();
var options = {
    dotfiles  : 'ignore',
    etag      : false,
    extensions: ['htm', 'html'],
    index     : 'index.html',
    maxAge    : '1d',
    redirect  : false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
};

app.use(express.static('client/public', options));

var port = CONFIG.environment.port;

app.listen(port, function() {
    console.log('Client listening on port ' + port);
});