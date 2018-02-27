# WIP

## Modules

- Existing structure of multiserver isn't going to make it easy to do this. The idea of servers listening to multiple hubs isn't super easy. Oh damn but what if you can start and stop the server for a given pub?

- What if I just ignored the multiple signal-hub requirement and just used one for now?
  - Then I'd only need to sort out:
    - handling multi peers.
    - connect / disconnect handling.
    - peer discovery / announcing.
    - scheduling (and this could be done later).
    - all of which could be reused later.

## Deps

This touches a lot in the stack.

- ssb-ref
- scuttle-testbot
- scuttlebot
  - /plugins/replicate
  - secretstack
    - multiserver

## Open issues to think about:

- handling the isDownloading state when scheduling peer connections.
- version numbers!
- weaving the hubs list into the multiserver server. => DONE!
- sorting hubs if they fail to connect. 

## Peers state manager

### State

```
{
  peers: {
    pubKey:  {
      peerConnection: simplePeerConnection,
      connectionState: 'CONNECTING' | 'DISCONNECTED' | 'CONNECTED',
      connectedHubs: ['signal-hub.com'],
    } 
  },
  hubs: {
    signal_hub.com: 
    {
      connection: signalHubConnection,
      connectionAttempts: 0
    },
  }
}
```

### Actions

`REMOTE_PEER_DID_ANNOUNCE` // gives hub address and remote.id
`REMOTE_PEER_DID_DISCONNECT` // gives hub address and remote.id
`REMOTE_PEER_CONNECTION_SUCCEEDED`
`REMOTE_PEER_CONNECTION_FAILED`
`DISCONNECT_FROM_REMOTE_PEER`
`HUB_ADDRESS_ADDED`
`HUB_ADDRESS_REMOVED`

### Effects

`SCHEDULE_PEERS_UPDATE_TICK`
`SCHEDULE_ANNOUNCE_TO_HUB`
`SCHEDULE_SAVE_HUBS`
`SCHEDULE_CONNECT_TO_REMOTE_PEER`
`SCHEDULE_BROADCAST_KNOWN_HUBS`

### Features

- load a hub table
- Announce as a peer to all hubs.
- maintain a table of known peers.
  - add a peer when they announce
  - how do we remove a peer when they're gone?
    - a count of failures?
    - making sure a peer emits an event when it's about to disconnect.
    - check how swarm does it.
- occasionally connect to some peers up to a maxiumum number of peers.
- disconnect from a peer after some time. But not if it's downloading.
- broadcast your table of known hubs to gossip them around. //??? 

### Example flow

TODO: flow diagram

//load up stored hubs
//dispatch `HUB_ADDRESS_ADDED` for each known address.
//this will kick off:
// - `SCHEDULE_CONNECT_TO_HUB`
//this will succeed or fail. On failure:
// - `HUB_CONNECTION_FAILED`
//on success:
// - `HUB_CONNECTION_SUCCEEDED`

