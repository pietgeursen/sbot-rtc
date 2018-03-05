'use strict'

const fs = require('fs')
const pull = require('pull-stream')
const SignalHub = require('signalhub')
const { createSelector } = require('reselect')
const { createStore, applyMiddleware } = require('redux')
const thunk = require('redux-thunk').default

const reducer = require('./reducer')
const { hubAddressAdded } = require('./actions')

function App ({Hub, pubKey, loadHubs, server, hubAddresses}) {
  const store = createStore(reducer, {hubs: {}}, applyMiddleware(thunk))

  pull(
    hubAddresses(),
    pull.drain((hub) => {
      store.dispatch(hubAddressAdded({hub: hub.address}))
    })
  )

  Hub()
    .subscribe()

  return store
}

module.exports = {
  App
}
