var Auth = function () {
    var api_key, api_secret;
    
    return {
        init: function (key, secret) {
            api_key = key;
            api_secret = secret;
        },
        getFrob: function (callback) {
            var url = "http://odesk.com/api/auth/v1/keys/frobs.json",
                params = { api_key: api_key };
            params.api_sig = Utils.getSignature(api_secret, params);
            Utils.request({ 
                url: url, 
                method: 'POST', 
                data: params, 
                callback: callback
            });
        },
        getToken: function (frob, callback, error) {
            var url = "http://odesk.com/api/auth/v1/keys/tokens.json",
                params = { 
                    api_key: api_key, 
                    frob: frob
                };
            params.api_sig = Utils.getSignature(api_secret, params);
            Utils.request({ url: url, method: 'POST', data: params, callback: callback });
        },
        checkToken: function (frob, callback) {
            var url, 
                params = { 
                    api_key: api_key,
                    api_token: token 
                };
            params.api_sig = Utils.getSignature(api_secret, params);
            url = Utils.formatUrl("https://www.odesk.com/api/auth/v1/keys/token.json", params);

            Utils.request({ url: url, methos: 'GET', data: params, callback: callback });
        },

        getAuthorizationUrl: function (frob) {
            var params = {
                    api_key: api_key, 
                    frob: frob
                };
            params.api_sig = Utils.getSignature(api_secret, params);
            return Utils.formatUrl("https://www.odesk.com/services/api/auth/", params);
        }
    }
}();

var Data = function () {
    var frob, token,
        api_key, api_secret;

    return {
        init: function (auth) {
            frob = auth.frob;
            token = auth.token;
            api_key = auth.key;
            api_secret = auth.secret;
        },

        get: function (url, params, callback) {
            params.api_token = token;
            params.api_key = api_key;
            params.frob = frob;
            params.api_sig = Utils.getSignature(api_secret, params);
            url = Utils.formatUrl(url, params);
            Utils.request({ url: url, method: 'GET', callback: callback });
        }
    }
}();

var Utils = function () {
    return {
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
            var paramsArray = this.params2array(params);
            paramsArray.sort();
            var toEncode = api_secret;
            for (var i = 0, count = paramsArray.length; i < count; i++) {
                toEncode += paramsArray[i].join("");
            }
            var hash = require('mhash').hash;
            return hash('md5', toEncode);
        },

        formatUrl: function (url, params) {
            var key, value, paramsString,
                paramsArray = this.params2array(params),
                query = [];

            for (var i = 0, count = paramsArray.length; i < count; i++) {
                key = paramsArray[i][0];
                value = paramsArray[i][1];
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            }
            paramsString = query.join("&");
            return url + '?' + paramsString;
        },
        request: function (options) {
        }
    };
}();

exports.Auth = Auth;
exports.Data = Data;
exports.Utils = Utils;
