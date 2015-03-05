var sql, xhr, db, uInt8Array;
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
  loadYear();
  selectPlayers();
};
xhr.send();

// function init() {
//   sql = window.SQL;
//   xhr = new XMLHttpRequest();
//   xhr.open('GET', '/DB/ATPDB.db', true);
//   xhr.responseType = 'arraybuffer';
//   db = {};
//   uInt8Array = {};
//   xhr.onload = function(e) {
//     uInt8Array = new Uint8Array(this.response);
//     db = new SQL.Database(uInt8Array);
//   };
//   xhr.send();
//   selectPlayers();
// }



function selectCount(column) {
	  var contents = db.exec("SELECT COUNT(*) FROM ATPDATA");
	  console.log(contents);
	  var test = contents[0].values[0][0];
	  	// Set the document text to the return value
		document.getElementById('demo').innerHTML = test;
}

function selectWRank(player,date) {
	  var contents = db.exec("SELECT DISTINCT Wrank,date FROM ATPDATA WHERE Winner='"+player+"' AND Date LIKE '%%%%%%"+date+"'");
	  console.log(contents);
	  var test = contents[0].values;
	  	// Set the document text to the return value
		document.getElementById('demoWRank').innerHTML = test;
}

function selectLRank(player) {
	  var contents = db.exec("SELECT Lrank FROM ATPDATA WHERE Loser='"+player+"'");
	  console.log(contents);
	  var test = contents[0].values;
	  	// Set the document text to the return value
		document.getElementById('demoLRank').innerHTML = test;
}

function selectWLRank(player) {
	  var contents = db.exec("SELECT Lrank FROM ATPDATA WHERE Loser='"+player+"' UNION ALL SELECT Wrank FROM ATPDATA WHERE Winner='"+player+"'");
	  console.log(contents);
	  var test = contents[0].values;
	  	// Set the document text to the return value
		document.getElementById('demoWLRank').innerHTML = test;
}

// function selectPlayers(year) {
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('GET', '/DB/ATPDB.db', true);
// 	xhr.responseType = 'arraybuffer';
// 	xhr.onload = function(e) {
// 	  var contents = db.exec("SELECT DISTINCT Loser FROM ATPDATA WHERE Date LIKE '%%%%%%"+year.value+"' UNION ALL SELECT DISTINCT Winner FROM ATPDATA WHERE Date LIKE '%%%%%%"+year.value+"'");
// 	  console.log(contents);
// 	  var test = contents[0].values;
// 	  	// Set the document text to the return value
// 		// alert(typeOf test);
//     document.getElementById('players').innerHTML = test;
//
// 	}
// 	xhr.send();
//   // fillPlayer();
// }
function selectPlayers() {
	  var contents = db.exec("SELECT Loser FROM ATPDATA UNION SELECT Winner FROM ATPDATA");
    var selectBox = document.getElementById('selectPlayer');
	  console.log(contents[0].values);
	  var players = contents[0].values.reverse();
    while(players.length > 0) {
      // create option element
      var option = document.createElement('option');
      // add value and text name
      var temp = players.pop();
      option.value = temp;
      option.innerHTML = temp;
      // add the option element to the selectbox
      selectBox.appendChild(option);
      // console.print("chees");
    }
      document.body.removeAttribute( "hidden");

	  	// Set the document text to the return value
		// alert(typeOf test);
    // document.getElementById('players').innerHTML = test;
}
