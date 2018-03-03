const { createSelector } = require('reselect')
const { CONNECTION_STATE_CONNECTED } = require('./connection-state-types')

// Selectors
const hubsSelector = model => model.hubs
const peersSelector = createSelector(
  hubsSelector,
  hubs => {
    return Object.keys(hubs)
      .reduce((acc, hubKey) => Object.assign(acc, hubs[hubKey].peers), {})
  }
)

const numberConnectedPeersSelector = createSelector(
  peersSelector,
  peers => {
    return Object.keys(peers)
      .reduce((acc, peer) => {
        return acc + peers[peer].connectionsState === CONNECTION_STATE_CONNECTED ? 1 : 0
      }, 0)
  }
)

module.exports = {
  numberConnectedPeersSelector,
  hubsSelector,
  peersSelector
}
