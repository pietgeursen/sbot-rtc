var test = require('tape')
var {serverKeys, clientKeys} = require('./keys.json')
var ssbRef = require('ssb-ref')

var serverKey = serverKeys.id.match(ssbRef.feedIdRegex)[1]
var introducerAddress = 'signalhub-hzbibrznqa.now.sh'
var introducerPort = '80'
var serverRTCAddress = `rtc:${introducerAddress}:${introducerPort}~shs:${serverKey}`

// CreateTestSbot
//  .use(require('scuttlebot/plugins/gossip'))
//  .use({
//    init: (server) => {
//    },
//    name: 'rtc-server'
//  })
//
// var serverBot = CreateTestSbot({name: 'serverBot', keys: serverKeys})
//
//
// CreateTestSbot
//  .use({
//    init: (server) => {
//      console.log('server init');
//      server.gossip.add(serverRTCAddress, 'rtc')
//    },
//    name: 'rtc-client'
//  })
//
// var clientBot = CreateTestSbot({name: 'clientBot', keys: clientKeys})

test('connects and replicates', function (t) {
  var expected = {type: 'test', content: 'So. Cool.'}

  var CreateServer = require('scuttle-testbot')

  CreateServer
    .use(require('scuttlebot/plugins/replicate'))
    .use({
      init: (server) => {
        console.log('server init')
      },
      name: 'rtc-server'
    })

  var serverBot = CreateServer({name: 'serverBot', keys: serverKeys})
  console.log(CreateServer)
  serverBot.publish(expected, () => {})

  var CreateClient = require('scuttle-testbot')

  CreateClient
    .use(require('scuttlebot/plugins/replicate'))
    .use({
      init: (server) => {
        console.log('client init')
        server.connect(serverRTCAddress, (err, res) => {})
      },
      name: 'rtc-client'
    })

  var clientBot = CreateClient({name: 'clientBot', keys: clientKeys})

  clientBot.publish({
    type: 'contact',
    contact: serverKeys.id,
    following: true
  }, () => {})

  pull(
    clientBot.createHistoryStream({id: serverKeys.id, live: true}),
    pull.drain(data => {
      t.deep_equal(data, expected)
      t.end()
      clientBot.close()
      serverBot.close()
    })
  )

  clientBot.replicate.request(serverKeys.id)
})
// initatorBot.close()
