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

// module.exports = function createReducer ({Hub, pubKey, loadHubs, server}) {
//   Hub = Hub || function Hub (hub) {
//     return SignalHub('sbot-rtc-gossip', hub) // TODO: version number
//   }
//
//   const loadHubsFromFile = ({filePath}, cb) => {
//     filePath = filePath || './known_rtc_hubs.json'
//     fs.readFile(filePath, cb)
//   }

//  const loadKnownHubs = loadHubs || loadHubsFromFile

module.exports = function (state, action) {
  switch (action.type) {
    case HUB_ADDRESS_ADDED: {
      if (state.hubs[action.hub]) { return state }
      const newHub = {
        connection: null,
        connectionAttempts: 0,
        peers: {}
      }

      const newModel = Object.assign({}, state, { hubs: {[action.hub]: newHub} })
      return newModel
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
      return state
  }
}
