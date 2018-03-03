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

test('start and stop and inu app', function(t) {
  const app = {
    init: function () {
      return {
        model: {},
        effect: 'EFFECT'
      }
    },
    run: function (effect) {
      switch (effect) {
        case 'EFFECT':
          const p = Push()
          return Cat([p])
      }
    }
  }

  const {stop} = start(app)
  stop()
  t.ok(true)
  t.end()
})
test('app announces its peer id to hub', function (t) {
  const loadHubs = (_, cb) => {
    cb(null, [
      'https://signalhub-jccqtwhdwc.now.sh'
    ])
  }
  const expectedId = 'expectedId'
  const hub = createMockHub()

  //hub.subscribe('PEER_ANNOUNCE')
  //  .on('data', ({id}) => {
  //    t.equal(id, expectedId)
  //    hub.emitter.removeAllListeners()
  //  })

  const {views, actions, effects, stop} = start(App({Hub: () => hub, loadHubs, pubKey: expectedId}))
  pull(
    actions(),
    pull.drain(action => {
      console.log(action)
      stop()
      t.ok(action)
      t.end()
    })
  )

  // pull(
  //   effects(),
  //   pull.filter((effect) => effect.type === SCHEDULE_ANNOUNCE_TO_HUB),
  //   pull.take(1),
  //   pull.drain(_ => {
  //     t.ok(true)
  //     t.end()
  //     stop()
  //   })
  // )
})
