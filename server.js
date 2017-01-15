var express = require('express');
var debug   = require('debug')('server');
var crypto  = require('crypto');
var listening_port = 1337;

function transmorgify(widgetId) { 
    var id = crypto.randomBytes(16).toString("hex");
    return id;
}

// server app
var app = express();

app.get('/widget', function (req, res) {
    var widgetId = req.query.widgetId;
    var blablablaId = transmorgify(widgetId);
    debug(":: blablablaId: %s", blablablaId); // FIXME: debug is not working
    console.log(":: blablablaId %s", blablablaId);

    // TODO: call external WS with blablablaId

    // TODO: process external WS response

    var responseBody = {
	status: "pending",
	widgetId: widgetId,
    };

    res.statusCode = 200;
    res.write(JSON.stringify(responseBody));
    res.end();
});

app.listen(listening_port, function () {
    console.log('server listening on port ' + listening_port + '!');
});
