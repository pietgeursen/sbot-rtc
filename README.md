# WIP

## Modules

## Deps

This touches a lot in the stack.

- ssb-ref
- scuttle-testbot
- scuttlebot
  - /plugins/replicate
  - secretstack
    - multiserver

## Open issues to think about:

- [ ] handling the isDownloading state when scheduling peer connections.
- [ ] version numbers!
- [ ] de-prioritising hubs / peers if they fail to connect. 
- [x] weaving the hubs list into the multiserver server.
- [ ] standardise how hub and peer objects are passed around in the state manager and emitted by the sbot.
- [ ] check how to make sure hub and peer connections can be forced closed. Is important for network and wake up events to trigger this. 
- [ ] sanitise hub addresses properly. Multiserver addresses don't allow https as part of them. So multiserver rtc plugin _assumes_ https. 
- [ ] test initial sync
- [ ] steal the code that exposes the connected peers obs.

## Current goal:

- get a dev example going so I can try connect with mix.
  - [ ] change modules in package.json to point at mine on github.
    - [ ] fork ssb-ref, multiserver, secret-stack.
  - [ ] make client test use state manager.
  - [ ] suss out how to install a sbot plugin from command line. 

## Next goal:

- describe a peer manager that handles connecting and disconnecting to peers.



## Peers state manager

### State

Example state:
```
{
  hubs: {
    signal_hub.com: 
    {
      connection: signalHubConnection,
      connectionAttempts: 0
      peers: {
        [peerId]: {
          peerConnection: simplePeerConnection,
          connectionState: 'CONNECTING' | 'DISCONNECTED' | 'CONNECTED',
        }
      }
    },
  }
}
```

### Actions

REMOTE_PEER_DID_ANNOUNCE,
REMOTE_PEER_DID_DISCONNECT,
REMOTE_PEER_CONNECTION_SUCCEEDED,
REMOTE_PEER_CONNECTION_FAILED,
REMOTE_PEER_CONNECTING,
REMOTE_PEER_DISCONNECT,
REMOTE_PEER_CLIENT_DID_CONNECT,
PEER_CONNECTION_TIMER_TICKED,
HUB_ADDRESS_ADDED,
NETWORK_DID_RECONNECT,
CONNECT_TO_HUB,
ANNOUNCE_TO_HUB,

### Features

- [x] load a hub table
- [x] Announce as a peer to all hubs.
- [x] maintain a table of known peers.
  - [x] add a peer when they announce
  - [ ] how do we remove a peer when they're gone?
    - [ ] a count of failures?
    - [ ] making sure a peer emits an event when it's about to disconnect.
    - [ ] check how swarm does it.
- [ ] occasionally connect to some peers up to a maxiumum number of peers.
- [ ] disconnect from a peer after some time. But not if it's downloading.
- [ ] broadcast your table of known hubs to gossip them around. => No. Use published messages. 
- [ ] include version number in hub app name

### Example flow

TODO: flow diagram

```
//load up stored hubs
//dispatch `HUB_ADDRESS_ADDED` for each known address.
//this will kick off:
// - `SCHEDULE_CONNECT_TO_HUB`
//this will succeed or fail. On failure:
// - `HUB_CONNECTION_FAILED`
//on success:
// - `HUB_CONNECTION_SUCCEEDED`
```
