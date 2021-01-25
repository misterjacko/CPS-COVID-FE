//set default map view
var mymap = L.map('mapid').setView([41.8249149, -87.6862769], 10.5);


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
    };
};

// sets the size of the case dot
function dot(cases){
    var dotFile = "";
    if (cases == 0){
        dotFile = "./images/dot0.png";
    } else if (cases <= 1) {
        dotFile = "./images/dot1.png";
    } else if (cases <= 3) {
        dotFile = "./images/dot2.png";
    } else if (cases <= 10) {
        dotFile = "./images/dot3.png";
    } else if (cases <= 30) {
        dotFile = "./images/dot4.png";
    } else if (cases <= 100) {
        dotFile = "./images/dot5.png";
    };
    //making the minimum marker size 4
    cases = (cases + 12) + 1**(Math.sqrt(cases))
    dotObj = L.icon({
        iconUrl: dotFile,
        iconSize:     [cases, cases], // size of the icon
        iconAnchor:   [cases/2, cases/2], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -cases] // point from which the popup should open relative to the iconAnchor
    });
    return dotObj;
};

var scaleControlLayer = L.control({position: "topleft"});

scaleControlLayer.onAdd = function(){
    var div = L.DomUtil.create('div', 'myclass');
    div.innerHTML= "<img src='./images/scale.png'/>";
    return div;
}

scaleControlLayer.addTo(mymap);

var mapControlLayer = L.control.layers( null, null, {
    position: "topright",
    collapsed: false
}).addTo(mymap);

var Light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});
mapControlLayer.addBaseLayer(Light, 'Light');

var Dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});
mapControlLayer.addBaseLayer(Dark, 'Dark');

var Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
});
mapControlLayer.addBaseLayer(Watercolor, 'Watercolor');

var urlll = "https://s3.amazonaws.com/cpscovid.com/data/allCpsCovidData.csv"
var data = Papa.parse(urlll, {
    download: true,
    header: true, 
    dynamicTyping: true,
    transformHeader:function(h) {
        return h.trim();
    },
    complete: function(results) {
        for (var i in results.data) {
            var row = results.data[i];
            var popupStr = row.School + ': <br> Cases this Quarter:' + row["Q2 SY21"];
            var marker = L.marker([row.Latitude, row.Longitude], {
                title: row.School,
                icon: dot(row["Q2 SY21"])
            }).bindPopup(popupStr);
            marker.addTo(mymap);
            };
         
    }
    
});

//would like to eventually use actual chicago outline instead of coordinate box. 
// var chiLayer = new L.GeoJSON.AJAX("./data/Chicago.geojson");
// chiLayer.addTo(mymap);

// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}
// function to toggle between light and dark theme
function toggleTheme() {
   if (localStorage.getItem('theme') === 'theme-dark'){
        Light.addTo(mymap);
        setTheme('theme-light');
   } else {
       setTheme('theme-dark');
       Dark.addTo(mymap);
   }
}
// Immediately invoked function to set the theme on initial load
(function () {
   if (localStorage.getItem('theme') === 'theme-dark') {
       setTheme('theme-dark');
       Dark.addTo(mymap);
   } else {
       setTheme('theme-light');
       Light.addTo(mymap);
   }
})();