var test = require('tape')
var CreateTestSbot = require('scuttle-testbot')
var {serverKeys, clientKeys} = require('./keys.json')
var ssbRef = require('ssb-ref')
var pull = require('pull-stream')
var ssbFriends = require('ssb-friends')

var serverKey = serverKeys.id.match(ssbRef.feedIdRegex)[1]
var introducerAddress = 'signalhub-hzbibrznqa.now.sh'
var introducerPort = '80'
var serverRTCAddress = `rtc:${introducerAddress}:${introducerPort}~shs:${serverKey}`

test('connects and replicates', function (t) {
  CreateTestSbot
    .use(require('scuttlebot/plugins/replicate'))
    .use({
      init: (server) => {
        console.log('server init')
        server.emit('RTC_HUB_ADDED', introducerAddress)
        server.connect(serverRTCAddress, (err, res) => {
        })
      },
      name: 'rtc-client'
    })

  var clientBot = CreateTestSbot({name: 'clientBot', keys: clientKeys})

  clientBot.publish({
    type: 'contact',
    contact: serverKeys.id,
    following: true
  }, () => {})

  pull(
    clientBot.createHistoryStream({id: serverKeys.id, live: true}),
    pull.drain(data => {
      t.ok(true)
      t.end()
      clientBot.close()
    })
  )

  clientBot.replicate.request(serverKeys.id)
})
