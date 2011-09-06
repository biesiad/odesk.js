if (!oDesk) {
    var oDesk = {};
}

oDesk.Utils = function () {
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
            return hex_md5(toEncode);
        },

        formatUrl: function (url, params) {
            var key, value, 
                paramsArray = this.params2array(params),
                query = [];
            for (var i = 0, count = paramsArray.length; i < count; i++) {
                key = paramsArray[i][0];
                value = paramsArray[i][1];
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            }
            paramsString = query.join("&");
            return url + '?' + paramsString;
        }
    }
}();

oDesk.Authentication = function () {
    var api_key, api_secret,
        utils = oDesk.Utils;
    
    return {
        init: function (key, secret) {
            api_key = key;
            api_secret = secret;
        },

        getFrob: function (callback) {
            var url = "https://www.odesk.com/api/auth/v1/keys/frobs.json";
                params = { api_key: api_key };
                params.api_sig = utils.getSignature(api_secret, params);

            $.post(url, params, callback);
        },

        getToken: function (frob, callback) {
            var url = "https://www.odesk.com/api/auth/v1/keys/tokens.json",
                params = { 
                    api_key: api_key, 
                    frob: frob
                };
                params.api_sig = utils.getSignature(api_secret, params);

            $.post(url, params, callback);
        },

        checkToken: function (frob, callback) {
            var url, 
                params = { 
                    api_key: api_key,
                    api_token: token 
                };
            params.api_sig = utils.getSignature(api_secret, params);
            var url = utils.formatUrl("https://www.odesk.com/api/auth/v1/keys/token.json", params);

            $.getJSON(url, params, function (data) {
                if (callback) { callback(data); }
            });
        },

        authorizeUrl: function (frob) {
            var params = {
                api_key: api_key, 
                frob: frob
            };
            params.api_sig = utils.getSignature(api_secret, params);
            return utils.formatUrl("https://www.odesk.com/services/api/auth/", params);
        }
    }
}();

oDesk.Data = function () {
    var frob, token,
        api_key, api_secret,
        utils = oDesk.Utils;

    return {
        init: function (authentication) {
            frob = authentication.frob;
            token = authentication.token;
            api_key = authentication.key;
            api_secret = authentication.secret;
        },

        get: function (url, params, callback) {
            if (token) {
                url = utils.formatUrl(url, params);
                $.getJSON(url, callback);
                return;
            }
            if (callback) { callback(); }
        },

        getSigned: function (url, params, callback) {
            if (token) {
                params.api_token = token;
                params.api_key = api_key;
                params.frob = frob;
                params.api_sig = utils.getSignature(api_secret, params);
                url = utils.formatUrl(url, params);
                $.getJSON(url, callback);
                return;
            }
            if (callback) { callback(); }
        }
    }
}();
