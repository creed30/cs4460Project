//graph/context adapted from http://bl.ocks.org/mbostock/1667367 - 50% of source used. heavily adapted
//transition adapted from http://jsfiddle.net/realnumber/3h4SW/2/ - 70% of source used. heavily adapted

var brush;
var brushGraph;
var x,y,xAxis,yAxis,year,player,area,path,totalLength;
var svg;
var margin = {top: 10, right: 100, bottom: 100, left: 100},
    width = window.innerWidth - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

function section3() {
  //remove old section 3 graph
  d3.select("section3 > svg")
    .remove();

  //create scales
  x = d3.time.scale().range([0, width]);
  y = d3.scale.linear().range([0, height]);

  //orienting the axes
  xAxis = d3.svg.axis().scale(x).orient("bottom");
  yAxis = d3.svg.axis().scale(y).orient("left");

  //creating the area variable that defines the path of
  //the line for the graph
  area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(addDays(d[0],-1)); })
    .y(function(d) { return y(d[2]); });

  svg = d3.select("section3").append("svg")
    .attr("width", width + margin.left + margin.right - 40)
    .attr("height", height + margin.top + margin.bottom -70);

  //Add the top border to separate section 3 from section 2
  svg.append("svg:line")
    .attr("x1", margin.left)
    .attr("y1", 0)
    .attr("x2", width + margin.right )
    .attr("y2", 0)
    .style("stroke", "rgb(6,120,155)");

  //appending the path to the graph
  // svg.append("defs").append("clipPath")
  //   .attr("id", "clip")
  //   .append("rect")
  //   .attr("width", width)
  //   .attr("height", height);
  //appending the graph to the svg element
  context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //setting default values for the graph
  x.domain([new Date("January 1, 2014 11:13:00"),new Date("December 1, 2014 11:13:00")]),
  y.domain([1, 250]);
  //appending y axis to empty graph
  context.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  //appending x axis to empty graph
  context.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  //appending empty path to empty graph
  path = context.append("path")
    .style('fill', 'none')
    .style('stroke', 'steelblue')
    .attr("stroke-width", "2");

  //defining the brush for the graph
  brush = d3.svg.brush()
    .x(x)
    .on("brush", brushed);
  brushGraph = d3.svg.brush()
    .x(x)
    .on("brush", brushed);

  //get selected values for player and year
  year = document.getElementById('selectYear').value;
  player = document.getElementById('selectPlayer').value;

  //set up data to be parsed
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
      }
      else
      {
        return null;
      }
    });
    dataset = dataset.filter(function(n){ return n != undefined });
    dataset.sort(function(a,b)
    {
      return a[0] - b[0];
    });
    //defining the ranges of the x and y domains
    x.domain([d3.min(dataset.map(function(d) { return addDays(d[0],-1); })),d3.max(dataset.map(function(d) { return addDays(d[0],2); }))])
    y.domain([1, d3.max(dataset.map(function(d) { return d[2]; }))]);

    //appending the x and y axis
    context.select(".x.axis")
    .call(xAxis)
    // add rank label to Y axis
    .append("text")
    .attr("x",30)
    .attr("y",-30)
    .text("Rank")
    .style("font-size","9px")
    .attr("transform", function(d) {
      return "rotate(-90)"
    });
    context.select(".y.axis")
    .call(yAxis);

    //calling the path with the data
    path
      .datum(dataset)
      .attr("d", area)
      .style('fill', 'none')
      .style('stroke', 'steelblue')
      .attr("stroke-width", "2");

    //appending brush element
    context.append("g")
      .attr("class", "x brush")
      .call(brush)
      .selectAll("rect")
      .attr("y", -6)
      .attr("height", height + 7);

    totalLength = path.node().getTotalLength();

    //add transition to path
    path
      .attr("stroke-dasharray", totalLength+","+totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease("linear-in-out")
      .attr("stroke-dashoffset", 0);
    });
}

//helper function to select range on section 3 graph
function brushed() {
  var e = brush.extent();
    section2context.selectAll('.section2brushrect').remove();
  svg.selectAll("rect").classed("hidden", function(d) {
    section2Brush(e[0],e[1])
  });
}

//helper function to add brushing to section 2
function section2Brush(startDate,endDate){
  section2context.selectAll('.section2context')
    .data(tournaments)
    .enter()
    .insert("rect",":first-child")
    .attr("class", "section2brushrect")
    .attr('height',15)
    .attr("y",(function(d,i) {return i* 20 + 20;}))
    .attr('width',width)
    .attr('x',margin.left)
    .attr('style',function(d){
      if(d.start.getTime() > startDate.getTime() && d.start.getTime() < endDate.getTime() ){
        return "fill:rgb(221,221,221)"
      }
      else if(d.end > startDate.getTime() && d.end < endDate.getTime() )
      {
        return "fill:rgb(221,221,221)"
      }
      else
        this.remove();
  })
}

//helper function for adding days to a date object
function addDays(dateObj, numDays) {
  return dateObj.setDate(dateObj.getDate() + numDays);
}
