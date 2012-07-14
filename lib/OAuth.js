exports.OAuth = (function () {
    var oa = require('oauth').OAuth;
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
            var qs = require('querystring');

            url = params ? url + '?' + qs.stringify(params) : url;
            var signedUrl = oauth.signUrl(url, this.accessToken, this.accessTokenSecret, 'get');
            signedUrl = require('url').parse(signedUrl);

            var options = {
                "host": signedUrl.host,
                "path": signedUrl.path,
                "method": 'GET'
            };

            this._request(options, callback);
        },
        _request: function (options, callback) {
            var https = require('https');

            var resData = "";
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    resData = resData + data;
                });
                res.on('error', function (data) {
                    resData = resData + data;
                    callback(data);
                });
                res.on('end', function (data) {
                    callback(null, JSON.parse(resData));
                });
            });

            req.end();
        }
    };
}());
