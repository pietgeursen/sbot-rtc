'use strict'

var fs = require('fs')
var {start, pull} = require('inu')
var pullAsync = require('pull-async')
var wrtc = require('wrtc')
var SignalHub = require('signalhub')

// Actions
const REMOTE_PEER_DID_ANNOUNCE = Symbol('REMOTE_PEER_DID_ANNOUNCE')
const REMOTE_PEER_DID_DISCONNECT = Symbol('REMOTE_PEER_DID_DISCONNECT')
const REMOTE_PEER_CONNECTION_SUCCEEDED = Symbol('REMOTE_PEER_CONNECTION_SUCCEEDED')
const REMOTE_PEER_CONNECTION_FAILED = Symbol('REMOTE_PEER_CONNECTION_FAILED')
const DISCONNECT_FROM_REMOTE_PEER = Symbol('DISCONNECT_FROM_REMOTE_PEER')
const HUB_ADDRESS_ADDED = Symbol('HUB_ADDRESS_ADDED')
const HUB_ADDRESS_REMOVED = Symbol('HUB_ADDRESS_REMOVED')

// Effects
const SCHEDULE_PEERS_UPDATE_TICK = Symbol('SCHEDULE_PEERS_UPDATE_TICK')
const SCHEDULE_ANNOUNCE_TO_HUB = Symbol('SCHEDULE_ANNOUNCE_TO_HUB')
const SCHEDULE_SAVE_HUBS = Symbol('SCHEDULE_SAVE_HUBS')
const SCHEDULE_CONNECT_TO_REMOTE_PEER = Symbol('SCHEDULE_CONNECT_TO_REMOTE_PEER')
const SCHEDULE_BROADCAST_KNOWN_HUBS = Symbol('SCHEDULE_BROADCAST_KNOWN_HUBS')
const SCHEDULE_ADD_KNOWN_HUBS = Symbol('SCHEDULE_ADD_KNOWN_HUBS')

function remotePeerDidAnnounce (peer) {
  return {
    type: REMOTE_PEER_DID_ANNOUNCE,
    peer
  }
}

function hubAddressAdded (address) {
  return {
    type: HUB_ADDRESS_ADDED,
    address
  }
}

function scheduleAnnounceToHub (address) {
  return {
    type: SCHEDULE_ANNOUNCE_TO_HUB,
    address
  }
}

function scheduleAddKnownHubs () {
  return {
    type: SCHEDULE_ADD_KNOWN_HUBS
  }
}

function loadKnownHubs ({filePath}, cb) {
  filePath = filePath || './known_rtc_hubs.json'
  fs.readFile(filePath, cb)
}

module.exports = function App ({Hub, pubKey}) {
  Hub = Hub || function Hub (hub) {
    return SignalHub('sbot-rtc-gossip', 'https://' + hub) // TODO: version number
  }

  return {
    init: function () {
      return {
        model: {
          peers: {

          },
          hubs: {

          }

        },
        effect: scheduleAddKnownHubs()
      }
    },
    update: function (model, action) {
      switch (action.type) {
        case HUB_ADDRESS_ADDED:
          if (model.hubs[action.address]) { return {model} }

          const newHub = {
            connection: null,
            connectionAttempts: 0
          }

          model.hubs[action.address] = newHub

          return { model, effect: scheduleAnnounceToHub(action.address) }
      }
    },
    run: function (effect, sources) {
      switch (effect.type) {
        case SCHEDULE_ANNOUNCE_TO_HUB: // wonder if there is a better naming???
          const hub = Hub(effect.address)

          hub.broadcast('PEER_ANNOUNCE', {id: pubKey})

          // TODO: for debugging
          hub.subscribt('PEER_ANNOUNCE')
            .on('data', console.log)
          break

        case SCHEDULE_ADD_KNOWN_HUBS:
          return pull(
            pullAsync(loadKnownHubs),
            pull.flatten(),
            pull.map(hubAddressAdded)
          )
      }
    }
  }
}
