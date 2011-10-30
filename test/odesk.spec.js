"use strict";
var odesk = require('../lib/odesk.js');

describe("odesk", function () {
    describe("odesk.Auth", function () {
        beforeEach(function() {
            odesk.Auth.init('key', 'secret');
        });

        describe('#getFrob', function () {
            it('should return no data to callback on error', function(){
                var callback = jasmine.createSpy();
                spyOn(odesk.Utils, 'request').andCallFake(function (options) {
                    options.callback({});
                });
                odesk.Auth.getFrob(callback);
                expect(callback).toHaveBeenCalledWith({});
            });

            it("should POST on api url", function () {
                var callback = function () { };
                spyOn(odesk.Utils, 'request');

                odesk.Auth.getFrob(callback);
                expect(odesk.Utils.request).toHaveBeenCalledWith({ 
                    url: 'https://www.odesk.com/api/auth/v1/keys/frobs.json', 
                    method: 'POST',  
                    data: {
                        api_key : 'key', 
                        api_sig : '2663dceff40088f756b984592465d482'
                    },
                    callback: callback
                });
            });

            it("should return frob to callback", function () {
                var callback = jasmine.createSpy();
                spyOn(odesk.Utils, 'request').andCallFake(function (options) {
                    options.callback({ frob: "frob" });
                });
                odesk.Auth.getFrob(callback);
                expect(callback).toHaveBeenCalledWith({ frob: "frob" });
            });
        });

        describe('#getToken', function () {
            it('should return no data to callback on error', function(){
                var callback = jasmine.createSpy();
                spyOn(odesk.Utils, 'request').andCallFake(function (options) {
                    options.callback({});
                });
                odesk.Auth.getToken('frob', callback);
                expect(callback).toHaveBeenCalledWith({});
            });
            
            it("should POST on api url", function () {
                var callback = function () {};
                spyOn(odesk.Utils, 'request');

                odesk.Auth.getToken('frob', callback);
                expect(odesk.Utils.request).toHaveBeenCalledWith({
                    url: 'https://www.odesk.com/api/auth/v1/keys/tokens.json',
                    data: {
                        api_key: 'key', 
                        frob: 'frob', 
                        api_sig: '5efc798e5d351bfde03faa9b3d703877'
                    },
                    method: 'POST',
                    callback: callback
                });
            });

            it("should return token to callback", function () {
                var callback = jasmine.createSpy();
                spyOn(odesk.Utils, 'request').andCallFake(function (options) {
                    options.callback({ token: "token" });
                });
                odesk.Auth.getToken('frob', callback);
                expect(callback).toHaveBeenCalledWith({ token: "token" });
            });
        });

        describe('#getAuthorizationUrl', function () {
            it('should return formated url with frob', function () {
                var url = odesk.Auth.getAuthorizationUrl("frob");
                expect(url).toEqual("https://www.odesk.com/services/api/auth/?api_key=key&frob=frob&api_sig=5efc798e5d351bfde03faa9b3d703877");
            });
        });
    });

    describe('odesk.Data', function () {
        beforeEach(function () {
            odesk.Data.init({ key: 'key', secret: 'secret', frob: 'frob', token: 'token' });
        });

        describe('#get', function () {
            it('should return no data to callback on error', function(){
                var callback = jasmine.createSpy();
                spyOn(odesk.Utils, 'request').andCallFake(function (options) {
                    options.callback({});
                });
                odesk.Data.get('http://test.com', { tq: "SELECT hours" }, callback);
                expect(callback).toHaveBeenCalledWith({});
            });
            
            it("should get formated url with signature", function() {
                var callback = function () {};
                spyOn(odesk.Utils, 'request');

                odesk.Data.get("https://test.com", { tq: "SELECT hours" }, callback);
                expect(odesk.Utils.request).toHaveBeenCalledWith({
                    url: "https://test.com?tq=SELECT%20hours&api_token=token&api_key=key&frob=frob&api_sig=effb1ee7d8265e5eb9f6a4de9bf622c7",
                    method: 'GET',
                    callback: callback
                });
            });
        });
    });

    describe('odesk.Utils', function () {
        describe('#params2array', function () {
            it('should return empty array in no params', function(){
                var array = odesk.Utils.params2array({});
                expect(array).toEqual([]);
            });
            
            it('should return parameters in array', function(){
                var params = {
                        key3: "val3", 
                        key2: "val2", 
                        key1: "val1"
                    },
                    array = odesk.Utils.params2array(params);

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
                    signature = odesk.Utils.getSignature("secret", params);
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
                    url = odesk.Utils.formatUrl("https://testhost.com", params);
                expect(url).toEqual("https://testhost.com?key3=val3&key2=SELECT%20hours%20WHERE%20worked_on%20%3D%20'2000-01-01'&key1=some%3Athing");
            });

            it('should return host+path when params empty', function(){
                var url = odesk.Utils.formatUrl("https://testhost.com", {});
                expect(url).toEqual("https://testhost.com?");
            });
        });

        describe('#formatUrlParams', function () {
            it('should return params formated string', function () {
                var params = {
                        key3: "val3", 
                        key2: "SELECT hours WHERE worked_on = '2000-01-01'", 
                        key1: "some:thing"
                    },
                    url = odesk.Utils.formatUrlParams(params);
                expect(url).toEqual("key3=val3&key2=SELECT%20hours%20WHERE%20worked_on%20%3D%20'2000-01-01'&key1=some%3Athing");
            });
        });
    });
});
