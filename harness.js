var debug = require('debug')('harness');
var util = require('util');
var express = require('express');

function normalizePath(path) {
    if (path === '' || path == null) {
        return '';
    } else if (path.indexOf('/') != 0) {
        return '/' + path;
    } else {
        return path;
    }
}

module.exports = function () {
    var harness = {

        initServer: function (app, listening_port) {
            var server = app.listen(listening_port);
            return server;
        },

        get_server_app_from: function (endpoint_definitions) {
            var app = express();
            for (var i in endpoint_definitions) {
                var endpoint_definition = endpoint_definitions[i];

                debug('now enpoint_definition: %s',
                    util.inspect(endpoint_definition));

                for (var j in endpoint_definition) {
                    var ep = endpoint_definition[j];

                    var fun = ep.fun;
                    var middleware = ep.middleware || [];

                    var namespace = normalizePath(ep.namespace);
                    var path =  normalizePath(ep.path);
                    var fullpath = namespace + path;

                    var method = ep.method.toLowerCase();
                    if (method !== 'get'
                        && method !== 'post'
                        && method !== 'all') {
                        throw new Error('Invalid method: ' + method);
                    }

                    debug('%s: adding endpoint %s',
                        method, util.inspect(ep));

                    app[method](fullpath, middleware, fun);
                }
            }
            return app;
        },

        // TODO: generalize at some point to accept other sources than files
        get_endpoint_definitions_from : function (get_endpoint_definitions_files) {
            var sub_apps = new Array();
            for (var i in get_endpoint_definitions_files) {
                var path = get_endpoint_definitions_files[i];
                var definition = require(path);
                sub_apps.push(definition);
            }

            debug('loaded app definitions: %s',
                util.inspect(sub_apps));

            return sub_apps;
        }
    }

    return harness;
}
// EOF
