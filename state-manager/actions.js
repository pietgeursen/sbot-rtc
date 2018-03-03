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

// Action creators
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

module.exports = {
  REMOTE_PEER_DID_ANNOUNCE,
  REMOTE_PEER_DID_DISCONNECT,
  REMOTE_PEER_CONNECTION_SUCCEEDED,
  REMOTE_PEER_CONNECTION_FAILED,
  DISCONNECT_FROM_REMOTE_PEER,
  HUB_ADDRESS_ADDED,
  HUB_ADDRESS_REMOVED,
  KNOWN_HUBS_ADDED,
  PEER_CONNECTION_TIMER_TICKED,
  EMITTED_NEW_HUB,

  SCHEDULE_START_PEER_CONNECTION_TICK,
  SCHEDULE_ANNOUNCE_TO_HUB,
  SCHEDULE_SAVE_HUBS,
  SCHEDULE_CONNECT_TO_REMOTE_PEER,
  SCHEDULE_BROADCAST_KNOWN_HUBS,
  SCHEDULE_ADD_KNOWN_HUBS,
  SCHEDULE_SERVER_EMIT_NEW_HUB,

  emittedNewHub,
  remotePeerDidAnnounce,
  peerConnectionTimerTicked,
  hubAddressAdded,
  knownHubsAdded,

  scheduleServerEmitNewHub,
  scheduleStartPeerConnectionTick,
  scheduleAnnounceToHub,
  scheduleAddKnownHubs
}
