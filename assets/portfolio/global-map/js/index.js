"use strict";

var worldMapSrc = "https://raw.githubusercontent.com/moigithub/d3maplayout/master/world-50m.json";
var MeteorMapDataSrc = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";

var width = 960,
    height = 500;

var projection = d3.geo.mercator().center([0, 0]).scale(150);

var svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height);

var path = d3.geo.path().projection(projection);

var g = svg.append("g");

var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0).style("text-align", "center");

// load and display the World
d3.json(worldMapSrc, function (error, topology) {
  g.selectAll("path").data(topojson.object(topology, topology.objects.countries).geometries).enter().append("path").attr('fill', 'rgb(15,15,15)').attr("d", path).attr('stroke', 'white').attr('stroke-width', '.1');
});

d3.json(MeteorMapDataSrc, function (error, response) {
  var data = response.features;
  var array = [];

  for (var i = 0; i < data.length - 1; i++) {
    if (data[i].geometry !== null) {
      if (data[i].geometry.coordinates.length === 2) {
        if (data[i].properties.mass > 10000000) {
          data[i].properties.mass = 1000000;
        }
        array.push(data[i]);
      }
    }
  }

  plotMeteors(array);
});

var plotMeteors = function plotMeteors(array) {
  svg.selectAll("circles").data(array).enter().append("circle").attr('class', "dataPoint").attr("r", function (d) {
    return d.properties.mass / 35000;
  }).attr('stroke', 'red').attr("fill", "rgba(248, 39, 72, 0.3)").attr("transform", function (d) {
    return "translate(" + projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]) + ")";
  }).on("mouseover", function (d) {
    div.transition().duration(200).style("opacity", .9);
    div.html("Meteor Name: " + d.properties.name + ", Mass: " + d.properties.mass + ", Impact Coordinates: " + d.geometry.coordinates[0] + ", " + d.geometry.coordinates[1]).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 28 + "px");
  }).on("mouseout", function (d) {
    div.transition().duration(500).style("opacity", 0);
  });
};