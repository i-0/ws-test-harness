/*
 * To run: $ mocha [debug] -R spec spec.js
 * Depends: apt-get install nodejs mocha
 *
 * For low level debugging use:
 *   $ strace -f -o mocha.strace.dump mocha --reporter spec --check-leaks  --globals i spec.js | grep bind --color
 * Depends: apt-get install strace
 */

// TODO: var fp = require('lodash/fp');
var harness    = require('../harness')();
var express    = require('express');
var reqtest    = require('supertest');
var should     = require('should');
var debug      = require('debug')('spec');

describe('loading test fake endpoint fixture', function () {
    // fake endpoints
    var faker_server;
    var config = {
        faker_listening_port: 1337
    };

    // server app under test
    var app = require('../app')();

    before(function (done) {
        // faker server init
        var faker_enpoint_definitions = harness.get_endpoint_definitions_from(
            [
                './test/faker/ext-ws-fake-endpoint'
            ]);
        var faker_app = harness.get_server_app_from(faker_enpoint_definitions);
        faker_server = harness.initServer(faker_app, config.faker_listening_port);


        done();
    });

    describe('app basic root test', function () {
        it('responds to /', function testSlash(done) {
            reqtest(app)
                .get('/')
                .expect(404)
                .end(done());
        });
    });

    describe('app basic widget test', function () {
        it('responds pending to /widget', function testSlash(done) {
            reqtest(app)
                .get('/widget')
                .expect(200)
                .end(function (err, res) {
                    if (err) throw err;
                    var obj = JSON.parse(res.text);
                    obj.should.eql({status: 'pending'});
                    done();
                });
        });
    });

    after(function (done) {
        if (faker_server) faker_server.close();
        done();
    });

});
// EOF
