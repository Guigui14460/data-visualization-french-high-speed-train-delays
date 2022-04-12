//  var width = 450
//   height = 450
//   margin = 40

//   var radius = Math.min(width, height) / 2 - margin


//   d3.select("svg").remove();


//   var svg = d3.select("#my_dataviz")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



//   // set the color scale
//   const color = d3.scaleOrdinal()
//     .range(d3.schemeSet2);

//   // Compute the position of each group on the pie:
//   const pie = d3.pie()
//     .value(function (d) { return d[1] })
//   const data_ready = pie(Object.entries(data))
//   // Now I know that group A goes from 0 degrees to x degrees and so on.

//   // shape helper to build arcs:
//   const arcGenerator = d3.arc()
//     .innerRadius(0)
//     .outerRadius(radius)

//   // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
//   svg
//     .selectAll('mySlices')
//     .data(data_ready)
//     .join('path')
//     .attr('d', arcGenerator)
//     .attr('fill', function (d) { return (color(d.data[0])) })
//     .attr("stroke", "black")
//     .style("stroke-width", "2px")
//     .style("opacity", 0.7)

//   // Now add the annotation. Use the centroid method to get the best coordinates
//   svg
//     .selectAll('mySlices')
//     .data(data_ready)
//     .join('text')
//     .text(function (d) { return d.data[0] })
//     .attr("transform", function (d) { return `translate(${arcGenerator.centroid(d)})` })
//     .style("text-anchor", "middle")
//     .style("font-size", 10)

const width = 1000, height = 900;

const path = d3.geoPath();

const projection = d3.geoMercator()
    .center([2.454071, 46.279229])
    .scale(3000)
    .translate([width / 2, height / 2]);

path.projection(projection);


const zoom = d3.zoom()
    .on('zoom', (event) => {
      svg.attr('transform', event.transform);
    })
    .scaleExtent([1, 8]);


const svg = d3.select('#map').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom)

const deps = svg.append("g");




const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
d3.json('../json/departments.json').then(function (geojson) {
    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("fill","white")
        .attr("stroke","black")
        .attr("d", path)
        

});



var request = "gare{name city geo}"

d3.json("http://localhost:4000/?query={" + request + "}").then(getData)

const p =svg.append("g")
function getData(root) {
    const gare = root.data.gare
    console.log(gare)
    p.selectAll("circle")
    .data(gare)
    .enter()
    .append("circle")
    .attr("cx",function(d){  return projection(d.geo)[0] })
    .attr("cy",function(d){ return projection(d.geo)[1] })
    .attr("r","2px")
    .attr("fill","green")
    .on("mouseover", function(event, d) {
        div.transition()        
            .duration(200)
            .style("opacity", .9);      
        div.html("Station : " + d.name + "<br/>"
              +  "ville : " + d.city)  
            .style("left", (event.pageX + 30) + "px")     
            .style("top", (event.pageY - 30) + "px")
    })
    .on("mouseout", function(event, d) {
        div.style("opacity", 0);
        div.html("")
            .style("left", "-500px")
            .style("top", "-500px");
    })
    .on("click", function(event,d) {
        d3.select("#start").attr("")        
    })
}

