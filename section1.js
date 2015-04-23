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

  var fakedat = [];
  fakedat[0] = [];
  fakedat[1] = [];
  fakedat[2] = [];

  fakedat[0][0] = 0;
  fakedat[0][1] = 1;
  fakedat[1][0] = 0;
  fakedat[1][1] = 1;
  fakedat[2][0] = 0;
  fakedat[2][1] = 1;

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
      .attr("width", 360)
      .attr("heigth", 200)
      // .attr("x", 500)
      .selectAll("svg")
      .data(fakedat)
      .enter().append("svg:svg")
      .attr("class", "piechart")
      .attr("width", (r + m) * 2)
      .attr("height", (r + m) * 2)
      .attr("x", function (d, i) {
          return i*120;
      })
      .append("svg:g")
      .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

      // d3.select("section1").append("svg:line")
      //       .attr("x1", 0)
      //       .attr("y1", 0)
      //       .attr("x2", width + margin.right )
      //       .attr("y2", width)
      //       .style("stroke", "rgb(6,120,155)");
      // svg

  // The data for each svg:svg element is a row of numbers (an array). We pass
  // that to d3.layout.pie to compute the angles for each arc. These start and end
  // angles are passed to d3.svg.arc to draw arcs! Note that the arc radius is
  // specified on the arc, not the layout.
  var cnt = -1;
  pie = d3.layout.pie().sort(null).startAngle(2*Math.PI).endAngle(0)
  root = svg.selectAll("path")
            .data(pie)
            .enter().append("svg:g")
            .attr("class", "arc");


  var path = root.append("svg:path")
                  .attr("class", "piechart-part")
                  // .data(pie([0,100]))
                  .attr("d", arc)
                  .style("fill", function (d, i) {
                    this.dat = d;
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
                  .each(function(d) { this._current = d; });

  // store the initial values
  // svg.data(fakedat)
  var timeout = setTimeout(function () {
    clearTimeout(timeout);
    var count = 0;
    svg.data(data);
    root.data(pie);
    path = path.data(function(d){return pie(d)}); // update the data

    path.transition().duration(1000).attrTween("d", function (a) {
      if (this.progress === undefined) {
        this.progress = 0;
      }

      var totalGames = 0;
      var wins = 0;

      if (count < 2) {
        totalGames = totalGrassGames;
        wins = data[0][0];
      } else if (count < 4) {
        totalGames = totalHardGames;
        wins = data[1][0];
      } else {
        totalGames = totalClayGames;
        wins = data[2][0];
      }

      count++;
      // Store the displayed angles in _current.
      // Then, interpolate from _current to the new angles.
      // During the transition, _current is updated in-place by d3.interpolate.
      var i  = d3.interpolate(this._current, a);
      var i2 = d3.interpolate(this.progress, wins/totalGames);
      this._current = i(0);
      return function(t) {
        if(arc(i(t)).indexOf("NaN") > -1){
          return "M-9.184850993605149e-15,-50A50,50 0 0,0 -0.0006543488698345634,-49.99999999571828L-0.0003271744349172817,-24.99999999785914A25,25 0 0,1 -4.592425496802574e-15,-25Z"
        }

        return arc(i(t));
      }
    });

    cnt = 0;
    svg.selectAll(".arc")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
          if( isNaN(d['endAngle']) || isNaN(d['startAngle']) ){
            return "";
          }
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
  }, 100);

  cnt = 0;
  root.append("svg:title")
      .text(function(d, i) {
        if (i == 0) {
          return "Win Games: " + data[cnt][0];
        } else {
          return "Lose Games: " + data[cnt++][1];
        }
      })
      .each(function(d) {
        this._current = d;
      });
      //borders between pie charts
      svg.append("svg:line")
            .attr("x1", -59)
            .attr("y1", -50)
            .attr("x2", -59 )
            .attr("y2", 300)
            .style("stroke", "rgb(6,120,155)")
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
}

function getStats(player, year) {
  var params = {
    'player': player,
    'year': year
  };
}

function calculatePercentage(games, totalGames) {
  return (games/totalGames*100).toFixed(2)  + "%";
}
