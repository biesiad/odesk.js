"use strict";

describe("oDesk", function () {
    describe("oDesk.Auth", function () {
        beforeEach(function() {
            oDesk.Auth.init('key', 'secret');
        });

        describe('#getFrob', function () {
            it('should return no data to callback on error', function(){
                var callback = jasmine.createSpy();
                spyOn($, 'ajax').andCallFake(function (options) {
                    options.error();
                });
                oDesk.Auth.getFrob(callback);
                expect(callback).toHaveBeenCalledWith({});
            });

            it("should POST on api url", function () {
                var ajaxOptions,
                    callback = function () {};
                spyOn($, 'ajax');

                oDesk.Auth.getFrob(callback);
                ajaxOptions = $.ajax.mostRecentCall.args[0];
                expect(ajaxOptions.url).toEqual('https://www.odesk.com/api/auth/v1/keys/frobs.json'); 
                expect(ajaxOptions.data).toEqual({ api_key : 'key', api_sig : '2663dceff40088f756b984592465d482' }); 
                expect(ajaxOptions.type).toEqual('POST'); 
            });

            it("should return frob to callback", function () {
                var callback = jasmine.createSpy();
                spyOn($, 'ajax').andCallFake(function (options) {
                    options.success({ frob: "frob" });
                });

                oDesk.Auth.getFrob(callback);
                expect(callback).toHaveBeenCalledWith({ frob: "frob" });
            });
        });

        describe('#getToken', function () {
            it('should return no data to callback on error', function(){
                var callback = jasmine.createSpy();
                spyOn($, 'ajax').andCallFake(function (options) {
                    options.error();
                });
                oDesk.Auth.getToken('frob', callback);
                expect(callback).toHaveBeenCalledWith({});
            });
            
            it("should POST on api url", function () {
                var ajaxOptions,
                    callback = function () {};
                spyOn($, 'ajax');

                oDesk.Auth.getToken('frob', callback);
                ajaxOptions = $.ajax.mostRecentCall.args[0];
                expect(ajaxOptions.url).toEqual('https://www.odesk.com/api/auth/v1/keys/tokens.json'); 
                expect(ajaxOptions.data).toEqual({ api_key: 'key', frob: 'frob', api_sig: '5efc798e5d351bfde03faa9b3d703877' }); 
                expect(ajaxOptions.type).toEqual('POST'); 
            });

            it("should return token to callback", function () {
                var callback = jasmine.createSpy();
                spyOn($, 'ajax').andCallFake(function (options) {
                    options.success({ token: "token" });
                });
                oDesk.Auth.getToken('frob', callback);
                expect(callback).toHaveBeenCalledWith({ token: "token" });
            });
        });

        describe('#getAuthorizationUrl', function () {
            it('should return formated url with frob', function () {
                var url = oDesk.Auth.getAuthorizationUrl("frob");
                expect(url).toEqual("https://www.odesk.com/services/api/auth/?api_key=key&frob=frob&api_sig=5efc798e5d351bfde03faa9b3d703877");
            });
        });
    });

    describe('oDesk.Data', function () {
        beforeEach(function () {
            oDesk.Data.init({ key: 'key', secret: 'secret', frob: 'frob', token: 'token' });
        });

        describe('#get', function () {
            it('should return no data to callback on error', function(){
                var callback = jasmine.createSpy();
                spyOn($, 'ajax').andCallFake(function (options) {
                    options.error();
                });
                oDesk.Data.get('http://test.com', { tq: "SELECT hours" }, callback);
                expect(callback).toHaveBeenCalledWith({});
            });
            
            it("should get formated url with signature", function() {
                var ajaxOptions,
                    callback = function () {};
                spyOn($, 'ajax');

                oDesk.Data.get("http://test.com", { tq: "SELECT hours" }, callback);
                ajaxOptions = $.ajax.mostRecentCall.args[0];
                expect(ajaxOptions.url).toEqual("http://test.com?tq=SELECT%20hours&api_token=token&api_key=key&frob=frob&api_sig=effb1ee7d8265e5eb9f6a4de9bf622c7");
                expect(ajaxOptions.type).toEqual('GET'); 
            });
        });
    });

    describe('oDesk.Utils', function () {
        describe('#params2array', function () {
            it('should return empty array in no params', function(){
                var array = oDesk.Utils.params2array({});
                expect(array).toEqual([]);
            });
            
            it('should return parameters in array', function(){
                var params = {
                        key3: "val3", 
                        key2: "val2", 
                        key1: "val1"
                    },
                    array = oDesk.Utils.params2array(params);

                expect(array).toEqual([["key3", "val3"], ["key2", "val2"], ["key1", "val1"]]);
            });
        });

        describe('#getSignature', function(){
            it('should return md5 of "secret + sortedParams"', function(){
                var params = {
                        key3: "val3", 
                        key2: "SELECT hours WHERE worked_on = '2000-01-01'", 
                        key1: "some:thing"
                    },
                    signature = oDesk.Utils.getSignature("secret", params);
                expect(signature).toEqual("a451bfab385a30eeef4d5d5e977becde");
            });
        });

        describe('#formatUrl', function(){
            it('should return formated url for params', function(){
                var params = {
                        key3: "val3", 
                        key2: "SELECT hours WHERE worked_on = '2000-01-01'", 
                        key1: "some:thing"
                    },
                    url = oDesk.Utils.formatUrl("http://testhost.com", params);
                expect(url).toEqual("http://testhost.com?key3=val3&key2=SELECT%20hours%20WHERE%20worked_on%20%3D%20'2000-01-01'&key1=some%3Athing");
            });

            it('should return host+path when params empty', function(){
                var url = oDesk.Utils.formatUrl("http://testhost.com", {});
                expect(url).toEqual("http://testhost.com?");
            });
        });
    });
});
