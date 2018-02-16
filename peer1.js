var signalhub = require('signalhub')
var SimplePeer = require('simple-peer')
var wrtc = require('wrtc')

var hub = signalhub('my-app-name', [
  'localhost:9000'
])

var peer1 = new SimplePeer({ initiator: true, wrtc })

peer1.on('error', console.log )

hub.subscribe('signal')
  .on('data', function(data) {
    console.log(2);
    peer1.signal(data)// 2
  })

peer1.on('signal', function (data) { //this is kicked off immediately because it's the initiator
  // when peer1 has signaling data, give it to peer2 somehow
  console.log(1, data);
  hub.broadcast('signal', data)// 1
})

peer1.on('connect', function () {
  // wait for 'connect' event before using the data channel
  console.log(4);
  peer1.send('hey peer2, how is it going?') //4
})

peer1.on('data', function (data) {
  // got a data channel message
  console.log(5);
  console.log('got a message from peer2: ' + data)
})

