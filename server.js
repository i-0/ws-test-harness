/*
 * To run server outside of test context: $ node server.js
 */
var app = require('./app')();
var debug = require('debug')('server');
var config = {
	listening_port: 1337
};

app.listen(config.listening_port, function () {
    console.log('server listening on port: %s',
		config.listening_port);
});
