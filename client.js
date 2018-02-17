var signalhub = require('signalhub')
var SimplePeer = require('simple-peer')
var wrtc = require('wrtc')
var cuid = require('cuid')
var once = require('once');

var hub = signalhub('my-app-name', [
  'localhost:9000'
])

var peer1 = new SimplePeer({ initiator: true, wrtc })
peer1.uuid = cuid()
var peer2 = new SimplePeer({wrtc})
peer2.uuid = cuid()

peer1.on('error', console.log )
peer2.on('error', console.log )

//peer1 subscription to signalling data
hub.subscribe('signal')
  .on('data', function(data) {
    if(data.from !== peer1.uuid)
      peer1.signal(data.data)
  })

peer1.on('signal', function (data) { //this is kicked off immediately because it's the initiator
  // when peer1 has signaling data, give it to peer2 somehow
  var wrapped = Object.assign({}, {from: peer1.uuid}, {data})
  hub.subscribe(peer1.uuid)
    .once('data', function(data) {
       peer1.signal(data) 
    })
  hub.broadcast('signal', wrapped)// 1
})

peer1.on('connect', function () {
  // wait for 'connect' event before using the data channel
  console.log('connect');
  peer1.send('hey peer2, how is it going?') //4
})

//////////////////////////////////////////////////////////////////////////

//peer1 subscription to signalling data
hub.subscribe('signal')
  .on('data', function(data) {
    if(data.from !== peer2.uuid)
      peer2.signal(data.data)
  })

peer2.on('signal', function (data) {
  var wrapped = Object.assign({}, {from: peer2.uuid}, {data})
  hub.subscribe(peer2.uuid)
    .once('data', function(data) {
       peer2.signal(data) 
    })
  hub.broadcast('signal', wrapped)// 1

})


peer2.on('data', function (data) {
  // got a data channel message
  console.log('got a message from peer1: ' + data)
})

