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
		objArr[objArr.length] = {date1:new Date(date.substring(6,10),date.substring(0,2)-1,date.substring(3,5)), rank:rank};
		console.log(objArr[objArr.length-1]);
		//dates.push(new Date(date.substring(6,10),date.substring(0,2)-1,date.substring(3,5)));
		//ranks.push(data.pop());
	}
	ranks = ranks.map(Number);
	var byDate = objArr.slice(0);
	byDate.sort(function(a,b) {
    return a.date1 - b.date1;
	});
	var byRank = objArr.slice(0);
	byRank.sort(function(a,b) {
		return a.rank - b.rank;
	});
console.log('by date:');
console.log(byRank[0].rank);
ranks = [];
dates = [];
// while(objArr.length>0){
// 	var temp = objArr.pop();
// 	ranks[ranks.length] = temp.rank;
// 	dates[dates.length] = temp.date;
// }
// ranks.reverse();
// dates.reverse();

	 console.log(dates);
	// console.log(test[0][0]);
 console.log(ranks);
// var test = [objArr];
console.log(objArr[0].date1);
objArr.reverse();
var test = [byDate];


// get max and min dates - this assumes data is sorted
var minDate = objArr[0].date1,
		maxDate = objArr[objArr.length-1].date1;


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
		.x(function(d) { return x(d.date1) })
		.y(function(d) { return y(d.rank) })
);

vis.selectAll("circle.line")
.data(data)
.enter().append("svg:circle")
.attr("class", "line")
.attr("cx", function(d) { return x(d.date1) })
.attr("cy", function(d) { return y(d.rank); })
.attr("r", 3.5);



}
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
