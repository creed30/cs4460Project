var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('DB/ATPDB.db'); 
db.serialize(function() {
db.run("SELECT COUNT(*) FROM ATPDATA");
db.each("SELECT COUNT(*) as test FROM ATPDATA", function(err, row) { console.log(row.test) } );
});
db.close();
