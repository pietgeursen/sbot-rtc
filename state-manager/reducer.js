var {
  HUB_ADDRESS_ADDED,
  REMOTE_PEER_DID_ANNOUNCE,
  NETWORK_DID_RECONNECT
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

module.exports = function reducer (state, action) {
  switch (action.type) {
    case NETWORK_DID_RECONNECT: {
      const newState = Object.assign({}, state)

      Object.keys(newState.hubs).forEach(hubKey => {
        newState.hubs[hubKey].peers = {}
      })
      return newState
    }
    case HUB_ADDRESS_ADDED: {
      if (state.hubs[action.hub]) { return state }
      const newHub = {
        connection: null,
        peers: {}
      }

      const newModel = Object.assign({}, state, { hubs: {[action.hub]: newHub} })
      return newModel
    }
    case REMOTE_PEER_DID_ANNOUNCE: {
      if (state.hubs[action.hub].peers[action.peer] || action.peer === state.pubKey) { return state }

      const newPeer = {
        connectionState: CONNECTION_STATE_DISCONNECTED
      }

      state.hubs[action.hub].peers[action.peer] = newPeer
      return Object.assign({}, state)
    }
    default:
      return state
  }
}
