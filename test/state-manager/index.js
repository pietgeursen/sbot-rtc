const test = require('tape')
const Push = require('pull-pushable')
const EventEmitter = require('events')
const App = require('../../state-manager/')
const { Actions } = require('../../state-manager/actions')
const { remotePeerDidAnnounce } = Actions({})
const pull = require('pull-stream')
const Hub = require('signalhub')

function createMockHub () {
  const emitter = new EventEmitter()
  return {
    subscribe: function (channel) {
      return {
        on: function (_, callback) {
          emitter.on(channel, callback)
        }
      }
    },
    broadcast: (channel, data) => {
      emitter.emit(channel, data)
    },
    emitter
  }
}

test('emitting hub address on stream adds that hub to the state', function (t) {
  const hub = {address: 'dfjdfksdfd.com'}
  const hubAddresses = Push()
  const mockHub = createMockHub()

  const { store } = App({hubAddresses: () => hubAddresses, Hub: () => mockHub})

  hubAddresses.push(hub)
  const state = store.getState()
  t.ok(state.hubs[hub.address])
  t.end()
})

test('peer announce adds peer to correct hub', function (t) {
  const hub = {address: 'dfjdfksdfd.com'}
  const peer = {address: '@piet=.nope'}
  const hubAddresses = Push()
  const mockHub = createMockHub()
  const { store } = App({hubAddresses: () => hubAddresses, Hub: () => mockHub})

  hubAddresses.push(hub)
  store.dispatch(remotePeerDidAnnounce({hub: hub.address, peer: peer.address}))

  const state = store.getState()
  t.ok(state.hubs[hub.address].peers[peer.address])
  t.end()
})
