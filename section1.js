function loadYear() {
  // get selectbox
  var selectBox = document.getElementById('selectYear');
  // loop through years
  for (var i = 2014; i >= 2000; i--) {
    // create option element
    var option = document.createElement('option');
    // add value and text name
    option.value = i;
    option.innerHTML = i;
    // add the option element to the selectbox
    selectBox.appendChild(option);
  }
}

function fillPlayers() {
  // selectPlayers(year.value);
  // get selectbox
  var selectBox = document.getElementById('selectPlayer');
  var players = document.getElementById('players').innerHTML.split(",").sort().reverse();
  // loop through years
  // for (var i = 2014; i >= 2000; i--) {
  while(players.length > 0) {
    // create option element
    var option = document.createElement('option');
    // add value and text name
    var temp = players.pop();
    option.value = temp;
    option.innerHTML = temp;
    // add the option element to the selectbox
    selectBox.appendChild(option);
    // console.print("chees");
  }
  // }
}
