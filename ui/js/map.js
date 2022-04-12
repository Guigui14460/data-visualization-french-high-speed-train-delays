const width = 800, height = 800;
const host = window.location.host.split(':')[0];
const path = d3.geoPath();

const projection = d3.geoMercator()
// const projection = d3.geoConicConformal()
    .center([2.454071, 46.279229])
    .scale(3000)
    .translate([width / 2, height / 2]);

path.projection(projection).pointRadius(1.5);

const zoom = d3.zoom()
    .on('zoom', (event) => {
      svg.attr('transform', event.transform);
    })
    .scaleExtent([1, 8]);

// global svg for France
const svg = d3.select('#map').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)
    // .call(zoom)

// french departements
const deps = svg.append("g");
d3.json('./json/departments.json').then(function (geojson) {
    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("fill", function (d) {
            if (d.geometry.type == "Point") {
                return 'green'
            } return 'white'
        })
        .attr("stroke", "black")
        .attr("d", path)
});

// used to display informations
const infoDiv = d3.select("#info").append("div");

// used for the activation of a station
var active_lines = [];
var active_station;


var tooltip_lines = d3.select("body")
    .append("div")
    .attr("class", "tooltip line")
    .style("visibility", "hidden");

const circuits = svg.append("g");
d3.json("http://" + host + ":4000/graphql/?query={lines{line_code geometry{type coordinates}}}").then(function (data) {
    circuits.selectAll("circle")
		.data(data.data.lines).enter()
		.append("circle")
		.attr("cx", function (d) { return projection(d.geometry.coordinates)[0]; })
		.attr("cy", function (d) { return projection(d.geometry.coordinates)[1]; })
		.attr("r", "2px")
		.attr("fill", "red")
        .attr("class", function (d) { return "line_code line_code" + d.line_code; })
        .on("mouseover", function(event, d) {
            if(active_lines.length !== 0 && !active_lines.includes(d.line_code)) return;

            tooltip_lines.html("<b>Code de la ligne : </b>" + d.line_code)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px")
                .style("visibility", "visible");
            var thisClass = d3.select(this).attr("class");
            if(active_lines.length === 0){
                d3.selectAll("circle.line_code").attr("opacity", 0);
            } else {
                for(const code of active_lines){
                    if(code != d.line_code) {
                        d3.selectAll("circle.line_code.line_code" + code).attr("opacity", 0);
                    }
                }
            }
            d3.selectAll("circle." + thisClass.split(" ").join(".")).attr("opacity", 1);
        })
        .on("mouseout", function(event, d) {
            if(active_lines.length !== 0 && !active_lines.includes(d.line_code)) return;

            tooltip_lines.html("")
                .style("visibility", "hidden");
            if(active_lines.length === 0){
                d3.selectAll("circle").attr("opacity", 1);
            } else {
                for(const code of active_lines){
                    d3.selectAll("circle.line_code.line_code" + code).attr("opacity", 1);
                }
            }
        })
        .on("click", function(event, line) {
            if(active_lines.length !== 0 && !active_lines.includes(line.line_code)) return;

            d3.json("http://" + host + ":4000/graphql/?query={stationByLineCode(line_code: " + line.line_code + "){city label uic_code departement}}").then(function (stations) {
                infoDiv.html("<h2 class=\"line\">Code de la ligne sélectionnée : " + line.line_code + "</h2><p>Voici la liste des gares se trouvant sur cette voie</p>");
                infoDiv.append("ul").selectAll("ul")
                    .data(stations.data.stationByLineCode).enter()
                    .append("li")
                    .html(function(d) { return "<strong class=\"station\">" + d.label + "</strong> (code UIC <a target=\"_blank\" title=\"france gare " + d.uic_code + " wikipédia\" href=\"https://google.com/search?q=france%20gare%20" + d.uic_code + "%20wikipédia\">" + d.uic_code + "</a>) : ville " + d.city + " située dans le département " + d.departement; })
                infoDiv.append("p").attr('class', 'bottom').html("Vous pouvez avoir plus d'informations en effectuant une recherche approfondie sur <a target=\"_blank\" title=\"rfn ligne " + line.line_code + " wikipédia\" href=\"https://google.com/search?q=rfn%20ligne%20" + line.line_code + "%20wikipédia\">Google</a>.");
            });
            
            event.stopPropagation();
        });
});


var tooltip_stations = d3.select("body")
    .append("div")
    .attr("class", "tooltip station")
    .style("visibility", "hidden");

const stations = svg.append("g");
d3.json("http://" + host + ":4000/graphql/?query={stations{uic_code label city departement geometry{type coordinates}}}").then(function (data) {
    stations.selectAll("circle")
        .data(data.data.stations).enter()
        .append("circle")
        .attr("cx", function (d) { return projection(d.geometry.coordinates)[0]; })
        .attr("cy", function (d) { return projection(d.geometry.coordinates)[1]; })
        .attr("r", "4px")
        .attr("fill", "blue")
        .attr("class", function (d) { return "station station" + d.uic_code; })
        .on("mouseover", function(event, d) {
            tooltip_stations.html("<b>Nom de la gare : " + d.label + "</b><br>Ville : " + d.city + "<br>Département : " + d.departement)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px")
                .style("visibility", "visible");
        })
        .on("mouseout", function(event, d) {
            tooltip_stations.html("")
                .style("visibility", "hidden");
        })
        .on("click", function(event, station) {
            // if we click on another station
            if(active_station !== undefined && active_station !== station) {
                for(const code of active_lines){
                    d3.selectAll("circle.line_code.line_code" + code).attr("opacity", 0);
                }
            }

            active_lines = [];
            if(active_station === station){ // if same station we deactivate
                active_station = undefined;
                d3.selectAll("circle.line_code").attr("opacity", 1);
            } else { // we activate
                active_station = station;
                d3.json("http://" + host + ":4000/graphql/graphql/?query={lineCodesByStationCode(uic_code: " + station.uic_code + "){line_code}}").then(function (lines) {
                    d3.selectAll("circle.line_code").attr("opacity", 0);
                    infoDiv.html("<h2 class=\"station\">Gare sélectionné : " + station.label + "</h2><p>Voici la liste des lignes à proximité de cette gare :</p>");
                    infoDiv.append("ul").selectAll("ul")
                        .data(lines.data.lineCodesByStationCode).enter()
                        .append("li")
                        .html(function(d) {
                            active_lines.push(d.line_code);
                            d3.selectAll("circle.line_code.line_code" + d.line_code).attr("opacity", 1);
                            return "<strong class=\"line\">" + d.line_code + "</strong> (code ligne <a target=\"_blank\" title=\"rfn ligne " + d.line_code + " wikipédia\" href=\"https://google.com/search?q=rfn%20ligne%20" + d.line_code + "%20wikipédia\">effectuer une recherche</a>)";
                        });
                    infoDiv.append("p").attr('class', 'bottom').html("Vous pouvez avoir plus d'informations en effectuant une recherche approfondie de cette gare sur <a target=\"_blank\" title=\"france gare " + station.uic_code + " wikipédia\" href=\"https://google.com/search?q=france%20gare%20" + station.uic_code + "%20wikipédia\">Google</a>.");
                });
            }

            event.stopPropagation();
        });
});
