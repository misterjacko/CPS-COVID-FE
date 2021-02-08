
function processSchool(){
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    var school = temp[1].replaceAll("_", " ");
    document.getElementById("schoolName").innerHTML = school;
}
processSchool();

// generate info badge about the school. 