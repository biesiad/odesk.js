describe('odesk', function () {
    var odesk = require('../odesk.js');
    it('has authorization submodules', function () {
        expect(odesk.OAuth).toBeDefined();
        expect(odesk.tokenAuth).toBeDefined();
    });
    it('has api functions', function () {
        expect(odesk.get).toBeDefined();
    });
});
