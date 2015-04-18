function loadYear() {
  // get selectbox
  var selectBox = document.getElementById('selectYear');

  // loop through years
  for (var i = 2014; i >= 2000; i--) {
    // create option element
    var option = document.createElement('option');
    // add value and text name
    option.value = i;
    option.index = "test";
    option.innerHTML = i;
    // add the option element to the selectbox
    selectBox.appendChild(option);
  }
}

function loadPlayers() {
	var year = document.getElementById('selectYear');
	var yearInput = year.value;
  try{
  year.remove(year.options.namedItem("SelectYear").id);
  } catch(err){}
  var players = document.getElementById('selectPlayer');
	while (players.options.length > 0) {
	   players.options.remove(0);
	}
	var dataset =
	d3.csv("ATPDATA/ATP"+ yearInput +".csv", function(data)
	{
	 dataset = data.map(function(d)
	 {
	     return d["Winner"];
	   });
	   dataset2 = data.map(function(d)
	   {
       return d["Loser"];
	   });

	    // console.log(uniq(dataset.sort()).length);
	    // console.log(uniq(dataset2.sort()).length);
	    var parseData = dataset.concat(dataset2);
	    // console.log(uniq(parseData.sort()).length);
	    parseData = uniq(parseData.sort().reverse());
	    while (parseData.length > 0) {
	      var option = document.createElement("option");
	      var temp = parseData.pop();
	          option.text = temp;
	          option.id = temp;
	          option.value = temp;
	          players.add(option);
	    }
	  });

}

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
