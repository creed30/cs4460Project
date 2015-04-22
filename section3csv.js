var brush;
var brushGraph;
var x,y,xAxis,yAxis,year,player,area,path,totalLength;
var svg;
var margin = {top: 10, right: 100, bottom: 100, left: 100},
    width = window.innerWidth - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

function section3PlaceHolder() {
  // x = d3.time.scale().range([0, width]);
  // y = d3.scale.linear().range([0, height]);
  //
  // xAxis = d3.svg.axis().scale(x).orient("bottom");
  // yAxis = d3.svg.axis().scale(y).orient("left");
  //
  // area = d3.svg.area()
  //     .interpolate("monotone")
  //     .x(function(d) { return x(addDays(d[0],-1)); })
  //     // .y0(height)
  //     .y(function(d) { return y(d[2]); });
  //
  // svg = d3.select("section3").append("svg")
  // // .attr("style", "outline: thin solid red;")   //This will do the job
  //     .attr("width", width + margin.left + margin.right - 40)
  //     .attr("height", height + margin.top + margin.bottom -70);
  // svg.append("svg:line")
  //       .attr("x1", margin.left)
  //       .attr("y1", 0)
  //       .attr("x2", width + margin.right )
  //       .attr("y2", 0)
  //       .style("stroke", "rgb(6,120,155)");
  // svg.append("defs").append("clipPath")
  //     .attr("id", "clip")
  //     .append("rect")
  //     .attr("width", width)
  //     .attr("height", height);
  //
  // context = svg.append("g")
  //     .attr("class", "context")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //
  // x.domain([new Date("January 1, 2014 11:13:00"),new Date("December 1, 2014 11:13:00")]),
  // y.domain([1, 250]);
  // context.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis);
  //
  // context.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis);
  //
  // path = context.append("path")
  //     //  .datum(dataset)
  //     //  .attr("d", area)
  //      .style('fill', 'none')
  //      .style('stroke', 'steelblue')
  //      .attr("stroke-width", "2");
}
function section3() {
  d3.select("section3 > svg")
       .remove();
//create scales
x = d3.time.scale().range([0, width]);
y = d3.scale.linear().range([0, height]);

xAxis = d3.svg.axis().scale(x).orient("bottom");
yAxis = d3.svg.axis().scale(y).orient("left");

area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(addDays(d[0],-1)); })
    // .y0(height)
    .y(function(d) { return y(d[2]); });

svg = d3.select("section3").append("svg")
// .attr("style", "outline: thin solid red;")   //This will do the job
    .attr("width", width + margin.left + margin.right - 40)
    .attr("height", height + margin.top + margin.bottom -70);
svg.append("svg:line")
      .attr("x1", margin.left)
      .attr("y1", 0)
      .attr("x2", width + margin.right )
      .attr("y2", 0)
      .style("stroke", "rgb(6,120,155)");
svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain([new Date("January 1, 2014 11:13:00"),new Date("December 1, 2014 11:13:00")]),
y.domain([1, 250]);
context.append("g")
    .attr("class", "y axis")
    .call(yAxis);

context.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

path = context.append("path")
    //  .datum(dataset)
    //  .attr("d", area)
     .style('fill', 'none')
     .style('stroke', 'steelblue')
     .attr("stroke-width", "2");



  brush = d3.svg.brush()
      .x(x)
      .on("brush", brushed);
  brushGraph = d3.svg.brush()
          .x(x)
          .on("brush", brushed);


  year = document.getElementById('selectYear').value;
  player = document.getElementById('selectPlayer').value;

// window.onresize = resize;

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

      // area = d3.svg.area()
      //     .interpolate("monotone")
      //     .x(function(d) { return x(addDays(d[0],-1)); })
      //     .y0(height)
      //     .y1(function(d) { return y(d[2]); });
      //
      // svg = d3.select("section3").append("svg")
      //     .attr("width", width + margin.left + margin.right)
      //     .attr("height", height + margin.top + margin.bottom);
      //
      // svg.append("defs").append("clipPath")
      //     .attr("id", "clip")
      //     .append("rect")
      //     .attr("width", width)
      //     .attr("height", height);
      //
      // context = svg.append("g")
      //     .attr("class", "context")
      //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x.domain(d3.extent(dataset.map(function(d) {console.log(d[0]); return d[0]; })));
    x.domain([d3.min(dataset.map(function(d) { return addDays(d[0],-1); })),d3.max(dataset.map(function(d) { return addDays(d[0],2); }))])
    y.domain([1, d3.max(dataset.map(function(d) { return d[2]; }))]);
    context.select(".x.axis")
    .call(xAxis)
    // add rank label to X axis
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
    path
         .datum(dataset)
         .attr("d", area)
         .style('fill', 'none')
         .style('stroke', 'steelblue')
         .attr("stroke-width", "2");


          context.append("g")
               .attr("class", "x brush")
               .call(brush)
             .selectAll("rect")
               .attr("y", -6)
               .attr("height", height + 7);


          totalLength = path.node().getTotalLength();
          path
            .attr("stroke-dasharray", totalLength+","+totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2000)
            .ease("linear-in-out")

            .attr("stroke-dashoffset", 0);
    //  console.log(dataset.filter(function(n){ return n != undefined }));
    //  console.log(dataset);
   });


}
function brushed() {
  // svg.selectAll("rect");
  var e = brush.extent();
    section2context.selectAll('.section2brushrect').remove();
  svg.selectAll("rect").classed("hidden", function(d) {
    section2Brush(e[0],e[1])
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

              // .attr('x',function(d,i){return i*82})
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
function addDays(dateObj, numDays) {
  return dateObj.setDate(dateObj.getDate() + numDays);
}
