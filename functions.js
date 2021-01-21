

var mymap = L.map('mapid').setView([41.8249149, -87.6862769], 10.5);

// sets the size of the case dot
function dot(cases){
    var dotFile = "";
    if (cases == 0){
        dotFile = "green-dot.png";
    } else {
        dotFile = "red-dot.png";
    };
    cases += 4; //making the minimum marker size 4
    dotObj = L.icon({
        iconUrl: dotFile,
        iconSize:     [cases, cases], // size of the icon
        iconAnchor:   [cases/2, cases/2], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -cases] // point from which the popup should open relative to the iconAnchor
    });
    return dotObj;
};

var controlLayers = L.control.layers( null, null, {
    position: "topright",
    collapsed: false
}).addTo(mymap);

var Light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});
controlLayers.addBaseLayer(Light, 'Light');

var Dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});
controlLayers.addBaseLayer(Dark, 'Dark');

var Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
});
controlLayers.addBaseLayer(Watercolor, 'Watercolor');

var urlll = "https://s3.amazonaws.com/cpscovid.com/data/allCpsCovidData.csv"
var data = Papa.parse(urlll, {
    download: true,
    header: true, 
    dynamicTyping: true,
    transformHeader:function(h) {
        return h.trim();
    },
    complete: function(results) {
        console.log(results.data);
        for (var i in results.data) {
            
            var row = results.data[i];
            var popupStr = row.School + ': <br> Cases this Quarter:' + row["Q2 SY21"];
            var marker = L.marker([row.Latitude, row.Longitude], {
                title: row.School,
                icon: dot(row["Q2 SY21"])
            }).bindPopup(popupStr);
            
            marker.addTo(mymap);
            }
    }
});

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