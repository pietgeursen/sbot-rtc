const test = require('tape')
const {start} = require('inu')
const App = require('../../state-manager/')
const pull = require('pull-stream')
const Hub = require('signalhub')

test('hullo', function (t) {
  const loadHubs = (_, cb) => {
    cb(null, [
      'https://signalhub-jccqtwhdwc.now.sh'
    ])
  }
  const hub = Hub('sbot-rtc-gossip', 'https://signalhub-jccqtwhdwc.now.sh')
  const {actions, effects, models} = start(App({loadHubs, pubKey: 'sdkjfkj39r9u=.nope'}))

  setTimeout(() => {
    hub.broadcast('PEER_ANNOUNCE', {id: 'piet'})
  }, 3000)

  pull(
    models(),
    pull.log()
  )
  pull(
    actions(),
    pull.log()
  )

  pull(
    effects(),
    pull.log()
  )
  t.end()
})
