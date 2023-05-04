/*
 
**displays 
-date,
-icon representation of weather conditions,
-temperature,
-wind speed, 
-humidity
 can click on a city in the search history
 again presented with current and future conditions for that city
*/
var dateDisplayEl = $('#date');
var searchEl = $("#search-button");
var clearEl = $("#clear-history");
var cityEl = $("#enter-city");
var historyEl = $("#history");
var todayEl = $('#todaysForcast');
var fiveDayEl = $('#fiveDayForcast');
const apiKey = '8c8966eafcdc8ec82547485bf56daaa6';
let today = dayjs();

var searchHistory = JSON.parse(localStorage.getItem("search")) || [];


function getLatLon(){
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityEl.val()}&appid=${apiKey}`; 
    //needs api call for this info to work

    console.log(requestUrl)
    fetch(requestUrl)
    .then(function (response) {
      return response.json();
      
    })
    .then(function (data) {
        getFiveDay(data.coord.lat, data.coord.lon);
        
        
    })
}

function getFiveDay(latitude, longitude){
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`; 
    
    //needs api call for this info to work

    console.log(requestUrl)
    fetch(requestUrl)
    .then(function (response) {
      return response.json();
      
    })
    .then(function (data) {
      console.log(data)
      displayToday(data)
    })
}
function displayDate() {
    var rightNow = dayjs().format('MMM DD, YYYY');
    dateDisplayEl.text(rightNow);
}
function displayToday(data) {
    todayEl.empty();
    //creates one div to display and loads it with html
    let newDiv = `<div class="weather-forecast" id="weather-forecast">
                    <div class="today" id="current-temp">
                        <img src="https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png" alt="weather icon" class="w-icon"/>
                        <div class="weather-item">
                            <div class="time"> ${data.city.name}</div>
                            <div class="date">${dayjs(data.list[0].dt_txt).format('MMM DD')}</div>
                            <div class="temp">${data.list[0].main.temp} F</div>
                            <div class="temp">Wind Speed: ${data.list[0].wind.speed} MPH</div>
                            <div class="temp">Humidity: ${data.list[0].main.humidity} %</div>
                        </div>
                    </div>
                    </div>`;
    todayEl.append(newDiv)
    fiveDayDisplay(data);
}
function fiveDayDisplay(data){
    fiveDayEl.empty();
    //creates 4 more days to display using api data
    for (let i = 8; i < data.list.length; i += 8 ){
        
    
    
       let newDiv = `<div class="weather-forecast" id="weather-forecast">
            <div class="weather-item">
                <div class="weather-forecast-item">
                    <div class="time"> ${data.city.name}</div>
                    <div class="date">${dayjs(data.list[i].dt_txt).format('MMM DD')}</div>                
                    <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="weather icon" class="w-icon">
                    <div class="date">Temp: ${data.list[i].main.temp} F</div>
                    <div class="date">Wind Speed: ${data.list[i].wind.speed} MPH</div>
                    <div class="date">Humidity: ${data.list[i].main.humidity} %</div>
                </div>
            </div>
        </div>`;
    
        fiveDayEl.append(newDiv)
    }
    
}



//search button
searchEl.click( function () {
    
    searchHistory.push(cityEl.val());
    console.log(searchHistory);
    seeHistory();
    localStorage.setItem("search", JSON.stringify(searchHistory));
    getLatLon();
    
    
    
    
})

// Clear History button
clearEl.click( function () {
    localStorage.clear();
    searchHistory = [];
    window.location.reload();
})
function seeHistory() {
    historyEl.empty();
    //loads up search history list
    for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("class", "text-center form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click", function () {
            cityEl.val(searchHistory[i])
            getLatLon();
        })
        historyEl.append(historyItem);
    }
}

seeHistory();
displayDate();



 