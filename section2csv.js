// Setup the array of arrays to be used for section 1.
// This is an artifact from us starting using a DB, and later switching to CSVs
var section1data = [];
section1data[0] = []
section1data[1] = []
section1data[2] = []


// Setup global variables for section 2. Used in brushing and setting up the odd section 2 vis

// Tournaments is a data structure that contains a selection of tournaments
// Each tournament contains a couple games
// Each game contains a couple of rounds
var tournaments = [];


var section2context = {};

// Initialize section 2
function section2init(){
  var margin = {top: 10, right: 100, bottom: 100, left: 100},
      width = window.innerWidth - margin.left - margin.right,
      height = 75 ;

  // var parseDate = d3.time.format("%b %Y").parse;

  var x = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([0, height]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).orient("left");
  var svg = d3.select("section2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height );


  }

// Update section 2
function section2() {
// Wipe the section 1 data and tournaments
section1data[0][0] = 0;
section1data[0][1] = 0;
section1data[1][0] = 0;
section1data[1][1] = 0;
section1data[2][0] = 0;
section1data[2][1] = 0;
  tournaments = [];
  // Clear the currently existing section 2 stuff
  d3.select("section2 > svg")
       .remove();

  // svg setup
  var m = [80, 80, 80, 80];
  var w = width - m[1] - m[3];
  var h = (height - m[0] - m[2])/3;

  var margin = {top: 10, right: 100, bottom: 100, left: 100},
      width = window.innerWidth - margin.left - margin.right,
      height = window.innerHeight/2 - margin.top - margin.bottom;


  var x = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([0, height]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).orient("left");
  var svg = d3.select("section2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var context = svg.append("g")
      .attr("class", "section2context")
      
      section2context = context

      // For loading the csvs
  var year = document.getElementById('selectYear').value;
  var player = document.getElementById('selectPlayer').value;


  // Load the data related to this player and sort it into the tournaments data structure
  // This logic loop also handles the section 1 data structure
  var dataset = []
  d3.csv("ATPDATA/ATP"+year+".csv", function(data) {

          var maxGames = 0;
     dataset = data.map(function(d)
     {
       if (d["Winner"] == player){
       var ret = [
         new Date(d["Date"].substring(6,10),d["Date"].substring(0,2)-1,d["Date"].substring(3,5)),
         d["Winner"],
         +d["WRank"],
         "Winner",
         [],
          d['Tournament'],
         d
         ];

        var length = parseInt(d['Lsets']) + parseInt(d['Wsets']);
        for(i = 1;i<=5;i++){
          if(d['L' + i.toString()] != ""){
            var loserScore = parseInt(d['L'+ i.toString() ])
            var winnerScore = parseInt(d['W'+ i.toString() ])
            var length = loserScore + winnerScore;
            var won = false;
            if(winnerScore > loserScore){
              won = true;
            }
            var round = {length:length,victor:won,wins:winnerScore}
            ret[4].push(round);
          }
        }
        // return ret;
      }
      else if (d["Loser"] == player) {
       var ret = [
         new Date(d["Date"].substring(6,10),d["Date"].substring(0,2)-1,d["Date"].substring(3,5)),
         d["Loser"],
         +d["LRank"],
         "Loser",
         [],
         d['Tournament'],
         d
         ];

        var length = parseInt(d['Lsets']) + parseInt(d['Wsets']);
        for(i = 1;i<=5;i++){
          if(d['L' + i.toString()] != ""){
            var loserScore = parseInt(d['L'+ i.toString() ])
            var winnerScore = parseInt(d['W'+ i.toString() ])
            var length = loserScore + winnerScore;
            var won = true;
            if(winnerScore > loserScore){
              won = false;
            }

            var round = {length:length,victor:won,wins:loserScore}
            ret[4].push(round);
          }
        }



      } else {
        return null;
      }

        exists = false;
        tournaments.forEach(function(tournament){
          if(tournament['name'] == ret[5]){

            exists = true;
            game = {
             rounds:ret[4],
             status:ret[3],
             rank:ret[2],
             date:ret[0]
            }
            incrementSurfaceCount(ret[3],d['Surface'])

            tournament['games'].push(game)
            tournament['end'] = ret[0]
           if(maxGames < tournament['games'].length)
              maxGames = tournament['games'].length
          }
        }
        )
        if(!exists){
        game = {
          rounds:ret[4],
          status:ret[3],
          rank:ret[2]
        }

          incrementSurfaceCount(ret[3],d['Surface'])

        tournament = {
          start:new Date(ret[0]),
          // end:addDays(ret[0],1),
          end:new Date(ret[0]),
          name:ret[5],
          games:[game],
          surface:d['Surface']
        }

        tournament['end'] = addDays(tournament['end'],-1);
        if(maxGames < tournament['games'].length)
          maxGames = tournament['games'].length
        tournaments.push(tournament)
       }
       height = (tournaments.length * 20) + 30
       d3.select("section2 > svg")
      .attr("height", height );


     });

      // This kicks off section1
      showCharts(section1data);

      // This is used later for the up/down arrows displaying how a tournament changed the rank
      tournaments.forEach(function(tournament,index){
        if(tournaments[index+1] != undefined){

            tournaments[index]['rankup'] = tournaments[index+1]['games'][0]['rank'] - tournaments[index]['games'][0]['rank']

        }
      })
     dataset = dataset.filter(function(n){ return n != undefined });
     dataset.sort(function(a,b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
      return a[0] - b[0];
      });
        //Tournament Title
        //top border
        svg.append("svg:line")
              .attr("x1", margin.left)
              .attr("y1", 0)
              .attr("x2", width + margin.right )
              .attr("y2", 0)
              .style("stroke", "rgb(6,120,155)");
        //Tournament Border
        svg.append("svg:line")
              .attr("x1", 295)
              .attr("y1", 10)
              .attr("x2", 295 )
              .attr("y2", height-10)
              .style("stroke", "rgb(6,120,155)");
        // Tournament title
        context.append("text")
        .attr("x",margin.left + 10)
        .attr("y",(function(d,i) {return i* 20 + 15;}))
        .text("Tournament")
        .style("font-size","12px");
        // Rounds title
        for(var inc = 0; inc <7;inc++){
          context.append("text")
          .attr("x",margin.left + 220 + 82 * inc)
          .attr("y",15)
          .text("Round " + (inc+1))
          .style("font-size","12px");
        }

              // Setup tourney names
              tournamentnames = context.selectAll("g")
              .data(tournaments)
              .enter()
              .append("text")
              .attr("x",margin.left)
              .attr("y",(function(d,i) {return i* 20 + 30;}))
              .on("mouseover", section2mouseover)
              // .attr("x",(function(d,i) {return i*30;}))
              .text(function(d){return d.name})

              // Setup arrows
              arrows = context.selectAll("g")
              .data(tournaments)
              .enter()
              .append('path')
        .attr('d', d3.svg.symbol().type(function(d){if(d['rankup'] >= 1){return 'triangle-down'} else if (d['rankup'] <= -1){ return 'triangle-up'} else return 'square'}).size(30))
        .attr('stroke','#000')
        .attr('stroke-width',1)
        .attr('fill',function(d){if(d['rankup'] >= 1){return 'red'} else if (d['rankup'] <= -1){ return 'green'} else return 'blue'})
        .attr('transform',function(d,i){ return "translate("+(margin.left - 10)+","+( i* 20 + 28)+")"; })
              .on("mouseover", section2mouseover)
              .append("svg:title")
              .text(function(d){return "Rank changed by: " + d['rankup']});

              // Setup the main group for each row
               node = context.selectAll("g")
              .data(tournaments)
              .enter()
              .append('g')
              .on("mouseover", section2mouseover)
              .append('svg')
              .attr("x",200 + margin.right)
              .attr("y",(function(d,i) {return i* 20+22;}))

              // Setup the game group
              game = node.selectAll("svg").data(function(d){return d['games']}).enter()
              .append('g')
              .attr("transform", function(d,i){ return "translate(" + i*82 + "," + 0 + ")"})

              // Setup the game rectangle
              test = game.append('rect')
              .attr('height',12)
              .attr('width',80)
              .attr('style',function(d){
                    return "fill:rgb(0,0,0)"
                })

              // Setup the round rectangles
              roundsvg = game.selectAll('g').data(function(d,i){return d['rounds']}).enter().append('rect')
                .attr("height", 12)
                .attr("width", function(d){if(d['length'] > 12) return 12; else return d['length']})
                .attr('x',function(d,i){return i*14})
                .attr('style',function(d){
                  if(d['victor'])
                    return "fill:rgb(0,255,0)"
                  else
                    return "fill:rgb(255,0,0)"
                })

   });



}

function addDays(dateObj, numDays) {
  return dateObj.setDate(dateObj.getDate() + numDays);
}

function parseDate(dat) {
  return Date(dat.substring(6,10),dat.substring(0,2)-1,dat.substring(3,5));
}


// Used for data management of the section 1 data structure
function incrementSurfaceCount(won,surface){
  switch(surface){
    case 'Grass':
      if(won == 'Winner')
        section1data[0][0]++;
      else
        section1data[0][1]++;

      break;
    case 'Hard':
        if(won == 'Winner')
        section1data[1][0]++;
      else
        section1data[1][1]++;
      break;
    case 'Clay':
        if(won == 'Winner')
        section1data[2][0]++;
      else
        section1data[2][1]++;
      break;
    default:
      console.log("Something broke!!!")
      break;
  }
}


// Used whenever we mouse over an object in section 2
function section2mouseover(d,i){
  var recty = i*20 + 22
                    section2context.selectAll('.section2brushrect').remove();
                    section2context
                    .insert("rect",":first-child")
                    .attr("class", "section2brushrect")
                    .attr('height',15)
                    .attr("y",(function() {return recty;}))
                    .attr('width',width)
                    .attr('x',margin.left)
                    .attr('style',function(){
                     return "fill:rgb(221,221,221)"
                    })

                  d3.select(".brush").call(brush.extent([d['start'],d['end']]))
}


