odesk = require('../odesk.js')

describe 'api', ->
  describe 'get', ->
    it 'calls OAuth.get if method not specified', ->
      spyOn(odesk.OAuth, 'get')
      spyOn(odesk.tokenAuth, 'get')

      odesk.get('http://test.com', paramKey: 'paramValue', ->)
      expect(odesk.OAuth.get).toHaveBeenCalled()
      expect(odesk.tokenAuth.get).not.toHaveBeenCalled()

   it 'calls OAuth.get', ->
     spyOn(odesk.OAuth, 'get')
     spyOn(odesk.tokenAuth, 'get')

     odesk.get('http://test.com', paramKey: 'paramValue', (->), 'OAuth')
     expect(odesk.OAuth.get).toHaveBeenCalled()
     expect(odesk.tokenAuth.get).not.toHaveBeenCalled()

   it 'calls tokenAuth.get', ->
     spyOn(odesk.OAuth, 'get')
     spyOn(odesk.tokenAuth, 'get')

     odesk.get('http://test.com', paramKey: 'paramValue', (->), 'tokenAuth')
     expect(odesk.OAuth.get).not.toHaveBeenCalled()
     expect(odesk.tokenAuth.get).toHaveBeenCalled()
