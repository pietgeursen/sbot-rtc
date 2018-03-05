var fs = require('fs')

const NETWORK_DISCONNECT = Symbol('NETWORK_DISCONNECT')
const NETWORK_CONNECT = Symbol('NETWORK_CONNECT')
const RESET_ALL_HUBS = Symbol('RESET_ALL_HUBS')
const CONNECT_TO_HUB = Symbol('CONNECT_TO_HUB')
const ANNOUNCE_TO_HUB = Symbol('ANNOUNCE_TO_HUB')

const ADD_HUB_ADDRESS = Symbol('ADD_HUB_ADDRESS')
const HUB_ADDRESS_ADDED = Symbol('HUB_ADDRESS_ADDED')

const REMOTE_PEER_DID_ANNOUNCE = Symbol('REMOTE_PEER_DID_ANNOUNCE')
const REMOTE_PEER_DID_DISCONNECT = Symbol('REMOTE_PEER_DID_DISCONNECT')
const REMOTE_PEER_CONNECTION_SUCCEEDED = Symbol('REMOTE_PEER_CONNECTION_SUCCEEDED')
const REMOTE_PEER_CONNECTION_FAILED = Symbol('REMOTE_PEER_CONNECTION_FAILED')
const DISCONNECT_FROM_REMOTE_PEER = Symbol('DISCONNECT_FROM_REMOTE_PEER')
const PEER_CONNECTION_TIMER_TICKED = Symbol('PEER_CONNECTION_TIMER_TICKED')

// Effects
const CONNECT_TO_REMOTE_PEER = Symbol('SCHEDULE_CONNECT_TO_REMOTE_PEER')

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

function hubAddressAdded ({hub}) {
  return {
    type: HUB_ADDRESS_ADDED,
    hub
  }
}

function announceToHub ({hub, id}) {
  return function (dispatch, getState) {
    return {
      type: ANNOUNCE_TO_HUB,
      hub,
      id
    }
  }
}

module.exports = {
  REMOTE_PEER_DID_ANNOUNCE,
  REMOTE_PEER_DID_DISCONNECT,
  REMOTE_PEER_CONNECTION_SUCCEEDED,
  REMOTE_PEER_CONNECTION_FAILED,
  DISCONNECT_FROM_REMOTE_PEER,
  HUB_ADDRESS_ADDED,
  PEER_CONNECTION_TIMER_TICKED,

  ANNOUNCE_TO_HUB,
  CONNECT_TO_REMOTE_PEER,

  remotePeerDidAnnounce,
  peerConnectionTimerTicked,
  hubAddressAdded,

  announceToHub
}
