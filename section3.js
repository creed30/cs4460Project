var width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var hL = height / 5 ;

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

var x = document.getElementById("section3");
x.innerHTML = "Browser inner window width: " + width + ", height: " + height + ".";



window.onresize = resize;

var svgContainer = d3.select("body").append("svg")
                                    .attr("width", width)
                                    .attr("height", height);

//Draw the line
var xAxis = svgContainer.append("line")
                         .attr("x1", 100)
                         .attr("y1", hL)
                         .attr("x2", width - 100)
                         .attr("y2", hL)
                         .attr("stroke-width", 5)
                         .attr("stroke", "black");

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
