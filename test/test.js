var test = require('tape')
var {serverKeys, clientKeys} = require('./keys.json')
var ssbRef = require('ssb-ref')
var CreateTestSbot = require('scuttle-testbot')
var pull = require('pull-stream')

var App = require('../state-manager/')
var serverKey = serverKeys.id.match(ssbRef.feedIdRegex)[1]
var introducerAddress = 'signalhub-hzbibrznqa.now.sh'
var introducerPort = '80'
var serverRTCAddress = `rtc:${introducerAddress}:${introducerPort}~shs:${serverKey}`

CreateTestSbot
  .use(require('scuttlebot/plugins/replicate'))
  .use({
    init: (server) => {
      App({server, hubAddresses: () => pull.once({address: introducerAddress})})
    },
    name: 'rtc-server'
  })

var serverBot = CreateTestSbot({name: 'serverBot', keys: serverKeys})

CreateTestSbot
  .use(require('scuttlebot/plugins/replicate'))
  .use({
    init: (server) => {
      server.emit('RTC_HUB_ADDED', introducerAddress)
      server.connect(serverRTCAddress, (err, res) => {
      })
    },
    name: 'rtc-client'
  })

var clientBot = CreateTestSbot({name: 'clientBot', keys: clientKeys})

test('connects and replicates', function (t) {
  var expected = {type: 'test', content: 'So. Cool.'}

  serverBot.publish(expected, () => {})

  clientBot.publish({
    type: 'contact',
    contact: serverKeys.id,
    following: true
  }, () => {})

  pull(
    clientBot.createHistoryStream({id: serverKeys.id, live: true}),
    pull.drain(data => {
      t.deepEqual(data.value.content, expected)
      t.end()
      clientBot.close()
      serverBot.close()
    })
  )

  clientBot.replicate.request(serverKeys.id)
})
