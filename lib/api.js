var oauth = require('./OAuth.js').OAuth;
var tokenAuth = require('./tokenAuth.js').tokenAuth;

var api = {
    get: function (url, params, callback, method) {
        method = method || 'OAuth';
        this[method].get(url, params, callback);
    }
}

exports.api = api;
