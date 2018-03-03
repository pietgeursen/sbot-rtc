var {
  KNOWN_HUBS_ADDED,
  HUB_ADDRESS_ADDED,
  EMITTED_NEW_HUB,
  REMOTE_PEER_DID_ANNOUNCE,
  scheduleStartPeerConnectionTick,
  scheduleServerEmitNewHub,
  scheduleAnnounceToHub
} = require('./actions')

var { CONNECTION_STATE_DISCONNECTED } = require('./connection-state-types')

module.exports = function (state, action) {
  switch (action.type) {
    case KNOWN_HUBS_ADDED: {
      return {state, effect: scheduleStartPeerConnectionTick()}
    }
    case HUB_ADDRESS_ADDED: {
      if (state.hubs[action.hub]) { return {state} }
      const newHub = {
        connection: null,
        connectionAttempts: 0,
        peers: {}
      }

      const newModel = Object.assign({}, state, { hubs: {[action.hub]: newHub} })
      return { state: newModel, effect: scheduleServerEmitNewHub({hub: action.hub}) }
    }
    case EMITTED_NEW_HUB: {
      return { state, effect: scheduleAnnounceToHub({hub: action.hub, id: state.pubKey}) }
    }
    case REMOTE_PEER_DID_ANNOUNCE: {
      if (state.hubs[action.hub].peers[action.peer] || action.peer === state.pubKey) { return {state} }

      const newPeer = {
        connectionsState: CONNECTION_STATE_DISCONNECTED
      }
      const newModel = Object.assign({}, state, { hubs: {[action.hub]: {peers: {[action.peer]: newPeer}}} })
      return {state: newModel}
    }
    default:
      return {state}
  }
}
