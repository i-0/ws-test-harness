/*
 * To run standalone faker endpoints: $ node server-faker.js
 */
var harness = require('./harness')();

var config = {
    listening_port: 1337
};

var faker_enpoint_definitions = harness.get_endpoint_definitions_from(
    [
        './test/faker/ext-ws-fake-endpoint'
    ]);

var app = harness.get_server_app_from(faker_enpoint_definitions);

app.listen(config.listening_port, function () {
    console.log('server listening on port: %s',
        config.listening_port);
});