var signalhub = require('signalhub')
var server = require('signalhub/server')()

server.listen(9000, function() {
  console.log("server listening");

})
