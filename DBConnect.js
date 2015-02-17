try {
var shortName = 'DB/ATPDB.db';
var version = '3.0';
var displayName = 'Display Information';
var maxSize = 655360; // in bytes
db = openDatabase(shortName, version, displayName, maxSize);
}
catch(e) {
console.log(e);
}
