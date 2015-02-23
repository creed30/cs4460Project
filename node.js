// The main node server file!
var util = require('util'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    port = 9615;
var app = connect();
// We're serving up anything and everything, boys! Probably best to stop this in the future?
app.use(serveStatic(__dirname),{default: 'index.html'}).listen(port);



util.puts('Started server on port ' + port + '...');
