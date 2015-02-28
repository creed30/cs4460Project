var sql = window.SQL;

// Initialize the db
var xhr = new XMLHttpRequest();
xhr.open('GET', '/DB/ATPDB.db', true);
xhr.responseType = 'arraybuffer';
var db = {};
var uInt8Array = {};

xhr.onload = function(e) {
  uInt8Array = new Uint8Array(this.response);
  db = new SQL.Database(uInt8Array);
};
xhr.send();




function selectCount(column) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/DB/ATPDB.db', true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function(e) {
	  var contents = db.exec("SELECT COUNT(*) FROM ATPDATA");
	  console.log(contents);
	  var test = contents[0].values[0][0];
	  	// Set the document text to the return value
		document.getElementById('demo').innerHTML = test;
	}
	xhr.send();
}

function selectWRank(player,date) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/DB/ATPDB.db', true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function(e) {
	  var contents = db.exec("SELECT DISTINCT Wrank,date FROM ATPDATA WHERE Winner='"+player+"' AND Date LIKE '%%%%%%"+date+"'");
	  console.log(contents);
	  var test = contents[0].values;
	  	// Set the document text to the return value
		document.getElementById('demoWRank').innerHTML = test;
	}
	xhr.send();
}

function selectLRank(player) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/DB/ATPDB.db', true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function(e) {
	  var contents = db.exec("SELECT Lrank FROM ATPDATA WHERE Loser='"+player+"'");
	  console.log(contents);
	  var test = contents[0].values;
	  	// Set the document text to the return value
		document.getElementById('demoLRank').innerHTML = test;
	}
	xhr.send();
}

function selectWLRank(player) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/DB/ATPDB.db', true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function(e) {
	  var contents = db.exec("SELECT Lrank FROM ATPDATA WHERE Loser='"+player+"' UNION ALL SELECT Wrank FROM ATPDATA WHERE Winner='"+player+"'");
	  console.log(contents);
	  var test = contents[0].values;
	  	// Set the document text to the return value
		document.getElementById('demoWLRank').innerHTML = test;
	}
	xhr.send();
}
