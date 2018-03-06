const fs = require('fs')

const NETWORK_DID_RECONNECT = Symbol('NETWORK_DID_RECONNECT')
const CONNECT_TO_HUB = Symbol('CONNECT_TO_HUB')
const ANNOUNCE_TO_HUB = Symbol('ANNOUNCE_TO_HUB')

const HUB_ADDRESS_ADDED = Symbol('HUB_ADDRESS_ADDED')

const REMOTE_PEER_DID_ANNOUNCE = Symbol('REMOTE_PEER_DID_ANNOUNCE')
const REMOTE_PEER_DID_DISCONNECT = Symbol('REMOTE_PEER_DID_DISCONNECT')
const REMOTE_PEER_CONNECTING = Symbol('REMOTE_PEER_CONNECTING')
const REMOTE_PEER_CONNECTION_SUCCEEDED = Symbol('REMOTE_PEER_CONNECTION_SUCCEEDED')
const REMOTE_PEER_CONNECTION_FAILED = Symbol('REMOTE_PEER_CONNECTION_FAILED')
const REMOTE_PEER_DISCONNECT = Symbol('REMOTE_PEER_DISCONNECT')
const PEER_CONNECTION_TIMER_TICKED = Symbol('PEER_CONNECTION_TIMER_TICKED')

function networkDidReconnect () {
  return {
    type: NETWORK_DID_RECONNECT
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

function connectToHub ({hub}) {
  return {
    type: CONNECT_TO_HUB,
    hub
  }
}

function remotePeerConnecting ({hub, peer}) {
  return {
    type: REMOTE_PEER_CONNECTING,
    hub,
    peer
  }
}

function remotePeerDidDisconnect ({hub, peer}) {
  return {
    type: REMOTE_PEER_DID_DISCONNECT,
    hub,
    peer
  }
}

function remotePeerConnectionSucceeded ({hub, peer}) {
  return {
    type: REMOTE_PEER_CONNECTION_SUCCEEDED,
    hub,
    peer
  }
}

function remotePeerConnectionFailed ({hub, peer}) {
  return {
    type: REMOTE_PEER_CONNECTION_FAILED,
    hub,
    peer
  }
}

function remotePeerDidAnnounce ({hub, peer}) {
  return {
    type: REMOTE_PEER_DID_ANNOUNCE,
    peer,
    hub
  }
}

function remotePeerDisconnect ({hub, peer}) {
  return {
    type: REMOTE_PEER_DISCONNECT,
    peer,
    hub
  }
}

module.exports = {
  REMOTE_PEER_DID_ANNOUNCE,
  REMOTE_PEER_DID_DISCONNECT,
  REMOTE_PEER_CONNECTION_SUCCEEDED,
  REMOTE_PEER_CONNECTION_FAILED,
  REMOTE_PEER_CONNECTING,
  REMOTE_PEER_DISCONNECT,
  PEER_CONNECTION_TIMER_TICKED,
  HUB_ADDRESS_ADDED,
  NETWORK_DID_RECONNECT,
  CONNECT_TO_HUB,
  ANNOUNCE_TO_HUB,

  remotePeerDidAnnounce,
  remotePeerDidDisconnect,
  remotePeerConnectionSucceeded,
  remotePeerConnectionFailed,
  remotePeerConnecting,
  remotePeerDisconnect,
  peerConnectionTimerTicked, //has side effect
  hubAddressAdded,
  networkDidReconnect,
  connectToHub, //has side effect
  announceToHub //has side effect
}
