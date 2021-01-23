// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("./data/CPStotals.csv",

  // When reading the csv, I must format variables:
    function(d){
        return { 
            date : d3.timeParse("%Y%m%d")(d.date),
            running : d.running,
            daily : d.daily
        }
    },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.running; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

      
    svg.selectAll('.bar')
    .data(data)
    .enter().append("rect")
    .style("fill", "red")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.date); })
    .attr("y", function(d) { return y(d.daily); })
    .attr("width", 50)
    .attr("height", function(d) { return height - y(d.daily); });

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.running) })
        )

    svg.append("circle").attr("cx", 430).attr("cy",35).attr("r", 6).style("fill", "green")
    svg.append("circle").attr("cx",430).attr("cy",65).attr("r", 6).style("fill", "red")
    svg.append("text").attr("x", 450).attr("y", 40).text("Total Cases").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 450).attr("y", 70).text("Daily Cases").style("font-size", "15px").attr("alignment-baseline","middle")
        

})