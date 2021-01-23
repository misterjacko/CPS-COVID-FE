// set the dimensions and margins of the graph
var margin = {top: 10, right: 60, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

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
        var newdata = [];
        for (i = data.length - 7; i < data.length; i++) {
            newdata.push(data[i]);
        };
        data = newdata;
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width -5 ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
            .ticks(7));
        // add X lable
        svg.append("text")             
            .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Date");


      // Add Y axis
        var yLeft = d3.scaleLinear()
            .domain([0, (1.3 * d3.max(data, function(d) { return +d.running; }))])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(yLeft));
        // text label for the yLeft axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Cumulative Cases"); 
        svg.append("circle")
            .attr("cx", -49)
            .attr("cy", 150)
            .attr("r", 6)
            .style("fill", "green")

        var yRight = d3.scaleLinear()
            .domain([0, (1.3 * d3.max(data, function(d) { return +d.daily; }))])
            .range([ height, 0 ]);
        svg.append("g")
            .attr("transform", "translate(481,0)")
            .call(d3.axisRight(yRight));
        // text label for the yLeft axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 + width + 20)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("CPS Daily Cases"); 
        svg.append("circle")
            .attr("cx",width + 31)
            .attr("cy",145)
            .attr("r", 6)
            .style("fill", "red")

        // Daily case bars
        svg.selectAll('.bar')
            .data(data)
            .enter().append("rect")
            .style("fill", "red")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.date); })
            .attr("y", function(d) { return yRight(d.daily); })
            .attr("width", 5)
            .attr("height", function(d) { return height - yRight(d.daily); });

        // cumulative trend line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return yLeft(d.running) })
          )
    }
);