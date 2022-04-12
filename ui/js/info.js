const host = window.location.host.split(':')[0];
const url = 'http://'+host+':4000/graphql/?query=';
const baseNeed = ['Depart', 'Arrive', 'Annees', 'Mois'];
const other = ['attendus', 'Temps_de_trajet_moyen', 'Annule', 'Depart_retarde', 'Retard_moyen_sur_les_depart_tardif', 'Retard_moyen_sur_tous_les_depart', 'Train_arrive_en_retard', 'Retard_moyen_sur_tous_train_en_retard', 'train_en_retard_superieur_a_15_min', 'temps_moyen_des_train_en_retard_superieur_a_15_min', 'train_en_retard_superieur_a_30_min', 'train_en_retard_superieur_a_60_min'];
const otherArray = ['delay'];
const delay = ['etat_de_la_ligne', 'gestion_du_trafic', 'materiel', 'gestion_de_station_et_reutilisation_de_materiel', 'passagers', 'causes_externes'];


const formatedData = formatPost(data);
d3.json("http://"+host+":4000/graphql/?query={train{Depart Arrive Annees Mois}}").then(inputData);
if(formatedData.length === 0) {
  document.getElementById("donut").innerHTML = "<div class=\"no-data\"><h2>Aucun élément n'a été sélectionné</h2><p>Pour afficher les données, veuillez choisir un choix parmi les quatres champs en haut de cette page</p></div>";
  document.getElementById("map").innerHTML = "<div class=\"no-data\"><h2>Aucun élément n'a été sélectionné</h2><p>Pour afficher les données, veuillez choisir un choix parmi les quatres champs en haut de cette page</p></div>";
} else {
  d3.json(createRequest(formatedData, baseNeed, 'train')).then(setData);
}

const setting = new Object;

const div = d3.select("#map").append("div")
  .attr("class", "tooltip line")
  .style("opacity", "0");

// to display the map at the right of the screen
function setStationMap(root){
  svg = setting.svg;
  projection = setting.projection;

  const p = svg.append("g");
  const gare = root.data.gare;
  p.selectAll("circle")
    .data(gare)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return projection(d.geo)[0] })
    .attr("cy", function (d) { return projection(d.geo)[1] })
    .attr("r", "5px")
    .attr("fill", "#0053ba")
    .on("mouseover", function(event, d) {
      div.transition().duration(250)
        .style("opacity", "0.8");
      div.html("Station : " + d.name + "<br/>"
            +  "Ville : " + d.city)
          .style("left", (event.pageX + 30) + "px")
          .style("top", (event.pageY - 30) + "px");
  })
  .on("mouseout", function(event, d) {
      div.transition().duration(250).style("opacity", "0");
      div.html("")
          .style("left", "-500px")
          .style("top", "-500px");
  })
}

function map() {
  const width = 500, height = 500;
  const svg = d3.select('#map').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

  const path = d3.geoPath();
  const projection = d3.geoMercator()
    .center([2.454071, 46.279229])
    .scale(1500)
    .translate([width, 200]);

  setting.svg = svg;
  setting.projection = projection;
  path.projection(projection);

  const zoom = d3.zoom()
    .on('zoom', (event) => {
      svg.attr('transform', event.transform);
    })
    .scaleExtent([1, 8]);

  // .call(zoom)

  const deps = svg.append("g");
  d3.json('/json/departments.json').then(function (geojson) {

    deps.selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("d", path)

  });
  return {svg, projection};
}

// handle the data in the input header
function inputData(root) {
  const trains = root.data.train;

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

// to format the post data (from the index page)
function formatPost(data) {
  const array = [];
  baseNeed.forEach(ele => {
    if (data[ele] !== '') {
      array.push({ type: ele, value: data[ele] });
    }
  });

  return array;
}

// to automatically create the graphql request
function createRequest(requests, baseNeed, type) {
  if (type === 'train') {
    var request = url + '{train';
    const need = [...baseNeed];

    if (requests != null || requests.length == 0) {
      request += '( ';
      requests.forEach(ele => {

        if (isNaN(ele.value)) {
          request += `${ele.type} : "${ele.value}",`;
        } else {
          request += `${ele.type} : ${ele.value},`;
        }
        const index = need.indexOf(ele.type);

        if (index !== -1) {
          need.splice(index, 1);
        }

      })
      request += ' )';
    }


    request += "{ ";

    need.forEach(ele => {
      request += `${ele} `;
    })

    other.forEach(ele => {
      request += `${ele} `;
    })

    otherArray.forEach(ele => {
      request += `${ele} { `;
      delay.forEach(ele2 => {

        request += `${ele2} `;
        const index = need.indexOf(ele.type);
      })
      request += `}`;
    })

    request += '}}';
    console.log(request)
    return request;
  } else if (type === 'station') {
    var request = url + '{gare(station :"' + requests + '"){name city geo}}';
    return request;
  }

}

// calculate the total delay for all trains in a set of data
function TotalDelay(data) {
  const mean = {};
  const cumsum = {};
  const total = { mean, cumsum };
  const number = data.length;

  console.log(data)
  const property = Object.keys(data[0]);

  data.forEach(ele => {
    property.forEach(ele2 => {
      if (!(ele2 in cumsum)) {
        Object.defineProperty(cumsum, ele2, {
          value: ele[ele2],
          writable: true
        });
      } else {
        if (ele2 == 'delay') {
          Object.keys(cumsum['delay']).forEach(ele3 => {
            cumsum[ele2][ele3] += ele[ele2][ele3];
          })
        } else {
          cumsum[ele2] += ele[ele2];
        }
      }
    });
  });

  property.forEach(ele => {
    if (ele == 'delay') {
      var delayMean = {};

      delay.forEach(ele2 => {
        Object.defineProperty(delayMean, ele2, {
          value: (cumsum.delay[ele2] / number).toFixed(0),
          writable: false
        });
      });

      Object.defineProperty(mean, ele, {
        value: delayMean,
        writable: false
      });

    } else {
      Object.defineProperty(mean, ele, {
        value: (cumsum[ele] / number).toFixed(0),
        writable: false
      });
    }

  });

  return total;
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
  const request = createRequest(requests, baseNeed, 'train');
  if (isNaN(request)) {
    d3.json(request).then(inputData);
  }
}

function setDataColumnHeader(d) {
  if(d.header) return "data-header";
  return "";
}
function setDataParagraph(d) {
  var name = d.name;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return "<strong>" + name + "</strong> : " + d.value
}

// set the data after fetching
function setData(root) {
  const data = root.data.train;
  
  const a = TotalDelay(data);
  PieChart(a.cumsum.delay);
  var setting = map();
  formatedData.forEach(ele => {
    d3.json(createRequest(ele.value, baseNeed, 'station')).then(setStationMap)
  });


  const delayc = [{ name: 'Total des retards', value: '', header: true }];
  const delaym = [{ name: 'Moyenne des retards', value: '', header: true }];
  delay.forEach(ele => {
    delayc.push({ name: ele.replace(/_/g, ' '), value: a.cumsum.delay[ele].toFixed(0) + " min" })
    delaym.push({ name: ele.replace(/_/g, ' '), value: a.mean.delay[ele] + " min" })
  });
  d3.select('#delayc').selectAll("p").data(delayc).enter().append("p").attr("class", setDataColumnHeader).html(setDataParagraph);
  d3.select('#delaym').selectAll("p").data(delaym).enter().append("p").attr("class", setDataColumnHeader).html(setDataParagraph);

  
  const datac = [{ name: 'Données brutes', value: '', header: true }];
  const datam = [{ name: 'Moyenne des données', value: '', header: true }];
  other.forEach(ele => {
    datac.push({name : ele.replace(/_/g, ' ') , value: a.cumsum[ele].toFixed(0)})
    datam.push({name : ele.replace(/_/g, ' ') , value: a.mean[ele] })
  });
  d3.select('#datac').selectAll("p").data(datac).enter().append("p").attr("class", setDataColumnHeader).html(setDataParagraph);
  d3.select('#datam').selectAll("p").data(datam).enter().append("p").attr("class", setDataColumnHeader).html(setDataParagraph);
}

// to view on new click
function view(event) {
  var d = document.getElementById("starti").value;
  var a = document.getElementById("endi").value;
  var y = document.getElementById("yeari").value;
  var m = document.getElementById("monthi").value;

  var request;
  if (a != "" || d != "") {
    if (y != "") {
      if (m != "") {
        request = "train(Departure:\"" + d + "\",Arrival:\"" + a + "\",Year:" + y + ",Month: " + m + "){delay{external_causes railway_infrastructure traffic_management rolling_stock station_management_and_reuse_of_material travellers_taken_into_account}}"
      } else {
        request = "train(Departure:\"" + d + "\",Arrival:\"" + a + "\",Year:" + y + "){delay{external_causes railway_infrastructure traffic_management rolling_stock station_management_and_reuse_of_material travellers_taken_into_account}}"
      }
    } else {
      if (m != "") {
        request = "train(Departure:\"" + d + "\",Arrival:\"" + a + "\",Month: " + m + "){delay{external_causes railway_infrastructure traffic_management rolling_stock station_management_and_reuse_of_material travellers_taken_into_account}}"

      } else {
        request = "train(Departure:\"" + d + "\",Arrival:\"" + a + "\"){delay{external_causes railway_infrastructure traffic_management rolling_stock station_management_and_reuse_of_material travellers_taken_into_account}}"
      }
    }
    d3.json("http://"+host+":4000/graphql/?query={" + request + "}").then(function (result) {
      trains = result.data.train
      PieChart(TotalDelay(trains))
    })
  }
}

// to display the piechart
function PieChart(data) {
  // set the dimensions and margins of the graph
  const width = 800, height = 300, margin = 10;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(width, height) / 2 - margin
  d3.selectAll("svg").remove();
  // append the svg object to the div called 'my_dataviz'
  const svg = d3.select("#donut")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 1.7},${(height / 2) + 50})`);

  // set the color scale
  const color = d3.scaleOrdinal()
    .range(d3.schemeDark2);

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .sort(null) // Do not sort group by size
    .value(d => d[1])
  const data_ready = pie(Object.entries(data))

  // The arc generator
  const arc = d3.arc()
    .innerRadius(radius * 0.5)         // This is the size of the donut hole
    .outerRadius(radius * 0.8)

  // Another arc that won't be drawn. Just for labels positioning
  const outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll('allSlices')
    .data(data_ready)
    .join('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data[1]))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

  // Add the polylines between chart and labels:
  svg
    .selectAll('allPolylines')
    .data(data_ready)
    .join('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function (d) {
      const posA = arc.centroid(d) // line insertion in the slice
      const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      const posC = outerArc.centroid(d); // Label position = almost the same as posB
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

  // Add the polylines between chart and labels:
  svg
    .selectAll('allLabels')
    .data(data_ready)
    .join('text')
    .text(d => d.data[0].split('total_Delay').join(" ").split("_").join(" "))
    .attr('transform', function (d) {
      const pos = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .style('text-anchor', function (d) {
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return (midangle < Math.PI ? 'start' : 'end')
    })

}