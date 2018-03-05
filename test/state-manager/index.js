const test = require('tape')
const Push = require('pull-pushable')
const Cat = require('pull-cat')
const EventEmitter = require('events')
const { App, SCHEDULE_ANNOUNCE_TO_HUB, KNOWN_HUBS_ADDED } = require('../../state-manager/')
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

  const store = App({hubAddresses: () => hubAddresses, Hub: () => mockHub})

  hubAddresses.push(hub)
  const state = store.getState()
  t.ok(state.hubs[hub.address])
  t.end()
})

test('peer announce adds peer to correct hub', function (t) {
  const hub = {address: 'dfjdfksdfd.com'}
  const hubAddresses = Push()
  const store = App({hubAddresses: () => hubAddresses})

  hubAddresses.push(hub)
  const state = store.getState()
  t.ok(state.hubs[hub.address])
  t.end()
})
