/**
 * Created by PhucNoel
 *
 * Source: http://bl.ocks.org/mbostock/1305111
 */
var color = {
  'HARD': '#6d9bff',
  'GRASS': '#00FF00',
  'CLAY': '#FF4000'
}

function section1() {
  var player = document.getElementById('selectPlayer').value;
  var year = document.getElementById('selectYear').value;
  getStats(player, year);
}

/**
 * Display donuts charts.
 *
 * @param data
 *          Define the data as a two-dimensional array of numbers. If you had other
 *          data to associate with each number, replace each number with an object, e.g.,
 *          `{key: "value"}`.
 */
function showCharts(data) {
  // Erase previous charts
  $("section1").empty();

  // Get total game
  var totalGames = data[0][0] + data[0][1];
  // Define the margin, radius, and color scale. The color scale will be
  // assigned by index, but if you define your data using objects, you could pass
  // in a named field from the data object instead, such as `d.name`. Colors
  // are assigned lazily, so if you want deterministic behavior, define a domain
  // for the color scale.
  var m = 10,
      r = 100;

  // Define arc layout
  var arc = d3.svg.arc()
      .innerRadius(r / 2)
      .outerRadius(r);

  // Insert an svg:svg element (with margin) for each row in our dataset. A
  // child svg:g element translates the origin to the pie center.
  var svg = d3.select("section1").selectAll("svg")
      .data(data)
      .enter().append("svg:svg")
      .attr("width", (r + m) * 2)
      .attr("height", (r + m) * 2)
      .append("svg:g")
      .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

  // The data for each svg:svg element is a row of numbers (an array). We pass
  // that to d3.layout.pie to compute the angles for each arc. These start and end
  // angles are passed to d3.svg.arc to draw arcs! Note that the arc radius is
  // specified on the arc, not the layout.
  var cnt = -1;
  svg.selectAll("path")
      .data(d3.layout.pie())
      .enter().append("svg:g")
      .attr("class", "arc")
      .append("svg:path")
      .attr("d", arc)
      .style("fill", function (d, i) {
        cnt++;
        if (cnt == 0) {
          return color.GRASS;
        } else if (cnt == 2) {
          return color.HARD;
        } else if (cnt == 4) {
          return color.CLAY;
        } else {
          return "#ffffff";
        }
      })
      .append("svg:title")
      .text(function(d, i) {
        if (i == 0) {
          return "Win Games: " + d.value;
        } else {
          return "Lose Games: " + d.value;
        }

      });

  svg.append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d, i) {
        if (i == 0) { return "GRASS" }
        if (i == 1) { return "HARD" }
        if (i == 2) { return "CLAY" }
      });

  // Add text into the charts
  svg.selectAll(".arc")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", function (d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .text(function (d) {
        return calculatePercentage(d.data, totalGames);
      });
}

function getStats(player, year) {
  var params = {
    'player': player,
    'year': year
  };

  $.get("http://localhost:9615/getStats", params, function (data) {
    showCharts(data);
  });
}

function calculatePercentage(winGames, totalGames) {
  return (winGames/totalGames*100).toFixed(2)  + "%";
}