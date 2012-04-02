var odesk = require('../odesk.js');

describe('api', function () {
    describe('get', function () {
        it('calls OAuth.get if method not specified', function () {
            spyOn(odesk.OAuth, 'get');
            spyOn(odesk.tokenAuth, 'get');
            odesk.get('http://test.com', { paramKey: 'paramValue' }, function () {});
            expect(odesk.OAuth.get).toHaveBeenCalled();
            expect(odesk.tokenAuth.get).not.toHaveBeenCalled();
        });
        it('calls OAuth.get', function () {
            spyOn(odesk.OAuth, 'get');
            spyOn(odesk.tokenAuth, 'get');

            odesk.get('http://test.com', { paramKey: 'paramValue' }, function () {}, 'OAuth');
            expect(odesk.OAuth.get).toHaveBeenCalled();
            expect(odesk.tokenAuth.get).not.toHaveBeenCalled();
        });
        it('calls tokenAuth.get', function () {
            spyOn(odesk.OAuth, 'get');
            spyOn(odesk.tokenAuth, 'get');

            odesk.get('http://test.com', { paramKey: 'paramValue' }, function () {}, 'tokenAuth');
            expect(odesk.OAuth.get).not.toHaveBeenCalled();
            expect(odesk.tokenAuth.get).toHaveBeenCalled();
        });
    });
});
