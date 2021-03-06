'use strict'

const pull = require('pull-stream')
const { createStore, applyMiddleware } = require('redux')
const onWakeup = require('on-wakeup')
const onNetwork = require('on-change-network')
const {createLogger} = require('redux-logger')
const thunk = require('redux-thunk').default

const reducer = require('./reducer')
const { Actions } = require('./actions')

const loggerColors = {
  title: false,
  prevState: false,
  action: false,
  nextState: false,
  error: false
}

function App ({Hub, server, hubAddresses}) {
  const pubKey = server.whoami()

  const logger = createLogger({colors: loggerColors})
  const store = createStore(reducer, {hubs: {}}, applyMiddleware(logger, thunk))
  const actions = Actions({Hub, pubKey, server})
  const { hubAddressAdded, remotePeerClientDidConnect } = actions

  pull(
    hubAddresses(),
    pull.drain((hub) => {
      store.dispatch(hubAddressAdded({hub: hub.address}))
    })
  )

  server.on('RTC_CLIENT_CONNECTED', ({peer, hub}) => {
    store.dispatch(remotePeerClientDidConnect({hub, peer}))
  })

  return { store, actions }
}

module.exports = App
