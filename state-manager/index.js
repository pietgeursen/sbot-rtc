'use strict'

const pull = require('pull-stream')
const { createStore, applyMiddleware } = require('redux')
const onWakeup = require('on-wakeup')
const onNetwork = require('on-change-network')
const {createLogger} = require('redux-logger')
const thunk = require('redux-thunk').default
const Url = require('url')

const reducer = require('./reducer')
const { Actions } = require('./actions')

const loggerColors = {
  title: false,
  prevState: false,
  action: false,
  nextState: false,
  error: false
}

function App ({Hub, pubKey, loadHubs, server, hubAddresses}) {
  const logger = createLogger({colors: loggerColors})
  const store = createStore(reducer, {hubs: {}}, applyMiddleware(logger, thunk))
  const actions = Actions({Hub, pubKey, server})
  const { hubAddressAdded, remotePeerConnectionSucceeded } = actions

  pull(
    hubAddresses(),
    pull.drain((hub) => {
      store.dispatch(hubAddressAdded({hub: hub.address}))
    })
  )

  server.on('RTC_CLIENT_CONNECTED', ({peer, hub}) => {
    //hub = Url(hub).hostname
    store.dispatch(remotePeerConnectionSucceeded({hub, peer}))
  })

  return { store, actions }
}

module.exports = App
