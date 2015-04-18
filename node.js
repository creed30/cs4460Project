/**
 * Created by noel on 4/10/15.
 */
var express = require('express');
var app = express();
var fs = require('fs');
var SQL = require('sql.js');

app.use(express.static('./'));
app.get('/getStats', function getStats(req, res) {
    var player = req.query.player;
    var year = req.query.year;
    var stats = [];
    var HARD = "Hard",
        GRASS = "Grass",
        CLAY = "Clay";

    // Get win games
    var hardWin = getWinGames(player, year, HARD);
    var grassWin = getWinGames(player, year, GRASS);
    var clayWin = getWinGames(player, year, CLAY);

    // Get lose games
    var hardLose = getLoseGames(player, year, HARD);
    var grassLose = getLoseGames(player, year, GRASS);
    var clayLose = getLoseGames(player, year, CLAY);

    // Prepare returned JSON
    var tmp = [];
    tmp.push(grassWin, grassLose);
    stats.push(tmp);
    tmp = [];
    tmp.push(hardWin, hardLose);
    stats.push(tmp);
    tmp = [];
    tmp.push(clayWin, clayLose);
    stats.push(tmp);

    console.log(stats);
    res.json(stats);
});

function getTotalGames(player, year) {
    var filebuffer = fs.readFileSync('./DB/ATPDB.db');
    var db = new SQL.Database(filebuffer);
    // Query total games
    var query  = "SELECT count(*) as games ";
    query += "  FROM atpdata ";
    query += " WHERE (Winner = :player ";
    query += "        OR Loser = :plyaer) ";
    query += "   AND Date LIKE :year";

    // Bind query parameters
    var stmt = db.prepare(query);
    var result = stmt.getAsObject({
        ':player': player,
        ':year': '%/' + year
    });

    db.close();
    return result.games;
}

function getWinGames(player, year, surface) {
    var filebuffer = fs.readFileSync('./DB/ATPDB.db');
    var db = new SQL.Database(filebuffer);
    // Get number of win games
    var query  = "SELECT count(*) as games ";
    query += "  FROM atpdata ";
    query += " WHERE Winner = :player ";
    query += "   AND Surface = :surface ";
    query += "   AND Date LIKE :year";

    // Bind query parameters
    var stmt = db.prepare(query);
    var result = stmt.getAsObject({
        ':player': player,
        ':surface': surface,
        ':year': '%/' + year
    });
    db.close();
    return result.games;
}

function getLoseGames(player, year, surface) {
    var filebuffer = fs.readFileSync('./DB/ATPDB.db');
    var db = new SQL.Database(filebuffer);
    // Get number of win games
    var query  = "SELECT count(*) as games ";
    query += "  FROM atpdata ";
    query += " WHERE Loser = :player ";
    query += "   AND Surface = :surface ";
    query += "   AND Date LIKE :year";

    // Bind query parameters
    var stmt = db.prepare(query);
    var result = stmt.getAsObject({
        ':player': player,
        ':surface': surface,
        ':year': '%/' + year
    });
    db.close();
    return result.games;
}

// Start web server
var server = app.listen(9615, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
