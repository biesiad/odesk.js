var odesk = require('../odesk.js');
    
describe('odesk.OAuth', function () {
    describe('getAuthenticationUrl', function () {
        it('returns url with oauth token', function () {
            var token = 'token';
            var url = odesk.OAuth.getAuthenticateUrl(token);
            expect(url).toEqual('https://www.odesk.com/services/api/auth?oauth_token=' + token);
        });
    });
});
