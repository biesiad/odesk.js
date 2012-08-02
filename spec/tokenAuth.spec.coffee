tokenAuth = require("../odesk.js").tokenAuth
describe "odesk.tokenAuth", ->
  beforeEach ->
    tokenAuth.init "key", "secret"

  describe "#getFrob", ->
    it "should return error to callback on error", ->
      callback = jasmine.createSpy()
      spyOn(tokenAuth, "request").andCallFake (options) ->
        options.callback "error", {}

      tokenAuth.getFrob callback
      expect(callback).toHaveBeenCalledWith "error", {}

    it "should POST on api url", ->
      callback = ->

      spyOn tokenAuth, "request"
      tokenAuth.getFrob callback
      expect(tokenAuth.request).toHaveBeenCalledWith
        url: "https://www.odesk.com/api/auth/v1/keys/frobs.json"
        method: "POST"
        data:
          api_key: "key"
          api_sig: "2663dceff40088f756b984592465d482"
        callback: callback


    it "should return frob to callback", ->
      callback = jasmine.createSpy()
      spyOn(tokenAuth, "request").andCallFake (options) ->
        options.callback frob: "frob"

      tokenAuth.getFrob callback
      expect(callback).toHaveBeenCalledWith frob: "frob"


  describe "#getToken", ->
    it "should return error to callback on error", ->
      callback = jasmine.createSpy()
      spyOn(tokenAuth, "request").andCallFake (options) ->
        options.callback "error", {}

      tokenAuth.getToken "frob", callback
      expect(callback).toHaveBeenCalledWith "error", {}

    it "should POST on api url", ->
      callback = ->

      spyOn tokenAuth, "request"
      tokenAuth.getToken "frob", callback
      expect(tokenAuth.request).toHaveBeenCalledWith
        url: "https://www.odesk.com/api/auth/v1/keys/tokens.json"
        data:
          api_key: "key"
          frob: "frob"
          api_sig: "5efc798e5d351bfde03faa9b3d703877"

        method: "POST"
        callback: callback


    it "should return token to callback", ->
      callback = jasmine.createSpy()
      spyOn(tokenAuth, "request").andCallFake (options) ->
        options.callback token: "token"

      tokenAuth.getToken "frob", callback
      expect(callback).toHaveBeenCalledWith token: "token"


  describe "#getAuthenticationUrl", ->
    it "should return formated url with frob", ->
      url = tokenAuth.getAuthenticationUrl("frob")
      expect(url).toEqual "https://www.odesk.com/services/api/auth/?api_key=key&frob=frob&api_sig=5efc798e5d351bfde03faa9b3d703877"


  describe "#get", ->
    beforeEach ->
      tokenAuth.accessToken = "token"
      tokenAuth.accessFrob = "frob"

    it "should return error to callback on error", ->
      callback = jasmine.createSpy()
      spyOn(tokenAuth, "request").andCallFake (options) ->
        options.callback "error", {}

      tokenAuth.get "http://test.com", tq: "SELECT hours", callback
      expect(callback).toHaveBeenCalledWith "error", {}

    it "should get formated url with signature", ->
      callback = ->

      spyOn tokenAuth, "request"
      tokenAuth.get "https://test.com", tq: "SELECT hours" , callback
      expect(tokenAuth.request).toHaveBeenCalledWith
        url: "https://test.com?tq=SELECT%20hours&api_token=token&api_key=key&frob=frob&api_sig=effb1ee7d8265e5eb9f6a4de9bf622c7"
        method: "GET"
        callback: callback


  describe "#params2array", ->
    it "should return empty array in no params", ->
      array = tokenAuth.params2array({})
      expect(array).toEqual []

    it "should return parameters in array", ->
      params =
        key3: "val3"
        key2: "val2"
        key1: "val1"

      array = tokenAuth.params2array(params)
      expect(array).toEqual [["key3", "val3"], ["key2", "val2"], ["key1", "val1"]]


  describe "#getSignature", ->
    it "should return md5 of \"secret + sortedParams\"", ->
      params =
        key3: "val3"
        key2: "SELECT hours WHERE worked_on = '2000-01-01'"
        key1: "some:thing"

      signature = tokenAuth.getSignature("secret", params)
      expect(signature).toEqual "a451bfab385a30eeef4d5d5e977becde"


  describe "#formatUrl", ->
    it "should return formated url for params", ->
      params =
        key3: "val3"
        key2: "SELECT hours WHERE worked_on = '2000-01-01'"
        key1: "some:thing"

      url = tokenAuth.formatUrl("https://testhost.com", params)
      expect(url).toEqual "https://testhost.com?key3=val3&key2=SELECT%20hours%20WHERE%20worked_on%20%3D%20'2000-01-01'&key1=some%3Athing"

    it "should return host+path when params empty", ->
      url = tokenAuth.formatUrl("https://testhost.com", {})
      expect(url).toEqual "https://testhost.com?"


  describe "#formatUrlParams", ->
    it "should return params formated string", ->
      params =
        key3: "val3"
        key2: "SELECT hours WHERE worked_on = '2000-01-01'"
        key1: "some:thing"

      url = tokenAuth.formatUrlParams(params)
      expect(url).toEqual "key3=val3&key2=SELECT%20hours%20WHERE%20worked_on%20%3D%20'2000-01-01'&key1=some%3Athing"
