// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('DB/ATPDB.db');
// db.serialize(function() {
// db.run("SELECT COUNT(*) FROM ATPDATA");
// db.each("SELECT COUNT(*) as test FROM ATPDATA", function(err, row) { console.log(row.test) } );
// });
// db.close();
var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(index);
}).listen(9615);

var fs = require('fs');
var SQL = require('sql.js');
var filebuffer = fs.readFileSync('./DB/ATPDB.db');
var db = new SQL.Database(filebuffer);

// Load the db

function selectCount(column) {
	var contents = db.exec("SELECT COUNT("+ column +") FROM ATPDATA");
	var test = contents[0].values[0][0];
	return test;
}