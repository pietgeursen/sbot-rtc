'use strict'

const fs = require('fs')
const SignalHub = require('signalhub')
const { createSelector } = require('reselect')
const { createStore, applyMiddleware } = require('redux')

function App ({Hub, pubKey, loadHubs, server}) {
  Hub = Hub || function Hub (hub) {
    return SignalHub('sbot-rtc-gossip', hub) // TODO: version number
  }

  const loadHubsFromFile = ({filePath}, cb) => {
    filePath = filePath || './known_rtc_hubs.json'
    fs.readFile(filePath, cb)
  }

  const loadKnownHubs = loadHubs || loadHubsFromFile

  return {
    init: function () {
      return {
        model: {
          hubs: {

          }
        },
        effect: scheduleAddKnownHubs()
      }
    },
    update: function (model, action) {
      switch (action.type) {
        case KNOWN_HUBS_ADDED: {
          console.log(action, model)
          return {model}
          return {model, effect: scheduleStartPeerConnectionTick()}
        }
        case HUB_ADDRESS_ADDED: {
          if (model.hubs[action.hub]) { return {model} }
          const newHub = {
            connection: null,
            connectionAttempts: 0,
            peers: {}
          }

          const newModel = Object.assign({}, model, { hubs: {[action.hub]: newHub} })
          return { model: newModel, effect: scheduleServerEmitNewHub({hub: action.hub}) }
        }
        case EMITTED_NEW_HUB: {
          return { model, effect: scheduleAnnounceToHub({hub: action.hub, id: pubKey}) }
        }
        case REMOTE_PEER_DID_ANNOUNCE: {
          if (model.hubs[action.hub].peers[action.peer] || action.peer === pubKey) { return {model} }

          const newPeer = {
            connectionsState: CONNECTION_STATE_DISCONNECTED
          }
          const newModel = Object.assign({}, model, { hubs: {[action.hub]: {peers: {[action.peer]: newPeer}}} })
          return {model: newModel}
        }
        default:
          return {model}
      }
    },
    run: function (effect, sources) {
      switch (effect.type) {
        case SCHEDULE_ANNOUNCE_TO_HUB: {
          const hub = Hub(effect.hub)
          const p = Push()

          hub.broadcast('PEER_ANNOUNCE', {id: pubKey})

          hub.subscribe('PEER_ANNOUNCE')
            .on('data', p.push)

          return pull(
            p,
            pull.map((peer) => remotePeerDidAnnounce({peer: peer.id, hub: effect.hub}))
          )
        }
        case SCHEDULE_SERVER_EMIT_NEW_HUB: {
          if (server && server.emit) {
            server.emit('RTC_HUB_ADDED', effect.hub)
          }
          return pull.once(emittedNewHub({hub: effect.hub}))
        }
        case SCHEDULE_ADD_KNOWN_HUBS: {
          return pull.once(knownHubsAdded())
          //return Cat([
          //  pull(
          //    pullAsync((cb) => loadKnownHubs({}, cb)),
          //    pull.flatten(),
          //    pull.map(hub => hubAddressAdded({hub}))
          //  )
          //])
        }
        case SCHEDULE_START_PEER_CONNECTION_TICK: {
          const p = Push()
          setInterval(() => { p.push(peerConnectionTimerTicked()) }, 5e3)
          return p
        }
        default: {
          console.log('unknown effect:', effect)
        }
      }
    }
  }
}
module.exports = {
  App,

}
