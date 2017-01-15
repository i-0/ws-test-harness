var express = require('express');
var crypto  = require('crypto');
var request = require('request');
var debug   = require('debug')('server');

var config = {
    listening_port      : 1337,
    external_ws_endpoint: 'http://127.0.0.1:8000/fake-ext-ws'
};

function transmorgify(widgetId) { 
    var id = crypto.randomBytes(16).toString("hex");
    return id;
}

function request_widget(blablablaId, callback) {
    request(
	{
	    method: 'GET',
	    uri: config.external_ws_endpoint,
	    qs: {blablablaId: blablablaId}
	},
	function (error, res, body) {
	    if (error) {
		console.error("Error calling external WS: %s", error);
		throw error; // crash server!
	    } else if (res.statusCode != 200) {
		console.error("HTTP error: %s calling external WS", res.statusCode);
	    }
	    callback (res.statusCode, JSON.parse(body));
	}
    );
}

var app = express();

app.get('/widget', function (req, res) {
    var widgetId    = req.query.widgetId;
    var blablablaId = transmorgify(widgetId);

    request_widget(
	blablablaId,
	function(statusCode, body) {
	    res.statusCode = statusCode;
	    var responseBody = {
		status: null,
		widgetId: widgetId
	    };

	    if (statusCode == 200) {
		var status =  body.status;
		responseBody.status = status;
	    } else {
		responseBody.status = 'error';
	    };

	    res.write(JSON.stringify(responseBody));
	    res.end();
	}
    );
});

app.listen(config.listening_port, function () {
    console.log('server listening on port: %s',
		config.listening_port);
});
