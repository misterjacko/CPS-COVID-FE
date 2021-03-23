// Total Cases
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

// Daily cases
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

var newToday = d3.select("#newToday");
var lastCPSUpdate = d3.select("#lastCPSUpdate");
var Average7Days = d3.select("#Average7Day");

//Read the data
d3.csv("./data/CPStotals.csv",
    // format variables:
    function(d){
        return { 
            date : d3.timeParse("%Y%m%d")(d.date),
            running : +d.running,
            daily : +d.daily,
            Avg7Day : +d["7DayAvg"]
        }
    
    },
    function(data) {
        var cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90);
        console.log (cutoffDate);
        data = data.filter(function(d) {
            return d.date > cutoffDate;
        })
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width -5 ]);
        totalCase.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))//.ticks(7))
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

        // add district summary data:
        var formatDate = d3.timeFormat("%a %b %-d");
        // Yesterday's cases 

        yesterdayCases = data[data.length - 1].daily;
        yesterdayDate = data[data.length - 1].date;
        newToday.append("text")
            .text(yesterdayCases + " cases disclosed " + formatDate(yesterdayDate))
        
        // Last CPS Update
        var lastUpdateDate;
        for (var i = data.length -1; i>5; i--){
            if (data[i].daily != 0){
                lastUpdateDate = data[i].date;
                break
            }
        }
        lastCPSUpdate.append("text")
            .text("Last Update from CPS: " + formatDate(lastUpdateDate))

        // 7day Average
        function trendString(todayAvg, yesterdayAvg){
            if (todayAvg < yesterdayAvg) {
                return "(Decreasing)";
            } else if (todayAvg > yesterdayAvg) {
                return "(Increasing)";
            } else {
                return "(Holding Steady)";
            }
        }

        average = data[data.length - 1].Avg7Day;
        trendMsg = trendString(average, data[data.length - 2].Avg7Day)
        average = Math.round((average + Number.EPSILON) * 100) / 100;

        
        Average7Days.append("text")
            .text("7 Day Average: " + average + " " + trendMsg)

        // Add Title
        totalCase.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("District Total Cases (last 90 days)");

        // add X lable
        totalCase.append("text")             
            .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle");
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
            .text("Cases"); 

        // cumulative trend line
        totalCase.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.running) })
            )

        // Add Title
        dailyCase.append("text")
            .attr("x", (dailyWidth / 2))             
            .attr("y", 0 - (dailyMargin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("District Daily Cases (last 90 days)");

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
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
            .domain([0, (1.3 * d3.max(data, function(d) { return +d.daily; }))])
            .range([ dailyHeight, 0 ]);
        dailyCase.append("g")
            .call(d3.axisLeft(yLeft)
            .ticks(5));    
        dailyCase.append("g")
            .attr("transform", "translate(376,0)")
            .call(d3.axisRight(yLeft)
            .ticks(5));    
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
            .data(data)
            .enter().append("rect")
            .style("fill", "red")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.date); })
            .attr("y", function(d) { return yLeft(d.daily); })
            .attr("width", 3)
            .attr("height", function(d) { return dailyHeight - yLeft(d.daily); });
    }
);