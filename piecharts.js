/* 
 * Original code from https://gist.github.com/enjalot/1203641
 * Edited by: Noel Vo
 */
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
  loadYears();
  loadPlayers();
};
xhr.send();

function loadYears() {
  var selectBox = document.getElementById('years');
  for (var i = 2014; i >= 2000; i--) {
    var option = document.createElement('option');
    option.value = i;
    option.innerHTML = i;
    selectBox.appendChild(option);
  }
}

function loadPlayers() {
  var query = "SELECT Loser FROM ATPDATA UNION SELECT Winner FROM ATPDATA";
  var contents = db.exec(query);
  var selectBox = document.getElementById('players');
  var players = contents[0].values.reverse();
  while(players.length > 100) {
    var option = document.createElement('option');
    var temp = players.pop();
    option.value = temp;
    option.innerHTML = temp;
    selectBox.appendChild(option);
  }
}

// Global values of selected year and player
var selectedYear, selectedPlayer;

// Set selectedYear variable when users select a year
function setYear() {
  var element = document.getElementById('years');
  selectedYear = element.options[element.selectedIndex].text;
}

// Set selectedPlayer variable when users select a player
function setPlayer() {
  var element = document.getElementById('players');
  selectedPlayer = element.options[element.selectedIndex].text;
}

/*
 * Compute the statistic of a player
 * @return: object with this format
 *          {
 *            totalGames: 123,
 *            win: 123,
 *            lose: 123,
 *            winPercentage: 123.12,
 *            losePercentage: 123.12
 *          }
 */
function getPlayerStats(player, year, surface) {
  var stats = {};
  
  // Query total games
  var query  = "SELECT count(*) as totalGames ";
      query += "  FROM atpdata ";
      query += " WHERE (Winner = :winner ";
      query += "        OR Loser = :loser) ";
      query += "   AND Surface = :surface ";
  
  // Bind query parameters
  var stmt = db.prepare(query);
  var result = stmt.getAsObject({
                  ':winner' : player,
                  ':loser' : player,
                  ':surface' : surface
              });
  
  stats['totalGames'] = result['totalGames'];
  
  // Query win games
  query  = "SELECT count(*) as win ";
  query += "  FROM atpdata ";
  query += " WHERE Winner = :winner ";
  query += "   AND Surface = :surface ";
  
  stmt = db.prepare(query);
  result = stmt.getAsObject({
              ':winner' : player,
              ':surface' : surface
            });
  
  stats['win'] = result['win'];
  
  // Query lost games
  query  = "SELECT count(*) as lose ";
  query += "  FROM atpdata ";
  query += " WHERE Loser = :loser ";
  query += "   AND Surface = :surface ";
  
  stmt = db.prepare(query);
  result = stmt.getAsObject({
              ':loser' : player,
              ':surface' : surface
            });
  
  stats['lose'] = result['lose'];
  
  // Prepare returned object
  stats['winPercentage'] = parseFloat((stats['win'] / stats['totalGames'] * 100).toFixed(2));
  stats['losePercentage'] = parseFloat((100 - stats['winPercentage']).toFixed(2));
  stats['surface'] = surface;
  stats['player'] = player;
  stats['year'] = year;

  return stats;
}

function displayPieChart(stats) {
  var w = 200, h = 300, r = 100;
  var color = d3.scale.category10();
  var data = [{"label": stats['winPercentage'] + "%", "value": stats['winPercentage']}, 
              {"label": stats['losePercentage'] + "%", "value": stats['losePercentage']}];

  var vis = d3.select("#hard")
              .append("svg:svg")
              .data([data])
              .attr("width", w)
              .attr("height", h)
              .append("svg:g")
              .attr("transform", "translate(" + r + "," + r + ")");

  var arc = d3.svg.arc()
              .outerRadius(r);

  var pie = d3.layout.pie().value(function (d) { return d.value; });
  var arcs = vis.selectAll("g.slice")
              .data(pie)
              .enter()
              .append("svg:g")
              .attr("class", "slice");

  arcs.append("svg:path")
      .attr("fill", function (d, i) { 
        return color(i);
      })
      .attr("d", arc);

  arcs.append("svg:text")
      .attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")
      .text(function (d, i) { return data[i].label; });
}

function showCharts() {
  var hardSurfaceStats = getPlayerStats(selectedPlayer, selectedYear, 'Hard');
  var claySurfaceStats = getPlayerStats(selectedPlayer, selectedYear, 'Clay');
  var grassSurfaceStats = getPlayerStats(selectedPlayer, selectedYear, 'Grass');
  displayPieChart(hardSurfaceStats);
  displayPieChart(claySurfaceStats);
  displayPieChart(grassSurfaceStats);
}