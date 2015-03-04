function go() {
var width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var hL = height / 5 ;

var padding = 10;

// var chart = d3.select(".chart")
//     .attr("width", width)
//     .attr("height", height);

// var s = document.getElementById("section3");
// s.innerHTML = "Browser inner window width: " + width + ", height: " + height + ".";

window.onresize = resize;
var m = [80, 80, 80, 80];
	var w = width - m[1] - m[3];
	var h = (height - m[0] - m[2])/3;

	var data= document.getElementById('demoWRank').innerHTML.split(",");
	console.log(data.length);
  var test = [];
  var ranks = [];
  var dates = [];
	var objArr = [];
	//var car = {type:"Fiat", model:500, color:"white"};
	while(data.length>0){
		var date = data.pop();
		var rank = parseInt(data.pop());
		objArr[objArr.length] = {date:new Date(date.substring(6,10),date.substring(0,2)-1,date.substring(3,5)), rank:rank};
		console.log(objArr[objArr.length-1]);
		//dates.push(new Date(date.substring(6,10),date.substring(0,2)-1,date.substring(3,5)));
		//ranks.push(data.pop());
	}
	ranks = ranks.map(Number);
	var byDate = objArr.slice(0);
	byDate.sort(function(a,b) {
    return a.date - b.date;
	});
	var byRank = objArr.slice(0);
	byRank.sort(function(a,b) {
		return a.rank - b.rank;
	});
// console.log('by date:');
// console.log(byRank[0].rank);
ranks = [];
dates = [];
// while(objArr.length>0){
// 	var temp = objArr.pop();
// 	ranks[ranks.length] = temp.rank;
// 	dates[dates.length] = temp.date;
// }
// ranks.reverse();
// dates.reverse();

	//  console.log(dates);
	// console.log(test[0][0]);
 console.log(ranks);
// var test = [objArr];
// console.log(objArr[0].date);
objArr.reverse();
var minRank = byRank[0].rank,
		maxRank = byRank[byRank.length-1].rank;

// var test = [byDate];
var test = byDate;

// var test2 = test[0];



var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%b %Y").parse;

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([0, height]),
    y2 = d3.scale.linear().range([0, height2]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left"),
		yAxis2 = d3.svg.axis().scale(y2).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

// var area = d3.svg.area()
//     .interpolate("monotone")
//     .x(function(d) { return x(d.date); })
//     .y0(height)
//     .y1(function(d) { return y(d.rank); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.rank); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

// var focus = svg.append("g")
//     .attr("class", "focus")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("sp500.csv", type, function(error, data) {
  x.domain(d3.extent(test.map(function(d) { return d.date; })));
  y.domain([1, d3.max(test.map(function(d) { return d.rank; }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  // focus.append("path")
  //     .datum(test2)
  //     // .attr("class", "area")
  //     .attr("d", area);

  // focus.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis);

  // focus.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis);

  context.append("g")
		  .attr("class", "y axis")
		  .call(yAxis2);

  context.append("path")
      .datum(test)
      // .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);
});

function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select(".area").attr("d", area);
  focus.select(".x.axis").call(xAxis);
}

function type(d) {
  d.date = parseDate(d.date);
  d.rank = +d.rank;
  return d;
}

}

// get max and min dates - this assumes data is sorted

//good example
/*
var minDate = objArr[0].date,
		maxDate = objArr[objArr.length-1].date;


var p = 30,
y = d3.scale.linear().domain([byRank[byRank.length-1].rank, byRank[0].rank]).range([h, 0]),
x = d3.time.scale().domain([minDate, maxDate]).range([0, w]);

var vis = d3.select("#section3")
.data([objArr])
.append("svg:svg")
.attr("width", w + p * 2)
.attr("height", h + p * 2)
.append("svg:g")
.attr("transform", "translate(" + p + "," + p + ")");

var rules = vis.selectAll("g.rule")
.data(x.ticks(20))
.enter().append("svg:g")
.attr("class", "rule");

rules.append("svg:line")
.attr("x1", x)
.attr("x2", x)
.attr("y1", 0)
.attr("y2", h - 1);

rules.append("svg:line")
.attr("class", function(d) { return d ? null : "axis"; })
.attr("y1", y)
.attr("y2", y)
.attr("x1", 0)
.attr("x2", w + 1);

rules.append("svg:text")
.attr("x", x)
.attr("y", h + 3)
.attr("dy", ".71em")
.attr("text-anchor", "middle")
.text(x.tickFormat(12));

rules.append("svg:text")
.attr("y", y)
.attr("x", -3)
.attr("dy", ".35em")
.attr("text-anchor", "end")
.text(y.tickFormat(12));

vis.append("svg:path")
.attr("class", "line")
.attr("d", d3.svg.line()
		.x(function(d) { return x(d.date) })
		.y(function(d) { return y(d.rank) })
);

vis.selectAll("circle.line")
.data(data)
.enter().append("svg:circle")
.attr("class", "line")
.attr("cx", function(d) { return x(d.date) })
.attr("cy", function(d) { return y(d.rank); })
.attr("r", 3.5);

}


*/





/*

	function formatCurrency (d){
  	return  d;
	}

	var xLabels = d3.time.scale().domain([new Date(2013, 0, 1), new Date(2013, 11, 31)]).range([0, w]);
	var x = d3.scale.linear().domain([0, dates.length]).range([0, w]);
	// var x = d3.time.scale().domain([d3.min(dates), d3.max(dates)]).range([0, w]);
	// var x = d3.time.scale().domain([dates[0], dates[dates.length-1]]).range([0, w]);
	// var x = d3.time.scale().domain([minDate, maxDate]).range([0, w]);
	var y = d3.scale.linear().domain([d3.max(ranks), d3.min(ranks)]).range([h, 0]);

	var line = d3.svg.line()
		.x(function(d,i) {
			console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
			return x(i);
		})
		.y(function(d) {
			console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
			return y(d);
		})

	var graph = d3.select("#section3").append("svg:svg")
	      .attr("width", w + m[1] + m[3])
	      .attr("height", h + m[0] + m[2])
	    .append("svg:g")

	      .attr("transform", "translate(" + 120 + "," + m[0] + ")");

	var xAxis = d3.svg.axis().scale(xLabels).ticks(d3.time.months).tickFormat(d3.time.format("%B")).tickSize(-h).tickSubdivide(true);
	graph.append("svg:g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + h + ")")
	      .call(xAxis);

	var yAxisLeft = d3.svg.axis().scale(y).ticks(7).tickFormat(formatCurrency).orient("left");
	graph.append("svg:g")
	      .attr("class", "y axis")
	      .attr("transform", "translate(0,-25)")
	      .call(yAxisLeft);

		graph.append("svg:path")
			.attr("d", line(ranks))
			.attr("i", 0)
			.attr('class', 'line');

		// graph.append("circle")
		//   .data(ranks)
		//   .attr("y",function(d) { return d;})
		// 	.attr("x", 50);
		}
		*/




/*
var w = width,
    h = height/3,
    pad = 20,
    left_pad = 150,
    Data_url = '/data.json';

var svg = d3.select("#section3")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

var x = d3.scale.linear().domain([0, 11]).range([left_pad, w-pad]),
    y = d3.scale.linear().domain([0,11]).range([pad, h-pad*2]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, "+(h-pad)+")")
    .call(xAxis);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+(left_pad-pad)+", 0)")
    .call(yAxis);

*/
//Create the SVG Viewport
// var svgContainer = d3.select("body").append("svg")
//                                      .attr("width", width)
//                                      .attr("height", height);
//
// //Create the Scale we will use for the Axis
// var axisScale = d3.scale.linear()
//                          .domain([0,100])
//                          .range([padding, width-padding*2]);
//
// //Create the Axis
// var xAxis = d3.svg.axis()
//                    .scale(axisScale);
//
//
// //Create an SVG group Element for the Axis elements and call the xAxis function
// var xAxisGroup = svgContainer.append("g")
//                               .call(xAxis);

function resize()
{
	//s.innerHTML = "Browser inner window width: " + width + ", height: " + height + ".";
	width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;
	height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
}
