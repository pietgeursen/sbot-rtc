var signalhub = require('signalhub')
var server = require('signalhub/server')()

server.listen(9000, function() {
  console.log("server listening");
})

//Client wanting to connect rtc 
//client gets given the address of another client via an introducing pub eg:
//rtc://pub.butt.nz~shs:DTNmX+4SjsgZ7xyDh5xxmNtFqa6pWi5Qtw7cE8aR9TQ=
//
//client uses multiserver to connect using simple-peer.

//The pub needs to introduce the peers. I _think_ this is just a standard signalhub server.
//
//Jobs:
//- npm linked version of multiserver
//- set up 3 test bots with local turned off.
//- or we don't set up server and just use an existing multiserver as an easy first pass.
//- pass an sbot plugin that makes a call to gossip.add with the rtc multiserver address on one of the clients
//
//
//- rtc multiserver protocol is just for handling simple-peer conections. 
//- we might need two multiserver protocols, sp and ms (simple peer and rtc discovery)
