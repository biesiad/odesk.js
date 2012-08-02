odesk = require('../odesk.js')

describe 'odesk', ->
  it 'has authorization submodules', ->
    expect(odesk.OAuth).toBeDefined()
    expect(odesk.tokenAuth).toBeDefined()

  it 'has api functions', ->
    expect(odesk.get).toBeDefined()
