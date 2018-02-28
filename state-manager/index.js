'use strict'

const fs = require('fs')
const {pull} = require('inu')
const pullAsync = require('pull-async')
const Push = require('pull-pushable')
const Cat = require('pull-cat')
const wrtc = require('wrtc')
const SignalHub = require('signalhub')

// Actions
const REMOTE_PEER_DID_ANNOUNCE = Symbol('REMOTE_PEER_DID_ANNOUNCE')
const REMOTE_PEER_DID_DISCONNECT = Symbol('REMOTE_PEER_DID_DISCONNECT')
const REMOTE_PEER_CONNECTION_SUCCEEDED = Symbol('REMOTE_PEER_CONNECTION_SUCCEEDED')
const REMOTE_PEER_CONNECTION_FAILED = Symbol('REMOTE_PEER_CONNECTION_FAILED')
const DISCONNECT_FROM_REMOTE_PEER = Symbol('DISCONNECT_FROM_REMOTE_PEER')
const HUB_ADDRESS_ADDED = Symbol('HUB_ADDRESS_ADDED')
const HUB_ADDRESS_REMOVED = Symbol('HUB_ADDRESS_REMOVED')
const KNOWN_HUBS_ADDED = Symbol('KNOWN_HUBS_ADDED')
const PEER_CONNECTION_TIMER_TICKED = Symbol('PEER_CONNECTION_TIMER_TICKED')
const EMITTED_NEW_HUB = Symbol('EMITTED_NEW_HUB')

// Effects
const SCHEDULE_START_PEER_CONNECTION_TICK = Symbol('SCHEDULE_START_PEER_CONNECTION_TICK')
const SCHEDULE_ANNOUNCE_TO_HUB = Symbol('SCHEDULE_ANNOUNCE_TO_HUB')
const SCHEDULE_SAVE_HUBS = Symbol('SCHEDULE_SAVE_HUBS')
const SCHEDULE_CONNECT_TO_REMOTE_PEER = Symbol('SCHEDULE_CONNECT_TO_REMOTE_PEER')
const SCHEDULE_BROADCAST_KNOWN_HUBS = Symbol('SCHEDULE_BROADCAST_KNOWN_HUBS')
const SCHEDULE_ADD_KNOWN_HUBS = Symbol('SCHEDULE_ADD_KNOWN_HUBS')
const SCHEDULE_SERVER_EMIT_NEW_HUB = Symbol('SCHEDULE_SERVER_EMIT_NEW_HUB')


// Peer connection states
const CONNECTION_STATE_CONNECTED = Symbol('CONNECTION_STATE_CONNECTED')
const CONNECTION_STATE_DISCONNECTED = Symbol('CONNECTION_STATE_DISCONNECTED')
const CONNECTION_STATE_CONNECTING = Symbol('CONNECTION_STATE_CONNECTING')

function scheduleServerEmitNewHub ({hub}) {
  return {
    type: SCHEDULE_SERVER_EMIT_NEW_HUB,
    hub
  }
}

function emittedNewHub ({hub}) {
  return {
    type: EMITTED_NEW_HUB,
    hub
  }
}

function remotePeerDidAnnounce ({peer, hub}) {
  return {
    type: REMOTE_PEER_DID_ANNOUNCE,
    peer,
    hub
  }
}

function peerConnectionTimerTicked () {
  return {
    type: PEER_CONNECTION_TIMER_TICKED
  }
}

function scheduleStartPeerConnectionTick () {
  return {
    type: SCHEDULE_START_PEER_CONNECTION_TICK
  }
}

function hubAddressAdded ({hub}) {
  return {
    type: HUB_ADDRESS_ADDED,
    hub
  }
}

function knownHubsAdded () {
  return {
    type: KNOWN_HUBS_ADDED
  }
}

function scheduleAnnounceToHub ({hub, id}) {
  return {
    type: SCHEDULE_ANNOUNCE_TO_HUB,
    hub,
    id
  }
}

function scheduleAddKnownHubs () {
  return {
    type: SCHEDULE_ADD_KNOWN_HUBS
  }
}

module.exports = function App ({Hub, pubKey, loadHubs, server}) {
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
          console.log('new model', newModel.hubs[action.hub].peers)
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
          return Cat([
            pull.once(knownHubsAdded()),
            pull(
              pullAsync((cb) => loadKnownHubs({}, cb)),
              pull.flatten(),
              pull.map(hub => hubAddressAdded({hub}))
            )
          ])
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
