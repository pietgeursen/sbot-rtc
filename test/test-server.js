var test = require('tape')
var CreateTestSbot = require('scuttle-testbot')
var {serverKeys, clientKeys} = require('../keys.json')
var ssbRef = require('ssb-ref');

var clientKey = clientKeys.id.match(ssbRef.feedIdRegex)[1]
var introducerAddress = 'signalhub-hzbibrznqa.now.sh'
var introducerPort = '80'
var clientRTCAddress = `rtc:${introducerAddress}:${introducerPort}~shs:${clientKey}`

CreateTestSbot
  .use(require('scuttlebot/plugins/replicate'))
  .use({
    init: (server) => {
      console.log('server init');
    },
    name: 'rtc-server'
  })

var serverBot = CreateTestSbot({name: 'serverBot', keys: serverKeys})
serverBot.publish({type: 'derp', content: "dskjfd"}, ()=>{})

//serverBot.replicate.request(clientKeys.id)
//initatorBot.close()
