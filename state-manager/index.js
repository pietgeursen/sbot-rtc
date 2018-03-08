'use strict'

const fs = require('fs')
const pull = require('pull-stream')
const SignalHub = require('signalhub')
const { createSelector } = require('reselect')
const { createStore, applyMiddleware } = require('redux')
const onWakeup = require('on-wakeup')
const onNetwork = require('on-change-network')
const {createLogger} = require('redux-logger')
const thunk = require('redux-thunk').default

const reducer = require('./reducer')
const { Actions } = require('./actions')
const { hubAddressAdded } = Actions({})

const loggerColors = {
  title: false,
  prevState: false,
  action: false,
  nextState: false,
  error: false
}

function App ({Hub, pubKey, loadHubs, server, hubAddresses}) {
  const store = createStore(reducer, {hubs: {}}, applyMiddleware(createLogger({colors: loggerColors}), thunk))

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
