var test = require('tape')
var {start} = require('inu')
var App = require('../../state-manager/')
var pull = require('pull-stream')

test('', function(t) {
  const {actions, effects} = start(App({Hub: ()=> {}}))

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

