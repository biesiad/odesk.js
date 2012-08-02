odesk = require('../odesk.js')

describe 'odesk.OAuth', ->
  beforeEach ->
    odesk.OAuth.init('key', 'secret')

  describe 'getAuthenticationUrl', ->
    it 'returns url with oauth token', ->
      token = 'token'
      url = odesk.OAuth.getAuthenticateUrl(token)
      expect(url).toEqual("https://www.odesk.com/services/api/auth?oauth_token=#{token}")

  describe 'get', ->
    it 'calls api with oauth params in query', ->
      callback = jasmine.createSpy()
      spyOn(odesk.OAuth, '_request')
      odesk.OAuth.get("http://odesk.com/api", param1: "val1", callback)
      url = require('url')
      qs = require('querystring')
      parsedUrl = url.parse(odesk.OAuth._request.mostRecentCall.args[0].path)
      query = qs.parse(parsedUrl.query)
      expect(query.param1).toEqual 'val1'
      expect(query.oauth_consumer_key).toEqual 'key'
      expect(query.oauth_nonce).toBeDefined()
      expect(query.oauth_signature_method).toEqual 'HMAC-SHA1'
      expect(query.oauth_timestamp).toBeDefined()
      expect(query.oauth_version).toEqual '1.0'
      expect(query.oauth_signature).toBeDefined()
