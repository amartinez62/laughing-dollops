let today = new Date();
let day = today.getDate();
let time = today.getHours() + ":" + today.getMinutes();


  let weekDay = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  let thisDay = weekDay[today.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemeber",
    "October",
    "November",
    "December"
  ];
let thisMonth = months[today.getMonth()]; 
  
let dateTime = document.querySelector(".date-time");
dateTime.innerHTML = `${thisDay} ${thisMonth} ${day} ${time}`;

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

function search(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input-text").value;
  searchCity(city)

}

function searchCity(city) { 
  let apiKey = "37c42d4714983ec5cfa2a15822f9a984";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showCurrentWeather);
}

function showCurrentTemp(response) {
  console.log(response.data);
  let currentTemp = document.querySelector(".temperature");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
}

function showCurrentWeather(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector(".temperature").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#currentsky").innerHTML = response.data.weather[0].main;
  document.querySelector(".humidity").innerHTML = response.data.main.humidity;
  document.querySelector(".wind-speed").innerHTML = Math.round(response.data.wind.speed);
 }

function findPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "37c42d4714983ec5cfa2a15822f9a984";
  let units = "metric";
  let geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(geoUrl).then(showCurrentWeather);
}

function getCurrentLoc(event) { 
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(findPosition);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureToFahrenehit = document.querySelector(".temperature");
  let temp = temperatureToFahrenehit.innerHTML;
  temperatureToFahrenehit.innerHTML = Math.round((temp * 9) / 5 + 32);
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureToCelsius = document.querySelector(".temperature");
  let temp = temperatureToCelsius.innerHTML;
  temperatureToCelsius.innerHTML = Math.round(((temp - 32) * 5) / 9);
}

let tempFahrenheit = document.querySelector("#f");
tempFahrenheit.addEventListener("click", convertToFahrenheit);

let tempCelsius = document.querySelector("#c");
tempCelsius.addEventListener("click", convertToCelsius);

let buttonCurrentLocation = document.querySelector(".current-loc");
buttonCurrentLocation.addEventListener("click", getCurrentLoc);

searchCity("Denver"); 