var brush;
var brushGraph;
// var x;
var svg;

function section3() {
  d3.select("section3 > svg")
       .remove();
  var m = [80, 80, 80, 80];
  var w = width - m[1] - m[3];
  var h = (height - m[0] - m[2])/3;

  var margin = {top: 10, right: 100, bottom: 100, left: 100},
      width = window.innerWidth - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  // var parseDate = d3.time.format("%b %Y").parse;

   x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([0, height]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).orient("left");

  brush = d3.svg.brush()
      .x(x)
      .on("brush", brushed);
  brushGraph = d3.svg.brush()
          .x(x)
          .on("brush", brushed);


var year = document.getElementById('selectYear').value;
var player = document.getElementById('selectPlayer').value;

// window.onresize = resize;



  var area2 = d3.svg.area()
      .interpolate("monotone")
      .x(function(d) { return x(d[0]); })
      .y0(height)
      .y1(function(d) { return y(d[2]); });

  svg = d3.select("section3").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

  var context = svg.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var dataset = []
  d3.csv("ATPDATA/ATP"+year+".csv", function(data) {
     dataset = data.map(function(d)
     {
       if (d["Winner"] == player)
       return [
         new Date(d["Date"].substring(6,10),d["Date"].substring(0,2)-1,d["Date"].substring(3,5)),
         d["Winner"],
         +d["WRank"]
         ];
      else if (d["Loser"] == player) {
        return [
          new Date(d["Date"].substring(6,10),d["Date"].substring(0,2)-1,d["Date"].substring(3,5)),
          d["Loser"],
          +d["LRank"]
          ];
      } else {
        return null;
      }
      // console.log(dataset);

     });
     dataset = dataset.filter(function(n){ return n != undefined });
     dataset.sort(function(a,b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
      return a[0] - b[0];
      });

    x.domain(d3.extent(dataset.map(function(d) { return d[0]; })));
    y.domain([1, d3.max(dataset.map(function(d) { return d[2]; }))]);
           context.append("g")
         		  .attr("class", "y axis")
         		  .call(yAxis);

           context.append("path")
               .datum(dataset)
               .attr("class", "area")
               .attr("d", area2);

           context.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height + ")")
               .call(xAxis);

           context.append("g")
               .attr("class", "x brush")
               .call(brush)
             .selectAll("rect")
               .attr("y", -6)
               .attr("height", height + 7);
    //  console.log(dataset.filter(function(n){ return n != undefined }));
     console.log(dataset);
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
function brushed() {
  // svg.selectAll("rect");
  var e = brush.extent();
  svg.selectAll("rect").classed("hidden", function(d) {
    console.log(e[0]);
    console.log(e[1]);
      // return e[0] > d[p.x] || d[p.x] > e[1]
      //     || e[0] > d[p.y] || d[p.y] > e[1];
    });
  // console.log(e);
  // x.domain(brush.empty() ? x.domain() : brush.extent());
  // focus.select(".area").attr("d", area);
  // console.log(area);
  // focus.select(".x.axis").call(xAxis);
}
function parseDate(dat) {
  return Date(dat.substring(6,10),dat.substring(0,2)-1,dat.substring(3,5));
}
