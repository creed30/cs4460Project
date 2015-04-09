function section2() {
  d3.select("section2 > svg")
       .remove();
  var m = [80, 80, 80, 80];
  var w = width - m[1] - m[3];
  var h = (height - m[0] - m[2])/3;

  var margin = {top: 10, right: 100, bottom: 100, left: 100},
      width = window.innerWidth - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  // var parseDate = d3.time.format("%b %Y").parse;

  var x = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([0, height]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).orient("left");
  
  var context = d3.select("section2").append("g")
      .attr("class", "context")

var year = document.getElementById('selectYear').value;
var player = document.getElementById('selectPlayer').value;

  var dataset = []
  d3.csv("ATPDATA/ATP"+year+".csv", function(data) {
          var tournaments = [];
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

        // return ret;
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
        tournament = {
          start:ret[0],
          end:ret[0],
          name:ret[5],
          games:[game]
        }
        if(maxGames < tournament['games'].length)
          maxGames = tournament['games'].length
        tournaments.push(tournament)
       }
      
      // console.log(tournaments);
      // console.log(maxGames)

     });
     dataset = dataset.filter(function(n){ return n != undefined });
     dataset.sort(function(a,b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
      return a[0] - b[0];
      });

               node = context.selectAll("div")
              .data(tournaments)
              .enter()
              .append('div')
              .text(function(d){return d.name})

              .on("mouseover", function(d){
                  d3.select(".brush").call(brush.extent([new Date(d['start']),new Date(d['end'])]))
              })
              .append('svg')
              .attr('height',12)
              .attr('width',width)

              // .append('tournament')
              // .text(function(d){
              //   ret = d.name + "         ";
              //   return ret;
              // });

              game = node.selectAll("svg").data(function(d){return d['games']}).enter()
              .append('g')
              .attr("transform", function(d,i){ return "translate(" + i*82 + "," + 0 + ")"})
              // .append('rect')
              // .attr('height',12)
              // .attr('width',80)
              // .attr('x',function(d,i){return i*82})
              // .attr('style',function(d){
              //       return "fill:rgb(0,0,0)"
              //   })

              test = game.append('rect')
              .attr('height',12)
              .attr('width',80)
              // .attr('x',function(d,i){return i*82})
              .attr('style',function(d){
                    return "fill:rgb(0,0,0)"
                })


              roundsvg = game.selectAll('g').data(function(d,i){return d['rounds']}).enter().append('rect')
                .attr("height", 12)
                .attr("width", 12)
                .attr('x',function(d,i){return i*14})
                .attr('style',function(d){
                  if(d['victor'])
                    return "fill:rgb(0,255,0)"
                  else
                    return "fill:rgb(255,0,0)"
                })

              // game.selectAll('svg rect').data(function(d,i){return d['rounds']}).enter().append('text')
              // .attr('x',function(d,i){return i*14 + 3})
              // .attr('y',11)
              // .attr("font-family", "sans-serif")
              // .attr("font-size", "12px")
              // .attr("fill", "black")
              // .text(function(d){return d['wins']});




    //  console.log(dataset.filter(function(n){ return n != undefined }));
     // console.dir(tournaments);
   });


//
// // var focus = svg.append("g")
// //     .attr("class", "focus")
// //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var context = svg.append("g")
//     .attr("class", "context")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// d3.csv("", type, function(error, data) {
//   x.domain(d3.extent(test.map(function(d) { return d.date; })));
//   y.domain([1, d3.max(test.map(function(d) { return d.rank; }))]);
//   // x2.domain(x.domain());
//   // y2.domain(y.domain());
//
//   // focus.append("path")
//   //     .datum(test2)
//   //     // .attr("class", "area")
//   //     .attr("d", area);
//
//   // focus.append("g")
//   //     .attr("class", "x axis")
//   //     .attr("transform", "translate(0," + height + ")")
//   //     .call(xAxis);
//
//   // focus.append("g")
//   //     .attr("class", "y axis")
//   //     .call(yAxis);
//

// });


}

function parseDate(dat) {
  return Date(dat.substring(6,10),dat.substring(0,2)-1,dat.substring(3,5));
}
