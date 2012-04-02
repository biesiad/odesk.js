var tokenAuth = (function () {
    var api_key;
    var api_secret;
    
    return {
        init: function (key, secret) {
            api_key = key;
            api_secret = secret;
        },
        getFrob: function (callback) {
            var url = "https://www.odesk.com/api/auth/v1/keys/frobs.json";
            var params = { api_key: api_key };
            params.api_sig = this.getSignature(api_secret, params);
            this.request({ url: url, method: 'POST', data: params, callback: callback });
        },
        getToken: function (frob, callback) {
            var url = "https://www.odesk.com/api/auth/v1/keys/tokens.json";
            var params = { 
                api_key: api_key, 
                frob: frob
            };
            params.api_sig = this.getSignature(api_secret, params);
            this.request({ url: url, method: 'POST', data: params, callback: callback });
        },
        checkToken: function (token, callback) {
            var url;
            var params = { 
                api_key: api_key,
                api_token: token 
            };
            params.api_sig = this.getSignature(api_secret, params);
            url = this.formatUrl("https://www.odesk.com/api/auth/v1/keys/token.json", params);
            this.request({ url: url, methos: 'GET', data: params, callback: callback });
        },
        getAuthenticationUrl: function (frob) {
            var params = {
                api_key: api_key, 
                frob: frob
            };
            params.api_sig = this.getSignature(api_secret, params);
            return this.formatUrl("https://www.odesk.com/services/api/auth/", params);
        },
        get: function (url, params, callback) {
            params.api_token = this.accessToken;
            params.api_key = api_key;
            params.frob = this.accessFrob;
            params.api_sig = this.getSignature(api_secret, params);
            url = this.formatUrl(url, params);
            this.request({ url: url, method: 'GET', callback: callback });
        },

        // Utils
        params2array: function (params) {
            var key, value,
                paramsArray = [];

            for (key in params) {
                if (params.hasOwnProperty(key)) {
                    value = params[key];
                    paramsArray.push([key, value]);
                }
            }
            return paramsArray;
        },
        getSignature: function (api_secret, params) {
            var toEncode = api_secret;
            var paramsArray = this.params2array(params);
            paramsArray.sort();
            for (var i = 0, count = paramsArray.length; i < count; i++) {
                toEncode += paramsArray[i].join("");
            }
            var hash = require('mhash').hash;
            return hash('md5', toEncode);
        },
        formatUrlParams: function (params) {
            var key, value, paramsString,
                paramsArray = this.params2array(params),
                query = [];

            for (var i = 0, count = paramsArray.length; i < count; i++) {
                key = paramsArray[i][0];
                value = paramsArray[i][1];
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            }
            return query.join("&");
        },
        formatUrl: function (url, params) {
            return url + '?' + this.formatUrlParams(params);
        },
        request: function (params) {
            var urlParse = require('url').parse;
            var http = require('http');
            var url = urlParse(params.url);
            var paramsString = this.formatUrlParams(params.data);
            var options, req;

            options = {
                host: url.host,
                path: url.pathname,
                method: params.method,
                headers: {  
                    'Content-Type': 'application/x-www-form-urlencoded',  
                    'Content-Length': paramsString.length  
                }
            };
            req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    params.callback(null, JSON.parse(data));
                });
                res.on('error', function (data) {
                    params.callback('error', data);
                });
            });

            req.write(paramsString);
            req.end();
        }
    };
}());

exports.tokenAuth = tokenAuth;
