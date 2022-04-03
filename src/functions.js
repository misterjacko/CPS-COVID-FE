//set default map view
var mymap;
var timeLength = "14Total";
// var myRenderer = L.canvas({ padding: 0.5, tolerance: 20 });

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
    if (cases <= 0){
        dotFile = "./images/dot0.png";
    } else if (cases <= 1) {
        dotFile = "./images/dot1.png";
    } else if (cases <= 3) {
    // } else if (cases <= 3) {
        dotFile = "./images/dot2.png";
    } else if (cases <= 10) {
    // } else if (cases <= 10) {
        dotFile = "./images/dot3.png";
    } else if (cases <= 30) {
    // } else if (cases <= 30) {
        dotFile = "./images/dot4.png";
    } else if (cases > 30) {
    // } else if (cases <= 100) {
        dotFile = "./images/dot5.png";
    };

    if (mymap.getZoom() <= 10) {
        zoomMod = 0.7
    } else if (mymap.getZoom() >= 14) {
        zoomMod = 1.5
    } else {
        zoomMod  = 1
    }
    if (cases <= 0){
        cases = (mymap.getZoom() * zoomMod - 6) + 1**(Math.sqrt(0))
    } else {
        cases = (mymap.getZoom() * zoomMod * 1.2) + (cases) + 1**(Math.sqrt(cases))
    }
    
    dotObj = L.icon({
        iconUrl: dotFile,
        iconSize:     [cases, cases], // size of the icon
        iconAnchor:   [cases/2, cases/2], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -cases] // point from which the popup should open relative to the iconAnchor
    });
    return dotObj;
};
function setDaySpan() {
    
    if (timeLength == "7Total") {
        timeLength = "14Total"
    } else {
        timeLength = "7Total"
    };
    console.log(timeLength);
    refreshMarkers()
    titleLayer.remove();
    titleLayer.addTo(mymap);
}
var titleLayer = L.control({position: "topright"});
titleLayer.onAdd = function(){
    var div = L.DomUtil.create('div', 'myclass');
    if (timeLength == "14Total") {
        div.innerHTML= `
        <center>
            *COVID-19 cases reported<br>
            in last 14 days<br>
            <div class="flex">
                    <div class="flex-auto  text-white font-bold bg-blue-700 hover:bg-blue-800 rounded p-1 cursor-pointer" onclick="setDaySpan()" id="rangeToggle">
                    Change to 7 days</div>
                    <div></div>
            </div>
        </center>
        `;
    } else {
        div.innerHTML= `
        <center>
            *COVID-19 cases reported<br>
            in last 7 days<br>
            <div class="flex">
                    <div class="flex-auto  text-white font-bold bg-blue-700 hover:bg-blue-800 rounded p-1 cursor-pointer" onclick="setDaySpan()" id="rangeToggle">
                   Change to 14 days </div>
                    <div></div>
            </div>
        </center>
        `;
        
    };

    // <button onclick='setDaySpan()'>Click</button>
    // div.style.backgroundColor = "white"
    div.style.padding = "5px"

    return div;
}
titleLayer.addTo(mymap);

var scaleHintLayer = L.control({position: "topleft"});
scaleHintLayer.onAdd = function(){
    var div = L.DomUtil.create('div', 'myclass');
    div.innerHTML= "<center>use +/- to set<br>dots to map scale<center>";
    div.style.backgroundColor = "white"
    div.style.padding = "5px"

    return div;
}
scaleHintLayer.addTo(mymap);

var scaleControlLayer = L.control({position: "topleft"});
scaleControlLayer.onAdd = function(){
    var div = L.DomUtil.create('div', 'myclass');
    div.innerHTML= "<img src='./images/scale.png'/>";
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
// var AllDataurl = "https://cpscovid.com/data/allCpsCovidDataVax.csv"
var AllDataurl = "https://cpscovid.com/data/allCpsCovidData.csv"
// var AllDataurl = "./data/allCpsCovidData.csv"
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
                var marker = L.marker([row.Latitude, row.Longitude], {
                    
                    title: row.School,
                    // icon: dot(row["gTotal"])//
                    icon: dot(case_val)//
                    // icon: dot(row["14Total"])//
                    //renderer: myRenderer
                }).bindPopup(popupStr);
                marker.addTo(markerLayer);
                // marker.addTo(mymap);
                
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