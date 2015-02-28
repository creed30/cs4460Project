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

// var x = document.getElementById("section3");
// x.innerHTML = "Browser inner window width: " + width + ", height: " + height + ".";

window.onresize = resize;
var m = [80, 80, 80, 80];
	var w = width - m[1] - m[3];
	var h = height - m[0] - m[2];

	var data= document.getElementById('demoWRank').innerHTML.split(",");
	console.log(data);
  var test = [];
  var ranks = [];
  var dates = [];
	//var car = {type:"Fiat", model:500, color:"white"};
	while(data.length>0){
		var date = data.pop();
		dates.push(new Date(date.substring(6,10),date.substring(0,2)-1,date.substring(3,5)));
		ranks.push(data.pop());
	}
   // 	for (var i = 0; i < data.length; i+2) {
	  //  ranks[i/2]=data[i];
	//   dates[i/2]=data[i+1];
	//  }
	ranks = ranks.map(Number);
	 console.log(dates);
	// console.log(test[0][0]);
 console.log(ranks);
	function formatCurrency (d){
  	return  d;
	}

	var xLabels = d3.time.scale().domain([new Date(2013, 0, 1), new Date(2013, 11, 31)]).range([0, w]);
	var x = d3.scale.linear().domain([0, ranks.length]).range([0, w]);
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
			.attr('class', 'line');
		}
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
	x.innerHTML = "Browser inner window width: " + width + ", height: " + height + ".";
	width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;
	height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
}
