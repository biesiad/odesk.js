var odesk = require('../odesk.js');
    
describe('odesk.OAuth', function () {
    beforeEach(function () {
        odesk.OAuth.init('key', 'secret');
    });

    describe('getAuthenticationUrl', function () {
        it('returns url with oauth token', function () {
            var token = 'token';
            var url = odesk.OAuth.getAuthenticateUrl(token);
            expect(url).toEqual('https://www.odesk.com/services/api/auth?oauth_token=' + token);
        });
    });

    describe('get', function () {
        it('calls api with oauth params in query', function () {
            var callback = jasmine.createSpy();
            spyOn(odesk.OAuth, '_request');
            odesk.OAuth.get("http://odesk.com/api", { param1: "val1" }, callback);
            var url = require('url');
            var qs = require('querystring');
            var parsedUrl = url.parse(odesk.OAuth._request.mostRecentCall.args[0].path);
            var query = qs.parse(parsedUrl.query);
            expect(query.param1).toEqual('val1');
            expect(query.oauth_consumer_key).toEqual('key');
            expect(query.oauth_nonce).toBeDefined();
            expect(query.oauth_signature_method).toEqual('HMAC-SHA1');
            expect(query.oauth_timestamp).toBeDefined();
            expect(query.oauth_version).toEqual('1.0');
            expect(query.oauth_signature).toBeDefined();
        });
    });
});
