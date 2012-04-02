var oa = require('oauth').OAuth;

OAuth = (function () { 
    var oauth; 

    return {
        init: function (key, secret) {
            oauth = new oa(
                'https://www.odesk.com/api/auth/v1/oauth/token/request',
                'https://www.odesk.com/api/auth/v1/oauth/token/access',
                key,
                secret,
                '1.0',
                null,
                'HMAC-SHA1',
                32,
                {
                    'Accept' : 'application/json',
                    'Connection' : 'close',
                    'User-Agent': 'odesk.js'
                });
        },
        getRequestToken: function(callback) {
            oauth.getOAuthRequestToken(function (error, requestToken, requestTokenSecret) {
                callback(error, requestToken, requestTokenSecret);      
            });
        },
        getAccessToken: function (requestToken, requestTokenSecret, verifier, callback) {
            oauth.getOAuthAccessToken(requestToken, requestTokenSecret, verifier, function (error, accessToken, accessTokenSecret) {
                callback(error, accessToken, accessTokenSecret);      
            });
        },
        getAuthenticateUrl: function(token) {
            return 'https://www.odesk.com/services/api/auth?oauth_token=' + token;
        },
        get: function (url, params, callback) {
            qs = require('querystring');
            url = url + qs.stringify(params);
            oauth.get(url, this.accessToken, this.accessTokenSecret, callback);
        }
    }
}());

exports.OAuth = OAuth;
