//set default map view
var mymap;
var timeLength = "7Total";
var caseData = true;
var relative = true;
var dot1Val = 0.5;
var dot2Val = 1;
var dot3Val = 2.5;
var dot4Val = 5;
// var myRenderer = L.canvas({ padding: 0.5, tolerance: 20 });

function validateDataCheckbox(uncheckbox) {
    document.getElementById(uncheckbox).checked = false;
    showPercent();
}

function showPercent() {
    percent = document.getElementsByClassName("percent")
    if (document.getElementById("showRelative").checked) {
        for (var i=0; i<percent.length; i++) {
            percent[i].innerText = "%";
        }
    } else {
        for (var i=0; i<percent.length; i++) {
            percent[i].innerText = "";
        }
    }
}

function pushUpdate() {
    timeLength = document.getElementById("timeSpan").value;
    // caseData =  document.getElementById("showCases").checked;
    relative =  document.getElementById("showRelative").checked;
    dot1Val = document.getElementById("dot1").value;
    dot2Val = document.getElementById("dot2").value;
    dot3Val = document.getElementById("dot3").value;
    dot4Val = document.getElementById("dot4").value;
    refreshMarkers();
}

function shuffleDots(number) {
    var thisDot = Number(document.getElementById("dot" + number).value);
    if (number == 4) {
        document.getElementById("dot" + (number+1) + "lower").innerText = "> " + thisDot;
    } else {
        document.getElementById("dot" + (number+1) + "lower").innerText = "> " + thisDot + " to ";
    }
    if (number < 4) {
        if (Number(document.getElementById("dot" + (number+1)).value) < thisDot) {
            document.getElementById("dot" + (number+1)).value = thisDot;
            shuffleDots(number+1);
        } 
    }
    if (number > 1) {

        if (Number(document.getElementById("dot" + (number-1)).value) > thisDot) {
            document.getElementById("dot" + (number-1)).value = thisDot;
            shuffleDots(number-1);
        } 
    }
}


function setMapView(lat, long, zoom) {
return L.map('mapid').setView([lat, long], zoom);
}

function makeACircle(lat,long){
    var size = 40;
    var circle = L.marker([lat, long], {
        icon: L.icon({
            iconUrl: "./images/circle.png",
            iconSize:     [size, size], // size of the icon
            iconAnchor:   [size/2, size/2] // point of the icon which will correspond to marker's location
        })
    });
    circle.addTo(mymap);
}

if (location.search.substring(1) != "") {
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[1].split("=");
    var lat = temp[1];
    var temp = parameters[2].split("=");
    var long = temp[1];
    mymap = setMapView(lat, long, 15);
    makeACircle(lat,long);
    // find school location. 
} else {
 mymap = setMapView(41.847131, -87.691600, 10.5);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//attempt to soom in on location and surrounding schools
function getLocation() { 
    // check to make sure geolocation is possible
    if (navigator.geolocation) { 
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        return navigator.geolocation.getCurrentPosition(success, error, options);
    } else { 
        console.log('Geolocation is not supported');
    } 
}; 

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};

function success(pos) { // need to add logic for if outside of a reasonable boundry (ie from spain)
    var query = pos.coords.latitude + ',' + pos.coords.longitude;
    console.log('coordinates: ' + query);
    if ((41.64147109473022 < pos.coords.latitude < 42.02603353279949) && ((-87.85188495068708 < pos.coords.longitude) && (pos.coords.longitude < -87.5169044489204))) {
        mymap.flyTo([pos.coords.latitude, pos.coords.longitude], 15);
        sleep(2000).then(() => {refreshMarkers(); });

    } else {
        alert('You are not close enough to Chicago. \n Zooming to your location would be pretty pointless.');
    };
};

// sets the size of the case dot
function dot(cases){
    var dotFile = "";

    if (mymap.getZoom() <= 10) {
        zoomMod = 0.7
    } else if (mymap.getZoom() >= 14) {
        zoomMod = 1.5
    } else {
        zoomMod  = 1
    }

    if (cases <= 0){
        dotFile = "./images/dot0.png";
        dotSize = (mymap.getZoom() * zoomMod - 6) + 1
    } else if (cases <= dot1Val) {
        dotFile = "./images/dot1.png";
        dotSize = (mymap.getZoom() * zoomMod - 6) + 5
    } else if (cases <= dot2Val) {
        dotFile = "./images/dot2.png";
        dotSize = (mymap.getZoom() * zoomMod - 6) + 10
    } else if (cases <= dot3Val) {
        dotFile = "./images/dot3.png";
        dotSize = (mymap.getZoom() * zoomMod - 6) + 15
    } else if (cases <= dot4Val) {
        dotFile = "./images/dot4.png";
        dotSize = (mymap.getZoom() * zoomMod - 6) + 20
    } else if (cases > dot4Val) {
        dotFile = "./images/dot5.png";
        dotSize = (mymap.getZoom() * zoomMod - 6) + 30
    };

    
    dotObj = L.icon({
        iconUrl: dotFile,
        iconSize:     [dotSize, dotSize], // size of the icon
        iconAnchor:   [dotSize/2, dotSize/2], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -dotSize] // point from which the popup should open relative to the iconAnchor
    });
    return dotObj;
};
function setDaySpan() {

    timeLength = document.getElementById("timeSpan").value;

    console.log(timeLength);
    refreshMarkers()
    titleLayer.remove();
    titleLayer.addTo(mymap);
}


var scaleHintLayer = L.control({position: "topleft"});
scaleHintLayer.onAdd = function(){
    var div = L.DomUtil.create('div', 'myclass');
    div.innerHTML= "<center>use +/- to set<br>dots to map scale<center>";
    div.style.backgroundColor = "white"
    div.style.padding = "5px"

    return div;
}
scaleHintLayer.addTo(mymap);

var scaleControlLayer = L.control({position: "topright"});
scaleControlLayer.onAdd = function(){
    var div = L.DomUtil.create('div', 'myclass');
    div.innerHTML= "<center>cpscovid.com<br>Custom Map</center>";
    return div;
}
scaleControlLayer.addTo(mymap);

var Light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(mymap);
var markerLayer = L.layerGroup()
    // var markers = L.markerClusterGroup()
// var AllDataurl = "https://cpscovid.com/data/allCpsCovidData.csv"
var AllDataurl = "./data/allCpsCovidData.csv"
function drawSchools(day_span){
    // var day_span = "7Total"
    var data = Papa.parse(AllDataurl, {
        download: true,
        header: true, 
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader:function(h) {
            return h.trim();
        },
        complete: function(results) {
            var dropdownList = [];
            for (var i in results.data) {
                var row = results.data[i];

                var schoolH = row.School.replaceAll(" ", "_");
                var linkstring = "?name="+schoolH+"&Lat="+row.Latitude+"&Long="+row.Longitude;
                var schoolObj = {School: row.School, SchoolURL: linkstring};
                if (row.Student_Count!=0){
                    var vax = Math.round((row.Vax_Complete/row.Student_Count)*1000)/10
                }
                
                dropdownList.push(schoolObj);

                // var rootURL = "https://cpscovid.com/school.html";
                // var rootURL = "cschool.html";
                var rootURL = "./school.html";

                var popupStr = '<a href="' + rootURL + linkstring + '">' + row.School + '</a>: <br>';
                popupStr += 'Total Cases: ' + row["gTotal"] + '<br>';
                popupStr += 'Past 7 Day\'s Cases: ' + row["7Total"] + '<br>';
                popupStr += 'Past 14 Day\'s Cases: ' + row["14Total"] + '<br>';
                if (row.Student_Count!=0){
                    popupStr += 'Students: ' + row.Student_Count+ '<br>';
                    popupStr += 'Students Vaccinated: ' + vax+ '%<br>';
                }
                case_val = row[day_span];

                if (relative) {
                    if (row.Student_Count!=0){
                        case_val = (case_val/row.Student_Count)*100
                        popupStr += 'Cases/Enrollment: ' + Math.round(case_val*10)/10 + '%<br>';
                    } else {
                        case_val = (case_val/1000)*100
                    }
                }
                
                var marker = L.marker([row.Latitude, row.Longitude], {
                    
                    title: row.School,
                    icon: dot(case_val)//
                }).bindPopup(popupStr);
                marker.addTo(markerLayer);
                
            };
            var dropDownBox = document.getElementById("schoolBox");
            for (var i in dropdownList){
                var schoolObj = dropdownList[i];
                var el = document.createElement("option");
                el.textContent = schoolObj.School;
                el.value = [schoolObj.SchoolURL];
                dropDownBox.appendChild(el);
            }
        }
        
    });
    markerLayer.addTo(mymap)
}

function refreshMarkers(){
    markerLayer.clearLayers();
    drawSchools(timeLength)
}
/*Zoom Control Click Managed*/
var bZoomControlClick = false;
mymap.on('zoomend',function(e){
    if(bZoomControlClick){
        refreshMarkers()
    }
    bZoomControlClick = false;
});     

var element = document.querySelector('a.leaflet-control-zoom-in');
L.DomEvent.addListener(element, 'click', function (e) {
    bZoomControlClick = true;
    $(mymap).trigger("zoomend");
});
var element1 = document.querySelector('a.leaflet-control-zoom-out');
L.DomEvent.addListener(element1, 'click', function (e) {
    bZoomControlClick = true;
    $(mymap).trigger("zoomend");
});

function gotoSchool(){
    var schoolURL = document.getElementById("schoolBox").value;
    // var rootURL = "https://cpscovid.com/school.html";
    // var rootURL = "file:///C:/Users/ondre/code/CPS-COVID/CPS-COVID-FE/src/school.html";
    var rootURL = "./school.html";

    window.location.href = rootURL + schoolURL;
}
drawSchools(timeLength)

//would like to eventually use actual chicago outline instead of coordinate box. 
// var chiLayer = new L.GeoJSON.AJAX("./data/Chicago.geojson");
// chiLayer.addTo(mymap);