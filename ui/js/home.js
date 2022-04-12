let trains;

// to show or hide the month and year
var isHide = true;
function show() {
  var hide = document.getElementById("hide");
  var b = document.getElementById("show");

  if (isHide) {
    hide.style.opacity = 1;
    b.innerHTML = "-";
    isHide = false;
  } else {
    b.innerHTML = "+";
    hide.style.opacity = 0;
    isHide = true;
  }
}

const host = window.location.host.split(':')[0];
const url = 'http://'+host+':4000/graphql/?query=';
const baseNeed = ['Depart', 'Arrive', 'Annees', 'Mois'];

// to automatically create the graphql request
function createRequest(requests, baseNeed) {
  var request = url + '{train';
  const need = [...baseNeed];

  if (requests != null || requests.length == 0) {
    request += '( ';
    requests.forEach(ele => {
      console.log(ele)
      if (isNaN(ele.value)) {
        request += `${ele.type} : "${ele.value}",`;
      } else {
        request += `${ele.type} : ${ele.value},`;
      }

      const index = need.indexOf(ele.type);
      if (index !== -1) {
        need.splice(index, 1);
      }
    });
    request += ' )';
  }

  if (need.length != 0) {
    request += "{ ";

    need.forEach(ele => {
      request += `${ele} `;
    })

    request += '}}';
    return request;
  }

  return false;
}

// function activated on demand to change the shown data
function changeData(event) {
  const inputs = document.getElementsByClassName("select");
  const requests = [];

  for (let input of inputs) {
    const value = input.value;
    if (value != '') {
      const type = input.name;
      const o = new Object;
      o.type = type;
      o.value = value;
      requests.push(o);
    }
  }

  const request = createRequest(requests, baseNeed);
  if (isNaN(request)) {
    d3.json(request).then(setData);
  }
}

// set the data after fetching
function setData(root) {
  console.log(root)
  const trains = root.data.train;
  
  if(trains == undefined) return;

  if ('Depart' in trains[0]) {

    trains.sort((a, b) => d3.ascending(a.Depart, b.Depart));

    var tmp = trains[0].Depart;
    var result = [tmp];

    trains.forEach(data => {
      if (tmp != data.Depart) {
        tmp = data.Depart;
        result.push(data.Depart);
      }
    })
    d3.select("#departure").selectAll('option').remove();
    d3.select("#departure").selectAll('option').data(result).enter().append('option').attr('value', function (d) { return d });
  }
  if ('Arrive' in trains[0]) {

    trains.sort((a, b) => d3.ascending(a.Arrive, b.Arrive));

    var tmp = trains[0].Arrive;
    var result = [tmp];

    trains.forEach(data => {
      if (tmp != data.Arrive) {
        tmp = data.Arrive;
        result.push(data.Arrive);
      }
    })
    d3.select("#arrival").selectAll('option').remove();
    d3.select("#arrival").selectAll('option').data(result).enter().append('option').attr('value', function (d) { return d });
  }
  if ('Annees' in trains[0]) {

    trains.sort((a, b) => d3.ascending(a.Annees, b.Annees));

    var tmp = trains[0].Annees;
    var result = [tmp];

    trains.forEach(data => {
      if (tmp != data.Annees) {
        tmp = data.Annees;
        result.push(data.Annees);
      }
    })

    d3.select("#year").selectAll('option').remove();
    d3.select("#year").selectAll('option').data(result).enter().append('option').attr('value', function (d) { return d });
  }
  if ('Mois' in trains[0]) {

    trains.sort((a, b) => d3.ascending(a.Mois, b.Mois));

    var tmp = trains[0].Mois;
    var result = [tmp];

    trains.forEach(data => {
      if (tmp != data.Mois) {
        tmp = data.Mois;
        result.push(data.Mois);
      }
    })

    d3.select("#month").selectAll('option').remove();
    d3.select("#month").selectAll('option').data(result).enter().append('option').attr('value', function (d) { return d });
  }
}


d3.json("http://" + host + ":4000/graphql/?query={train{Depart Arrive Annees Mois}}").then(setData)
