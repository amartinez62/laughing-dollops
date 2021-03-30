

function formatDate(timestamp) { 
  let date = new Date(timestamp);
  let today = date.getDate();

  let weekDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

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
  let thisMonth = months[date.getMonth()]; 
  let thisDay = weekDay[date.getDay()];
  
  return `${thisDay} ${thisMonth} ${today} ${formatHours(timestamp)}`;
}



function formatHours(timestamp) { 
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) { 
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  
  return `${hours}:${minutes}`;
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

function search(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input-text").value;
  searchCity(city)

}

function displayForecast(response) { 

  let forecastElement = document.querySelector("#forecast-list");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) { 
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-2">
      <h3>
        ${formatHours(forecast.dt * 1000)}
      </h3>
      <img
        src="http://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png"
      />
      <div class="weather-forecast-temperature">
        <strong>
          <span class="max-temp">${Math.round(forecast.main.temp_max)}</span>° /
        </strong>
        <span class="min-temp">${Math.round(forecast.main.temp_min)}</span>°
      </div>
    </div>
  `
    
  }
}

function searchCity(city) { 
  let apiKey = "37c42d4714983ec5cfa2a15822f9a984";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showCurrentWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function showCurrentWeather(response) {
  let cityElement = document.querySelector("h1");
  let tempElement = document.querySelector(".temperature");
  let skyElement = document.querySelector("#currentsky");
  let humidityElement = document.querySelector(".humidity");
  let windElement = document.querySelector(".wind-speed");
  let iconElement = document.querySelector("#icon");
  let dateElement = document.querySelector("#date");

  celsiusTemp = response.data.main.temp;

  cityElement.innerHTML = response.data.name;
  tempElement.innerHTML = Math.round(response.data.main.temp);
  skyElement.innerHTML = response.data.weather[0].main;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
 }

function findPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "37c42d4714983ec5cfa2a15822f9a984";
  let units = "metric";
  let geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(geoUrl).then(showCurrentWeather);

  geoUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(geoUrl).then(displayForecast);
}

function getCurrentLoc(event) { 
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(findPosition);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temp = document.querySelector(".temperature");

  tempCelsius.classList.remove("active");
  tempFahrenheit.classList.add("active");

  let temperatureToFahrenehit = (celsiusTemp * 9) / 5 + 32;
  temp.innerHTML = Math.round(temperatureToFahrenehit);

  let forecastMax = document.querySelectorAll(".max-temp");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
 
  
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let forecastMin = document.querySelectorAll(".min-temp");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  tempCelsius.addEventListener("click", convertToCelsius);
  tempFahrenheit.removeEventListener("click", convertToFahrenheit);
}

function convertToCelsius(event) {
  event.preventDefault();
  let temp = document.querySelector(".temperature");

  tempCelsius.classList.add("active");
  tempFahrenheit.classList.remove("active");

  temp.innerHTML = Math.round(celsiusTemp);

  let forecastMax = document.querySelectorAll(".max-temp");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  let forecastMin = document.querySelectorAll(".min-temp");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  tempCelsius.removeEventListener("click", convertToCelsius);
  tempFahrenheit.addEventListener("click", convertToFahrenheit);
}

let celsiusTemp = null;

let tempFahrenheit = document.querySelector("#fahrenheit-link");
tempFahrenheit.addEventListener("click", convertToFahrenheit);

let tempCelsius = document.querySelector("#celsius-link");
tempCelsius.addEventListener("click", convertToCelsius);

let buttonCurrentLocation = document.querySelector(".current-loc");
buttonCurrentLocation.addEventListener("click", getCurrentLoc);

searchCity("Denver"); 