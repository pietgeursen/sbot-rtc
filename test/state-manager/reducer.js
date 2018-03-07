var test = require('tape')
var reducer = require('../../state-manager/reducer')
var {
  CONNECTION_STATE_DISCONNECTED,
  CONNECTION_STATE_CONNECTED,
  CONNECTION_STATE_CONNECTING,
  CONNECTION_STATE_DISCONNECTING
} = require('../../state-manager/connection-state-types')

var {
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
  hubAddressAdded,
  networkDidReconnect
} = require('../../state-manager/actions')

test('NETWORK_DID_RECONNECT', function (t) {
  const hub1 = {address: 'hub1.com'}
  const hub2 = {address: 'hub2.com'}
  const peer1 = {address: '@piet=.nope'}
  const peer2 = {address: '@mix=.nope'}
  const action = networkDidReconnect()
  const initialState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_DISCONNECTED
          },
          [peer2.address]: {
            connectionState: CONNECTION_STATE_DISCONNECTED
          }
        }
      },
      [hub2.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_DISCONNECTED
          }
        }
      }
    }
  }
  const expectedState = {
    hubs: {
      [hub1.address]: {
        peers: {
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const newState = reducer(initialState, action)
  t.deepEqual(newState, expectedState, 'all peers of all hubs are removed')
  t.end()
})

test('HUB_ADDRESS_ADDED', function (t) {
  const hub = {address: 'dfjdfksdfd.com'}
  const action = hubAddressAdded({ hub: hub.address })
  const initialState = {hubs: {}}
  const newState = reducer(initialState, action)
  t.deepEqual(newState.hubs[hub.address].peers, {}, 'sets peers to empty object')
  t.deepEqual(newState.hubs[hub.address].connection, null, 'sets connection to null')
  t.end()
})

test('REMOTE_PEER_DID_ANNOUNCE', function (t) {
  const hub1 = {address: 'hub1.com'}
  const hub2 = {address: 'hub2.com'}
  const peer1 = {address: '@piet=.nope'}
  const action = remotePeerDidAnnounce({peer: peer1.address, hub: hub1.address})
  const initialState = {
    hubs: {
      [hub1.address]: {
        peers: {
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const expectedState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_DISCONNECTED
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const newState = reducer(initialState, action)
  t.deepEqual(newState, expectedState, 'peers is added to correct hub')
  t.end()
})

test("REMOTE_PEER_DID_ANNOUNCE doesn't add peer if its our address", function (t) {
  const hub1 = {address: 'hub1.com'}
  const hub2 = {address: 'hub2.com'}
  const peer1 = {address: '@piet=.nope'}
  const action = remotePeerDidAnnounce({peer: peer1.address, hub: hub1.address})
  const initialState = {
    pubKey: peer1.address,
    hubs: {
      [hub1.address]: {
        peers: {
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const expectedState = {
    pubKey: peer1.address,
    hubs: {
      [hub1.address]: {
        peers: {
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const newState = reducer(initialState, action)
  t.deepEqual(newState, expectedState, 'peer is not added')
  t.end()
})

test('REMOTE_PEER_DID_ANNOUNCE if an existing peer re-announces, no change to the peer', function (t) {
  const hub1 = {address: 'hub1.com'}
  const hub2 = {address: 'hub2.com'}
  const peer1 = {address: '@piet=.nope'}
  const action = remotePeerDidAnnounce({peer: peer1.address, hub: hub1.address})
  const initialState = {
    pubKey: peer1.address,
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_CONNECTED
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const expectedState = {
    pubKey: peer1.address,
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_CONNECTED
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const newState = reducer(initialState, action)
  t.deepEqual(newState, expectedState, 'existing peer is not changed')
  t.end()
})

test('REMOTE_PEER_DID_DISCONNECT', function (t) {
  const hub1 = {address: 'hub1.com'}
  const hub2 = {address: 'hub2.com'}
  const peer1 = {address: '@piet=.nope'}
  const action = remotePeerDidDisconnect({peer: peer1.address, hub: hub1.address})
  const initialState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_CONNECTED
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const expectedState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_DISCONNECTED
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const newState = reducer(initialState, action)
  t.deepEqual(newState, expectedState, 'existing peer state changes to disconnected')
  t.end()
})

test('REMOTE_PEER_CONNECTING', function (t) {
  const hub1 = {address: 'hub1.com'}
  const hub2 = {address: 'hub2.com'}
  const peer1 = {address: '@piet=.nope'}
  const action = remotePeerConnecting({peer: peer1.address, hub: hub1.address})
  const initialState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_DISCONNECTED
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const expectedState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_CONNECTING
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const newState = reducer(initialState, action)
  t.deepEqual(newState, expectedState, 'existing peer state changes to connecting')
  t.end()
})

test('REMOTE_PEER_CONNECTION_SUCCEEDED', function (t) {
  const hub1 = {address: 'hub1.com'}
  const hub2 = {address: 'hub2.com'}
  const peer1 = {address: '@piet=.nope'}
  const action = remotePeerConnectionSucceeded({peer: peer1.address, hub: hub1.address})
  const initialState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_CONNECTING
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const expectedState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_CONNECTED
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const newState = reducer(initialState, action)
  t.deepEqual(newState, expectedState, 'existing peer state changes to connected')
  t.end()
})

test('REMOTE_PEER_CONNECTION_FAILED', function (t) {
  const hub1 = {address: 'hub1.com'}
  const hub2 = {address: 'hub2.com'}
  const peer1 = {address: '@piet=.nope'}
  const action = remotePeerConnectionFailed({peer: peer1.address, hub: hub1.address})
  const initialState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_CONNECTING
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const expectedState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_DISCONNECTED
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const newState = reducer(initialState, action)
  t.deepEqual(newState, expectedState, 'existing peer state changes to disconnected')
  t.end()
})

test('REMOTE_PEER_DISCONNECT', function (t) {
  const hub1 = {address: 'hub1.com'}
  const hub2 = {address: 'hub2.com'}
  const peer1 = {address: '@piet=.nope'}
  const action = remotePeerDisconnect({peer: peer1.address, hub: hub1.address})
  const initialState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_CONNECTED
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const expectedState = {
    hubs: {
      [hub1.address]: {
        peers: {
          [peer1.address]: {
            connectionState: CONNECTION_STATE_DISCONNECTING
          }
        }
      },
      [hub2.address]: {
        peers: {
        }
      }
    }
  }
  const newState = reducer(initialState, action)
  t.deepEqual(newState, expectedState, 'existing peer state changes to disconnecting')
  t.end()
})
