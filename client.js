var signalhub = require('signalhub')
var SimplePeer = require('simple-peer')
var wrtc = require('wrtc')
var cuid = require('cuid')
var once = require('once');

var hub = signalhub('my-app-name', [
  'localhost:9000'
])

var serverPeer = new SimplePeer({ initiator: true, wrtc })
serverPeer.uuid = cuid()
var clientPeer = new SimplePeer({wrtc})
clientPeer.uuid = cuid()

serverPeer.on('error', console.log )
clientPeer.on('error', console.log )

//serverPeer subscription to signalling data
hub.subscribe('signal')
  .on('data', function(data) {
    if(data.from !== serverPeer.uuid)
      serverPeer.signal(data.data)
  })

serverPeer.on('signal', function (data) { //this is kicked off immediately because it's the initiator
  // when serverPeer has signaling data, give it to clientPeer somehow
  var wrapped = Object.assign({}, {from: serverPeer.uuid}, {data})
  hub.subscribe(serverPeer.uuid)
    .once('data', function(data) {
       serverPeer.signal(data) 
    })
  hub.broadcast('signal', wrapped)// 1
})

serverPeer.on('connect', function () {
  // wait for 'connect' event before using the data channel
  console.log('connect');
  serverPeer.send('hey clientPeer, how is it going?') //4
})

//////////////////////////////////////////////////////////////////////////

//serverPeer subscription to signalling data
hub.subscribe('signal')
  .on('data', function(data) {
    if(data.from !== clientPeer.uuid)
      clientPeer.signal(data.data)
  })

clientPeer.on('signal', function (data) {
  var wrapped = Object.assign({}, {from: clientPeer.uuid}, {data})
  hub.subscribe(clientPeer.uuid)
    .once('data', function(data) {
       clientPeer.signal(data) 
    })
  hub.broadcast('signal', wrapped)// 1

})


clientPeer.on('data', function (data) {
  // got a data channel message
  console.log('got a message from serverPeer: ' + data)
})

