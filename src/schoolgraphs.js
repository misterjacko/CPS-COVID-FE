function processSchool(schoolName){
    getDailyTotals(schoolName);
}

function getSchoolName() {
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    var schoolName =  temp[1].replaceAll("_", " ");
    return schoolName;
}

function getSpanLength(){
    var parameters = location.search.substring(1).split("&");
    if (parameters.length == 4) {
        return parameters[3].split("=")[1]
    } else {
        return 0
    }
}

function changeSpan(n) {
    url = location.href.split("?")[0];
 
    parameters = location.search.substring(1).split("&");
    if (parameters.length == 4){
        parameters.pop()
    }
    parameters = parameters.join("&")
    window.location.href = url + "?" + parameters + "&span=" + n;
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

var schoolInfo = d3.select("#schoolInfo");
var lastCaseReported = d3.select("#lastCaseReported");
var total7Day = d3.select("#total7Day");
var total14Day = d3.select("#total14Day");
var grandTotalCount = d3.select("#grandTotal");

function getDailyTotals(schoolName) {
    // d3.csv("https://cpscovid.com/data/newFormatTest.csv",
    d3.csv("./data/newFormatTest.csv",
        function(data) {            
            var dailyTotals = [];
            var total = parseInt(data[9][schoolName], 10); // 9 is index of total in csv
            var distance = data.length -1
            graphSpan = getSpanLength()
            if (graphSpan > distance-11){ // this increases with added columns before days start
                graphSpan = 0
            };

            switch(graphSpan) {
                case 0:
                case "0":
                case "sy":
                    caseSpan = distance-11; // this increases with added days before days start
                    break;
                default:
                    caseSpan = graphSpan;
                    break;

            };

            var j=0;
            for (var i = distance; j < caseSpan; i--) {
                if (graphSpan == "sy" && data[i].School == "20220614"){
                    break
                }
                var date = d3.timeParse("%Y%m%d")(data[i].School);
                cases = data[i][schoolName];
                dailyTotals.push({"date": date, "cases": cases, "total": total});
                total -= cases;
                j++;
            };
            // get sy total
            total = parseInt(data[9][schoolName], 10);
            var syStartCase = total;
            for (var i = distance; i > 0; i--) {
                if (data[i].School == "20220614") {
                    break
                };
                syStartCase -= data[i][schoolName];
            };

            // add school summary data:
            var formatDate = d3.timeFormat("%a %b %-d");

            // Add School Info
            var studentCount = data[3][schoolName]
            var vaxComplete = Math.round((data[4][schoolName]/studentCount) *1000)/10
            var vaxFirst = Math.round((data[5][schoolName]/studentCount) *1000) / 10
            var infoString = "Total Students: " + studentCount
            infoString = infoString + "  |  Fully Vaccinated: " + vaxComplete + "%"
            infoString = infoString + "  |  One Dose: " + vaxFirst + "%"
            if (studentCount != 0) {
                schoolInfo.append("text")
                .text(infoString)
            }else{
                schoolInfo.append("text")
                .text("No Students Recorded")
            }
            //Last Reported Cases
            var lastCaseReportedDate = "";
            var lastCaseReportedNumber = 0;
            for (var i = 0; i <= dailyTotals.length -1; i++) {
                if (dailyTotals[i].cases > 0){
                    lastCaseReportedDate = formatDate(dailyTotals[i].date);
                    lastCaseReportedNumber = dailyTotals[i].cases;
                    break;
                };
            };
            if (lastCaseReportedNumber == 1){
                lastCaseReported.append("text")
                .text("Last case " + lastCaseReportedDate)
            } else if (lastCaseReportedNumber > 1) {
                lastCaseReported.append("text")
                .text("Last cases " + lastCaseReportedDate)
            } else {
                lastCaseReported.append("text")
                .text("0 cases disclosed")
            }
            // 7 day total
            var total7 = parseInt(data[6][schoolName], 10);
            if (total7 == 1){
                total7Day.append("text")
                .text(total7 + " case in the last 7 days")
            } else if (total7 > 1) {
                total7Day.append("text")
                .text(total7 + " cases in the last 7 days")
            } else {
                total7Day.append("text")
                .text("0 cases in the last 7 days")
            }
            // 14 day total
            var total14 = parseInt(data[7][schoolName], 10);
            if (total14 == 1){
                total14Day.append("text")
                .text(total14 + " case in the last 14 days")
            } else if (total14 > 1) {
                total14Day.append("text")
                .text(total14 + " cases in the last 14 days")
            } else {
                total14Day.append("text")
                .text("0 cases in the last 14 days")
            }

            // grand total
            var grandTotal = total - syStartCase;
            if (grandTotal == 1){
                grandTotalCount.append("text")
                .text(grandTotal + " case Summer 22")
            } else if (grandTotal > 1) {
                grandTotalCount.append("text")
                .text(grandTotal + " cases Summer 22")
            } else {
                grandTotalCount.append("text")
                .text("0 cases Summer 22")
            }
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
            // add X label
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
            // .attr("width", 3)
            .attr("height", function(d) { return dailyHeight - yLeft(d.cases); });
            if (caseSpan <= 60) {
                dailyCase.selectAll('.bar')
                    .attr("width", 5)
            } else if (caseSpan <= 100) {
                dailyCase.selectAll('.bar')
                    .attr("width", 3)
            } else {
                dailyCase.selectAll('.bar')
                    .attr("width", 1)
            }
        }
    )
};
var schoolName = getSchoolName();
processSchool(schoolName);