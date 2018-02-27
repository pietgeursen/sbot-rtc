const test = require('tape')
const {start} = require('inu')
const App = require('../../state-manager/')
const pull = require('pull-stream')

test('hullo', function (t) {
  const loadHubs = (_, cb) => {
    cb(null, [
      'https://signalhub-jccqtwhdwc.now.sh'
    ])
  }
  const {actions, effects, models} = start(App({loadHubs}))

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
