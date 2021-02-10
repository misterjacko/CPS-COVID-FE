function processSchool(){
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    var schoolName =  temp[1].replaceAll("_", " ");
    getDailyTotals(schoolName);
    return schoolName;
}

// total Cases
var margin = {top: 30, right: 60, bottom: 50, left: 60},
    width = 500 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var totalCase = d3.select("#totalCasesViz")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 500 200")
    .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

/// Daily cases
var dailyMargin = {top: 30, right: 60, bottom: 50, left: 60},
    dailyWidth = 500 - dailyMargin.left - dailyMargin.right,
    dailyHeight = 200 - dailyMargin.top - dailyMargin.bottom;
// append the svg object to the body of the page
var dailyCase = d3.select("#dailyCasesViz")
    .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 500 200")
    .append("g")
        .attr("transform","translate(" + dailyMargin.left + "," + dailyMargin.top + ")");

function getDailyTotals(schoolName) {
    d3.csv("./data/newFormatTest.csv",
        function(data) {            
            var dailyTotals = [];
            var total = parseInt(data[5][schoolName], 10);
            for (var i = data.length -1; i > 5; i--) {
                var date = d3.timeParse("%Y%m%d")(data[i].School);
                cases = data[i][schoolName];
                dailyTotals.push({"date": date, "cases": cases, "total": total});
                total -= cases;
            };

            // Add Title
            totalCase.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .style("text-decoration", "underline")  
                .text("School Total Cases");
            var x = d3.scaleTime()
                .domain(d3.extent(dailyTotals, function(d) { return d.date; }))
                .range([ 0, width -5 ]);
            totalCase.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");
            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, (1.3 * d3.max(dailyTotals, function(d) { return +d.total; }))])
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
                .text("Cases"); 

            // cumulative trend line
            totalCase.append("path")
                .datum(dailyTotals)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.total) }))        

            // Add Title
            dailyCase.append("text")
                .attr("x", (dailyWidth / 2))             
                .attr("y", 0 - (dailyMargin.top / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .style("text-decoration", "underline")  
                .text("School Daily Cases");

            // Add X axis --> it is a date format 
            var x = d3.scaleTime()
                .domain(d3.extent(dailyTotals, function(d) { return d.date; }))
                .range([ 0, dailyWidth -5 ]);
            dailyCase.append("g")
                .attr("transform", "translate(0," + dailyHeight + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");
            // add X lable
            dailyCase.append("text")             
                .attr("transform", "translate(" + (dailyWidth/2) + " ," + (dailyHeight + dailyMargin.top + 20) + ")")
                .style("text-anchor", "middle");

            // Add Y axis
            var yLeft = d3.scaleLinear()
                .domain([0, (1.3 * d3.max(dailyTotals, function(d) { return +d.cases; }))])
                .range([ dailyHeight, 0 ]);
            dailyCase.append("g")
                .call(d3.axisLeft(yLeft)
                .ticks(5));    
            dailyCase.append("g")
                .attr("transform", "translate(376,0)")
                .call(d3.axisRight(yLeft).ticks(5));    
            // text label for the yLeft axis
            dailyCase.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - dailyMargin.left * 0.8)
                .attr("x",0 - (dailyHeight / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Cases"); 
            
            // Daily case bars
            dailyCase.selectAll('.bar')
                .data(dailyTotals)
                .enter().append("rect")
                .style("fill", "red")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.date); })
                .attr("y", function(d) { return yLeft(d.cases); })
                .attr("width", 5)
                .attr("height", function(d) { return dailyHeight - yLeft(d.cases); });
        }
    )
};
var schoolName = processSchool();