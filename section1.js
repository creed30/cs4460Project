/**
 * Created by PhucNoel
 *
 * Source: http://bl.ocks.org/mbostock/1305111
 */
var color = {
  'HARD': '#6d9bff',
  'GRASS': '#00FF00',
  'CLAY': '#FF4000',
  'WHITE': '#FFFFFF'
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
  var totalGrassGames = data[0][0] + data[0][1];
  var totalHardGames = data[1][0] + data[1][1];
  var totalClayGames = data[2][0] + data[2][1];

  // Define the margin, radius, and color scale. The color scale will be
  // assigned by index, but if you define your data using objects, you could pass
  // in a named field from the data object instead, such as `d.name`. Colors
  // are assigned lazily, so if you want deterministic behavior, define a domain
  // for the color scale.
  var m = 10,
      r = 50;

  // Define arc layout
  var arc = d3.svg.arc()
      .innerRadius(r / 2)
      .outerRadius(r);

  // Insert an svg:svg element (with margin) for each row in our dataset. A
  // child svg:g element translates the origin to the pie center.
  var svg = d3.select("section1").append("svg")
      .attr("width", 1000)
      .attr("heigth", 200)
      .attr("x", 500)
      .selectAll("svg")
      .data(data)
      .enter().append("svg:svg")
      .attr("class", "piechart")
      .attr("width", (r + m) * 2)
      .attr("height", (r + m) * 2)
      .attr("x", function (d, i) {
          return 400 + i*120;
      })
      .append("svg:g")
      .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

  // The data for each svg:svg element is a row of numbers (an array). We pass
  // that to d3.layout.pie to compute the angles for each arc. These start and end
  // angles are passed to d3.svg.arc to draw arcs! Note that the arc radius is
  // specified on the arc, not the layout.
  var cnt = -1;
  svg.selectAll("path")
      .data(d3.layout.pie().sort(null).startAngle(2*Math.PI).endAngle(0))
      .enter().append("svg:g")
      .attr("class", "arc")
      .append("svg:path")
      .attr("class", "piechart-part")
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
          return color.WHITE;
        }
      })
      .append("svg:title")
      .text(function(d, i) {
        if (i == 0) {
          return "Win Games: " + d.value;
        } else {
          return "Lose Games: " + d.value;
        }
      })
      .each(function(d) {
        this._current = d;
      });

  svg.append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("class", "surface")
      .text(function(d, i) {
        if (i == 0) {
          if (totalGrassGames == 0) {
            return "Not Playing Grass";
          }
          return "GRASS";
        }

        if (i == 1) {
          if (totalHardGames == 0) {
            return "Not Playing Hard";
          }
          return "HARD";
        }

        if (i == 2) {
          if (totalClayGames == 0) {
            return "Not Playing Clay";
          }
          return "CLAY";
        }
      });

  // Add text into the charts
  cnt = 0;
  svg.selectAll(".arc")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", function (d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .text(function (d, i) {
        var totalGames = 0;
        if (cnt < 2) {
          totalGames = totalGrassGames;
        } else if (cnt < 4) {
          totalGames = totalHardGames;
        } else {
          totalGames = totalClayGames;
        }
        cnt++;
        if (i == 1 && totalGames != 0 && d.data == totalGames) {
          return "0% Win";
        }

        if (i == 1) {
          return "";
        }

        if (totalGames == 0) {
          return "";
        } else {
          return calculatePercentage(d.data, totalGames);
        }
      });

  d3.selectAll("#selectPlayer")
      .on("change", change);

  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }
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

function calculatePercentage(games, totalGames) {
  return (games/totalGames*100).toFixed(2)  + "%";
}
