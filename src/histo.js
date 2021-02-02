// set the dimensions and margins of the graph
var margin = {top: 30, right: 60, bottom: 30, left: 60},
    width = 500 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var totalCase = d3.select("#totalCasesViz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("./data/CPStotals.csv",
// d3.csv("https://s3.amazonaws.com/cpscovid.com/data/CPStotals.csv",
    // format variables:
    function(d){
        return { 
            date : d3.timeParse("%Y%m%d")(d.date),
            running : d.running,
            daily : d.daily
        }
    },
    function(data) {
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width -5 ]);
        totalCase.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
            .ticks(7));

        // Add Title
        totalCase.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("District Total Cases");

        // add X lable
        totalCase.append("text")             
            .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Date");
      // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, (1.3 * d3.max(data, function(d) { return +d.running; }))])
            .range([ height, 0 ]);
        totalCase.append("g")
            .call(d3.axisLeft(y)
            .ticks(7));
        totalCase.append("g")
            .attr("transform", "translate(375,0)")
            .call(d3.axisRight(y)
            .ticks(7));  
        // text label for the yLeft axis
        totalCase.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Cumulative Cases"); 

        // cumulative trend line
        totalCase.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.running) })
            )
    }
);
/// Daily cases
var dailyMargin = {top: 30, right: 60, bottom: 30, left: 60},
    dailyWidth = 400 - dailyMargin.left - dailyMargin.right,
    dailyHeight = 200 - dailyMargin.top - dailyMargin.bottom;
// append the svg object to the body of the page
var dailyCase = d3.select("#dailyCasesViz")
    .append("svg")
        .attr("width", dailyWidth + dailyMargin.left + dailyMargin.right)
        .attr("height", dailyHeight + dailyMargin.top + dailyMargin.bottom)
    .append("g")
        .attr("transform","translate(" + dailyMargin.left + "," + dailyMargin.top + ")");

//Read the data
d3.csv("./data/CPStotals.csv",
// d3.csv("https://s3.amazonaws.com/cpscovid.com/data/CPStotals.csv",

    //  format variables:
    function(d){
        return { 
            date : d3.timeParse("%Y%m%d")(d.date),
            running : d.running,
            daily : d.daily
        }
    },
    function(data) {
        var newdata = [];
        //skips the first "day" which is an accumulation of all previous cases
        for (i = 1; i < data.length; i++) {
            newdata.push(data[i]);
        };
        data = newdata;
        // Add Title
        dailyCase.append("text")
            .attr("x", (dailyWidth / 2))             
            .attr("y", 0 - (dailyMargin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("District Daily Cases");

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, dailyWidth -5 ]);
        dailyCase.append("g")
            .attr("transform", "translate(0," + dailyHeight + ")")
            .call(d3.axisBottom(x)
            .ticks(7));
        // add X lable
        dailyCase.append("text")             
            .attr("transform", "translate(" + (dailyWidth/2) + " ," + (dailyHeight + dailyMargin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Date");

      // Add Y axis
        var yLeft = d3.scaleLinear()
            .domain([0, (1.3 * d3.max(data, function(d) { return +d.daily; }))])
            .range([ dailyHeight, 0 ]);
        dailyCase.append("g")
            .call(d3.axisLeft(yLeft)
            .ticks(5));    
        dailyCase.append("g")
            .attr("transform", "translate(281,0)")
            .call(d3.axisRight(yLeft)
            .ticks(5));    
        // text label for the yLeft axis
        dailyCase.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - dailyMargin.left * 0.8)
            .attr("x",0 - (dailyHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Daily Cases"); 
        
        // Daily case bars
        dailyCase.selectAll('.bar')
            .data(data)
            .enter().append("rect")
            .style("fill", "red")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.date); })
            .attr("y", function(d) { return yLeft(d.daily); })
            .attr("width", 5)
            .attr("height", function(d) { return dailyHeight - yLeft(d.daily); });
    }
);