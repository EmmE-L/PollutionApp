import './style.css';

//MAP AND MARKER SET
const mymap = L.map('map').setView([0, 0], 3);
const marker = L.marker([41, 41]).addTo(mymap);
const token = (process.env.API_KEY)

//MAP
const attribution =  '&copy;  <a  href="http://openstreetmap.org/copyright">OpenStreetMap</a>  contributors'; 
const  titleUrl  =  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';  
var  titles  =  L.tileLayer(titleUrl,  {attribution}); 

//WAQI MAP ICON
var  WAQI_URL    =  'https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=' + token;  
      var  WAQI_ATTR  =  'Air  Quality  Tiles  &copy;  <a  href="http://waqi.info">waqi.info</a>';  
      var  waqiLayer  =  L.tileLayer(WAQI_URL,  {attribution:  WAQI_ATTR});  


titles.addTo(mymap);
waqiLayer.addTo(mymap);

//GEOLOCATION FUNCTION
const geolocation = navigator.geolocation.getCurrentPosition(position => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

//LATITUDE AND LONGITUDE FUNCTION
async function getGeo() {


    marker.setLatLng([lat, lon], 8)
    mymap.setView([lat, lon], 8)

    document.getElementById('lat').textContent = 'Latitude: ' + lat;
    document.getElementById('lon').textContent = 'Longitude: ' + lon;


    //AQI
    const AQI = 'https://api.waqi.info/feed/geo:'+(lat)+';'+(lon)+'/?token=' + token;
    const res = await fetch (AQI);
    const searchAqi = await res.json();

    //ERROR GEOLOCATION

   if ( searchAqi.status != 'ok') {
     document.getElementById('error').textContent = 'Geolocation error'
    }
    //
    
    let aqiInfo = searchAqi.data.aqi;

    document.getElementById('aqi').textContent = aqiInfo;

    let styleColor = document.getElementById('aqi')

    if ( aqiInfo >= 0 && aqiInfo <= 50) {
        styleColor.style.background = "#1C9966" 
        styleColor.innerHTML = "GOOD" + '<br>' + 'Air Quality Index: ' + aqiInfo ;
    } else if (aqiInfo >= 51 && aqiInfo < 100) {
        styleColor.style.background = "#FFDE34" 
        styleColor.innerHTML = "MODERATE" + '<br>' + 'Air Quality Index: ' + aqiInfo;
    } else if (aqiInfo >= 101 && aqiInfo < 150) {
        styleColor.style.background = "#fd9933" 
        styleColor.innerHTML = "UNHEALTHY FOR SENSITIVE GROUPS" + '<br>' + 'Air Quality Index: ' + aqiInfo;
    } else if (aqiInfo >= 151 && aqiInfo < 200) {
        styleColor.style.background = "#CC1532 " 
        styleColor.innerHTML = "UNHEALTHY" + '<br>' + 'Air Quality Index: ' + aqiInfo;
    } else if (aqiInfo >= 201 && aqiInfo < 300) {
        styleColor.style.background = "#660099" 
        styleColor.innerHTML = "VERY UNHEALTHY" + '<br>' + 'Air Quality Index: ' + aqiInfo;
    } else if (aqiInfo >= 301) {
        styleColor.style.background = "#7E0823" 
        styleColor.innerHTML = "HAZARDOUS" + '<br>' + 'Air Quality Index: ' + aqiInfo;
    }

}

getGeo() 

});


//INPUT SEARCH FUNCTION

async function searchName() {


const search_url = 'https://api.waqi.info/feed/'+`${search.value}`+'/?token=' + token;
const response = await fetch (search_url);
const searchConsole = await response.json();

console.log(searchConsole.status)

//SEARCH ERROR

if (searchConsole.status != 'ok') {
        document.getElementById('error').textContent = '*Sorry, there is no result for your search ' + `${search.value}`;
    } else if (searchConsole.status === 'ok'){
        document.getElementById('error').textContent = ''
    }
//

let lat = searchConsole.data.city.geo[0];
let lon = searchConsole.data.city.geo[1];
let city = searchConsole.data.city.name;

marker.setLatLng([lat, lon], 8);
mymap.setView([lat, lon], 8);

document.getElementById('lat').textContent = 'Latitude: ' + lat;
document.getElementById('lon').textContent = 'Longitude: ' + lon;
document.getElementById('city').textContent = city;



//AQI SEARCH

const AQI = 'https://api.waqi.info/feed/geo:'+(lat)+';'+(lon)+'/?token='+ token;
    const res = await fetch (AQI);
    const searchAqi = await res.json();

    let aqiInfo = searchAqi.data.aqi;

    document.getElementById('aqi').textContent = aqiInfo

    let styleColor = document.getElementById('aqi')

    if ( aqiInfo > 0 && aqiInfo <= 50) {
        styleColor.style.background = "#1C9966" 
        styleColor.innerHTML = "GOOD" + '<br>' + 'Air Quality Index: ' + aqiInfo ;
    } else if (aqiInfo >= 51 && aqiInfo < 100) {
        styleColor.style.background = "#FFDE34" 
        styleColor.innerHTML = "MODERATE " + '<br>' + 'Air Quality Index: ' + aqiInfo;
    } else if (aqiInfo >= 101 && aqiInfo < 150) {
        styleColor.style.background = "#fd9933" 
        styleColor.innerHTML = "UNHEALTHY FOR SENSITIVE GROUPS" + '<br>' + 'Air Quality Index: ' + aqiInfo;
    } else if (aqiInfo >= 151 && aqiInfo < 200) {
        styleColor.style.background = "#CC1532" 
        styleColor.innerHTML = "UNHEALTHY" + '<br>' + 'Air Quality Index: ' + aqiInfo;
    } else if (aqiInfo >= 201 && aqiInfo < 300) {
        styleColor.style.background = "#660099" 
        styleColor.innerHTML = "VERY UNHEALTHY" + '<br>' + 'Air Quality Index: ' + aqiInfo;
    } else if (aqiInfo >= 301) {
        styleColor.style.background = "#7E0823" 
        styleColor.innerHTML = "HAZARDOUS" + '<br>' + 'Air Quality Index: ' + aqiInfo;
    }
}

//SEARCH EVENT

let search = document.getElementById('citysearch');
search.addEventListener('blur', searchName, false);

var input = document.getElementById("citysearch");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        searchName();
    }
});