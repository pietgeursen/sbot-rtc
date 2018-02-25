var ssbKeys = require('ssb-keys')
var fs = require('fs')

var serverKeys = ssbKeys.generate()
var clientKeys = ssbKeys.generate()

var keys = {serverKeys, clientKeys}

fs.writeFileSync('keys.json', JSON.stringify(keys))


