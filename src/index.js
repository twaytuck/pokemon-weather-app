//GET DATE TIME INFO
//Set global variable for timestamp - used for date/time info
let timestamp = null;
//Set global variable for current hour - used for date/time info and for weather icon
let currentHour = null;
//Day of the week
let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
//Current month
let calendarMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function getDateTime(timestamp) {
  //Get date info
  let currentInfo = new Date(timestamp);
  let currentDay = currentInfo.getDay();
  let currentWeekDay = weekDays[currentDay];
  //Get current time info
  currentHour = currentInfo.getHours();
  currentHourAmPm = currentHour;
  //Current hours
  if (currentHourAmPm === 0) {
    currentHourAmPm = 12;
  } else if (currentHourAmPm > 12) {
    currentHourAmPm = currentHourAmPm - 12;
  }
  //Current minutes
  let currentMinute = currentInfo.getMinutes();
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }
  //Change day of the week and time
  let currentDayOfTheWeekTime = document.querySelector("#day-of-the-week-time");
  currentDayOfTheWeekTime.innerHTML = `${currentWeekDay} ${currentHourAmPm}:${currentMinute}`;
  //am or pm
  let amPM = document.querySelector("#am-pm");
  if ((currentHourAmPm) => 12) {
    amPM.innerHTML = "pm";
  } else {
    amPM.innerHTML = "am";
  }
  //Current month
  let currentMonth = calendarMonths[currentInfo.getMonth()];
  //Current date
  let currentDate = currentInfo.getDate();
  //Current Year
  let currentYear = currentInfo.getFullYear();
  //Change the month, date, year
  let currentMonthDateYear = document.querySelector("#month-date-year");
  currentMonthDateYear.innerHTML = `| ${currentMonth} ${currentDate}, ${currentYear}`;
}

//GET LIVE WEATHER DATA
//Set variables for API url
let apiKey = "7289d7c7b5f7a8f168b51954ee07d1a2";
let unit = "metric";
//Set HTML elements as variables
let h1 = document.querySelector("h1");
let provinceCity = document.querySelector(".province-country");
let todayCurrentTemperature = document.querySelector(
  "#today-current-temperature"
);
let windSpeedElement = document.querySelector("#wind-speed");
let humidityElement = document.querySelector("#humidity");
let searchField = document.querySelector("input");
//Set global variable for celsius temperature
let currentCel = null;

//Default = Calgary, Alberta, Canada
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Calgary&units=${unit}&appid=${apiKey}`;
function defaultConditions(response) {
  //Capture date/time info
  timestamp = response.data.dt * 1000;
  getDateTime(timestamp);
  //Capture current temp in Calgary
  let defaultTemperature = response.data.main.temp;
  //Make current temp available for fahrenheit/celsius conversion functions
  currentCel = defaultTemperature;
  //Round current temp and display in HTML
  let roundedDefaultTemp = Math.round(defaultTemperature);
  todayCurrentTemperature.innerHTML = roundedDefaultTemp;
  //Capture current Calgary windspeed, round it, convert it to km/h, and display in HTML
  let defaultWindSpeed = response.data.wind.speed;
  defaultWindSpeed = Math.round(defaultWindSpeed * 3.6);
  if (defaultWindSpeed > 24) {
    isWindy();
  }
  windSpeedElement.innerHTML = defaultWindSpeed;
  //Capture current Calgary humidity and display in HTML
  let defaultHumidity = response.data.main.humidity;
  humidityElement.innerHTML = defaultHumidity;
  //Capture and display current weather conditions including an icon
  let calgaryConditions = response.data.weather[0].main;
  if (calgaryConditions !== "Clouds") {
    getCurrentConditions(calgaryConditions);
  } else {
    let calgaryClouds = response.data.weather[0].description;
    getCurrentClouds(calgaryClouds);
  }
  //Get latitude and longitude and call forecast api function
  lat = response.data.coord.lat;
  lon = response.data.coord.lon;
  createForecastUrl(lat, lon);
}
//Send Get request to API for Calgary then run function to capture info
axios.get(apiUrl).then(defaultConditions);

//City Search
function localConditionsFromInput(response) {
  let status = response.status;
  //If get request returns an ok response
  if (status === 200) {
    //Capture date/time info
    timestamp = response.data.dt * 1000;
    getDateTime(timestamp);
    //Capture city name and change html
    let cityResponse = response.data.name;
    h1.innerHTML = cityResponse;
    //Capture country and display in html
    let countryResponse = response.data.sys.country;
    provinceCity.innerHTML = countryResponse;
    convertToCelsius();
    //Capture current temperature for searched city
    let temperatureFromInput = response.data.main.temp;
    //Make current temp available to fahrenheit/celsius conversion functions
    currentCel = temperatureFromInput;
    //Round the current temp and display in HTML
    let roundedTempFromInput = Math.round(temperatureFromInput);
    todayCurrentTemperature.innerHTML = roundedTempFromInput;
    //Capture current windspeed for searched city, round it, display in HTML
    let windSpeedFromInput = response.data.wind.speed;
    windSpeedFromInput = Math.round(windSpeedFromInput * 3.6);
    if (windSpeedFromInput > 24) {
      isWindy();
    } else {
      isNotWindy();
    }
    windSpeedElement.innerHTML = windSpeedFromInput;
    //Capture current humidity for searched city and display in HTML
    let humidity = response.data.main.humidity;
    humidityElement.innerHTML = humidity;
    //Capture current weather conditions and display including icon
    let conditionsFromInput = response.data.weather[0].main;
    if (conditionsFromInput !== "Clouds") {
      getCurrentConditions(conditionsFromInput);
    } else {
      let cloudsFromInput = response.data.weather[0].description;
      getCurrentClouds(cloudsFromInput);
    }
    //Get latitude and longitude and call forecast api function
    lat = response.data.coord.lat;
    lon = response.data.coord.lon;
    createForecastUrl(lat, lon);
  }
}
//Capture errors
function error() {
  if (error) {
    alert("Sorry, we don't know the weather for that city.");
  }
}
function go(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  //Capture city entered into search
  cityInput = cityInput.value;
  if (cityInput.length < 2) {
    alert("Please enter a city");
  } else {
    //Define url for API
    let apiUrlCityInput = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=${unit}&appid=${apiKey}`;
    //Get request to API then run function to capture conditions from searched city
    axios.get(apiUrlCityInput).then(localConditionsFromInput).catch(error);
  }
  //Clear search field
  searchField.value = "";
}
//Listen for Go button to be clicked
let form = document.querySelector("form");
form.addEventListener("submit", go);

//Geolocation
function getLocalConditions(response) {
  convertToCelsius();
  //Capture date/time info
  timestamp = response.data.dt * 1000;
  getDateTime(timestamp);
  //Capture local temperature
  let localTemperature = response.data.main.temp;
  //Make local temp available to fahrenheit/celsius conversion functions
  currentCel = localTemperature;
  //Round local temp and display in HTML
  let roundedLocalTemp = Math.round(localTemperature);
  todayCurrentTemperature.innerHTML = roundedLocalTemp;
  //Capture local humidity and display in HTML
  let localHumidity = response.data.main.humidity;
  humidityElement.innerHTML = localHumidity;
  //Capture local windspeed, round, and display in HTML
  let localWindspeed = response.data.wind.speed;
  localWindspeed = Math.round(localWindspeed * 3.6);
  if (localWindspeed > 24) {
    isWindy();
  } else {
    isNotWindy();
  }
  windSpeedElement.innerHTML = localWindspeed;
  //Capture local city name from API response and display in HTML
  let localCity = response.data.name;
  h1.innerHTML = localCity;
  //Capture local country from API response and display in HTML
  let localCountry = response.data.sys.country;
  provinceCity.innerHTML = localCountry;
  //Capture local weather conditions and display including icon
  let localConditions = response.data.weather[0].main;
  if (localConditions !== "Clouds") {
    getCurrentConditions(localConditions);
  } else {
    let localClouds = response.data.weather[0].description;
    getCurrentClouds(localClouds);
  }
}
//Capture local coordinates and define API url
function getLocation(position) {
  //Get latitude and longitude and call forecast api function
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  createForecastUrl(lat, lon);
  let apiUrlGeolocation = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrlGeolocation).then(getLocalConditions);
}
//To be run when Current Location button is clicked
function useCurrentLocation(event) {
  event.preventDefault();
  //Get local coordinates and run function to capture info
  navigator.geolocation.getCurrentPosition(getLocation);
  //Clears search field of any text
  searchField.value = "";
}
//Listen for Current Location button to be clicked
let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", useCurrentLocation);

//TEMPERATURE UNIT CONVERSIONS
//Make HTML elements variables
let celsius = document.querySelector("#celsius");
let fahrenheit = document.querySelector("#fahrenheit");
//Convert C to F
function convertToFahrenheit() {
  let currentFar = Math.round(currentCel * 1.8 + 32);
  todayCurrentTemperature.innerHTML = currentFar;
  //Apply "active" CSS to fahrenheit and "inactive" CSS to celsius
  fahrenheit.classList.add("active");
  fahrenheit.classList.remove("inactive");
  celsius.classList.remove("active");
  celsius.classList.add("inactive");
  //Change forecast info to fahrenheit
  axios.get(forecastApiUrl).then(getFarForecast);
}
//Convert F to C
function convertToCelsius() {
  todayCurrentTemperature.innerHTML = Math.round(currentCel);
  //Apply "inactive" CSS to fahrenheit and "active" CSS to celsius
  fahrenheit.classList.add("inactive");
  fahrenheit.classList.remove("active");
  celsius.classList.remove("inactive");
  celsius.classList.add("active");
  //Change forecast info to celsius
  axios.get(forecastApiUrl).then(getForecast);
}
//On click change between Fahrenheit and Celsius
fahrenheit.addEventListener("click", convertToFahrenheit);
celsius.addEventListener("click", convertToCelsius);

//WEATHER CONDITIONS
let conditions = {
  Thunderstorm: {
    title: "Thunderstorms",
    icon: `<i class="fas fa-bolt"></i>`,
    night: `<i class="fas fa-bolt"></i>`,
    pokemon: "Water, Electric, Bug",
    pokemonImage: null,
  },
  Drizzle: {
    title: "Drizzle",
    icon: `<i class="fas fa-cloud-rain"></i>`,
    night: `<i class="fas fa-cloud-rain"></i>`,
    pokemon: "Water, Electric, Bug",
    pokemonImage: null,
  },
  Rain: {
    title: "Rainy",
    icon: `<i class="fas fa-cloud-showers-heavy"></i>`,
    night: `<i class="fas fa-cloud-showers-heavy"></i>`,
    pokemon: "Water, Electric, Bug",
    pokemonImage: null,
  },
  Snow: {
    title: "Snowing",
    icon: `<i class="far fa-snowflake"></i>`,
    night: `<i class="far fa-snowflake"></i>`,
    pokemon: "Snow, Steel",
    pokemonImage: null,
  },
  Clear: {
    title: "Clear Sky",
    icon: `<i class="fas fa-sun"></i>`,
    night: `<i class="fas fa-moon"></i>`,
    pokemon: "Grass, Ground, Fire",
    pokemonImage: null,
  },
  Mist: {
    title: "Misty",
    icon: `<i class="fas fa-umbrella"></i>`,
    night: `<i class="fas fa-umbrella"></i>`,
    pokemon: "Water, Electric, Bug",
    pokemonImage: null,
  },
  Smoke: {
    title: "Smokey",
    icon: `<i class="fas fa-smog"></i>`,
    night: `<i class="fas fa-smog"></i>`,
    pokemon: "Fairy, Fighting, Poison",
    pokemonImage: null,
  },
  Haze: {
    title: "Haze",
    icon: `<i class="fas fa-smog"></i>`,
    night: `<i class="fas fa-smog"></i>`,
    pokemon: "Fairy, Fighting, Poison",
    pokemonImage: null,
  },
  Dust: {
    title: "Dust",
    icon: `<i class="fas fa-smog"></i>`,
    night: `<i class="fas fa-smog"></i>`,
    pokemon: "Fairy, Fighting, Poison",
    pokemonImage: null,
  },
  Fog: {
    title: "Fog",
    icon: `<i class="fas fa-smog"></i>`,
    night: `<i class="fas fa-smog"></i>`,
    pokemon: "Dark, Ghost",
    pokemonImage: null,
  },
  Sand: {
    title: "Sand",
    icon: `<i class="fas fa-exclamation"></i>`,
    night: `<i class="fas fa-exclamation"></i>`,
    pokemon: "Fairy, Fighting, Poison",
    pokemonImage: null,
  },
  Ash: {
    title: "Volcanic Ash",
    icon: `<i class="fas fa-exclamation"></i>`,
    night: `<i class="fas fa-exclamation"></i>`,
    pokemon: "Fairy, Fighting, Poison",
    pokemonImage: null,
  },
  Squall: {
    title: "Squall",
    icon: `<i class="fas fa-wind"></i>`,
    night: `<i class="fas fa-wind"></i>`,
    pokemon: "Water, Electric, Bug",
    pokemonImage: null,
  },
  Tornado: {
    title: "Tornado",
    icon: `<i class="fas fa-exclamation"></i>`,
    night: `<i class="fas fa-exclamation"></i>`,
    pokemon: "Water, Electric, Bug",
    pokemonImage: null,
  },
};

let currentConditionsElement = document.querySelector(
  "#current-weather-conditions"
);
let currentIconElement = document.querySelector("#current-icon");
let pokemonTypeElement = document.querySelector("#pokemon-type");
let pokemonImageElement = document.querySelector("#pokemon-image");

function getCurrentConditions(conditionsDescription) {
  if (conditions[conditionsDescription] !== undefined && currentHour < 20) {
    currentConditionsElement.innerHTML =
      conditions[conditionsDescription].title;
    currentIconElement.innerHTML = conditions[conditionsDescription].icon;
    pokemonTypeElement.innerHTML = conditions[conditionsDescription].pokemon;
    pokemonImageElement.innerHTML =
      conditions[conditionsDescription].pokemonImage;
  } else if (
    conditions[conditionsDescription] !== undefined &&
    currentHour >= 20
  ) {
    currentConditionsElement.innerHTML =
      conditions[conditionsDescription].title;
    currentIconElement.innerHTML = conditions[conditionsDescription].night;
    pokemonTypeElement.innerHTML = conditions[conditionsDescription].pokemon;
    pokemonImageElement.innerHTML =
      conditions[conditionsDescription].pokemonImage;
  }
}

function getCurrentClouds(cloudyConditions) {
  let cloudTitle = cloudyConditions;
  if (cloudTitle === "overcast clouds") {
    currentConditionsElement.innerHTML = "Cloudy";
    currentIconElement.innerHTML = `<i class="fas fa-cloud"></i>`;
    pokemonTypeElement.innerHTML = "Fairy, Fighting, Poison";
    pokemonImageElement.innerHTML = `<img  src="images/fairy.png" alt="Gardevoir class="pokemon-image" /> 
    <img src="images/fighting.png" alt="Machamp" class="pokemon-image" />`;
  } else if (cloudTitle !== "overcast clouds" && currentHour < 20) {
    currentConditionsElement.innerHTML = "Partly Cloudy";
    currentIconElement.innerHTML = `<i class="fas fa-cloud-sun"></i>`;
    pokemonTypeElement.innerHTML = "Normal, Rock";
    pokemonImageElement.innerHTML = `<img src="images/normal.png" alt="Snorlax" class="pokemon-image" />
                  <img src="images/rock.png" alt="Rhyperior" class="pokemon-image" />`;
  } else if (cloudTitle !== "overcast clouds" && currentHour >= 20) {
    currentConditionsElement.innerHTML = "Partly Cloudy";
    currentIconElement.innerHTML = `<i class="fas fa-cloud-moon"></i>`;
    pokemonTypeElement.innerHTML = "Normal, Rock";
    pokemonImageElement.innerHTML = `<img src="images/normal.png" alt="Snorlax" class="pokemon-image" />
                  <img src="images/rock.png" alt="Rhyperior" class="pokemon-image" />`;
  }
}

//FORECAST
let forecastApiUrl = null;
//Select forecast on HTML
let forecastElement = document.querySelector("#forecast");
let forecastIconElement = document.querySelector(".forecast-icon");

//Change forecast icons
function getForecastConditions(forecastConditions) {
  if (conditions[forecastConditions] !== undefined) {
    return conditions[forecastConditions].icon;
  }
}
function getForecastClouds(forecastClouds) {
  if (forecastClouds === "overcast clouds") {
    return `<i class="fas fa-cloud"></i>`;
  } else if (forecastClouds !== "overcast clouds") {
    return `<i class="fas fa-cloud-sun"></i>`;
  }
}
function getForecast(response) {
  forecastElement.innerHTML = null;
  for (let index = 1; index < 6; index++) {
    let forecast = response.data.daily[index];
    let forecastTimestamp = forecast.dt * 1000;
    let forecastInfo = new Date(forecastTimestamp);
    let forecastDay = forecastInfo.getDay();
    let forecastWeekDay = weekDays[forecastDay];
    let forecastMonth = calendarMonths[forecastInfo.getMonth()];
    let forecastDate = forecastInfo.getDate();
    let forecastYear = forecastInfo.getFullYear();
    let forecastTemp = forecast.temp.max;
    let forecastConditions = forecast.weather[0].main;
    let forecastIcon = null;
    if (forecastConditions !== "Clouds") {
      forecastIcon = getForecastConditions(forecastConditions);
    } else {
      let forecastClouds = forecast.weather[0].description;
      forecastIcon = getForecastClouds(forecastClouds);
    }
    forecastElement.innerHTML += `
                <div class="col forecast-day">
                  <h2 class="forecast-day-of-the-week">
                  ${forecastWeekDay}
                  </h2>
                  <h3 class="forecast-date">
                  ${forecastMonth} ${forecastDate}, ${forecastYear}
                  </h3>
                  <div class="forecast-icon">
                  ${forecastIcon}
                  </div>
                  <div class="five-temp">
                    <span id="day-5-temp">
                      ${Math.round(forecastTemp)}°
                    </span>
                    <span class="five-unit" id="day-5-unit"> C </span>
                  </div>
                </div>
                `;
  }
}
function createForecastUrl(lat, lon) {
  forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&
exclude=minutely,hourly&appid=${apiKey}`;
  axios.get(forecastApiUrl).then(getForecast);
}

function getFarForecast(response) {
  forecastElement.innerHTML = null;
  for (let index = 1; index < 6; index++) {
    let forecast = response.data.daily[index];
    let forecastTimestamp = forecast.dt * 1000;
    let forecastInfo = new Date(forecastTimestamp);
    let forecastDay = forecastInfo.getDay();
    let forecastWeekDay = weekDays[forecastDay];
    let forecastMonth = calendarMonths[forecastInfo.getMonth()];
    let forecastDate = forecastInfo.getDate();
    let forecastYear = forecastInfo.getFullYear();
    let forecastTemp = forecast.temp.max;
    let farForecastTemp = forecastTemp * 1.8 + 32;
    let forecastConditions = forecast.weather[0].main;
    let forecastIcon = null;
    if (forecastConditions !== "Clouds") {
      forecastIcon = getForecastConditions(forecastConditions);
    } else {
      let forecastClouds = forecast.weather[0].description;
      forecastIcon = getForecastClouds(forecastClouds);
    }
    forecastElement.innerHTML += `
                <div class="col forecast-day">
                  <h2 class="forecast-day-of-the-week">
                  ${forecastWeekDay}
                  </h2>
                  <h3 class="forecast-date">
                  ${forecastMonth} ${forecastDate}, ${forecastYear}
                  </h3>
                  <div class="forecast-icon">
                  ${forecastIcon}
                  </div>
                  <div class="five-temp">
                    <span id="day-5-temp">
                      ${Math.round(farForecastTemp)}°
                    </span>
                    <span class="five-unit" id="day-5-unit"> C </span>
                  </div>
                </div>
                `;
  }
}

//Windy Weather-Boosted Pokemon
let tooltipStyles = window.document.styleSheets[0];
let pokemonTooltipElement = document.querySelector(".pokemon-tooltip");
function isWindy() {
  pokemonTooltipElement.innerHTML = `
                    <i class="fas fa-exclamation-circle" id="windy-alert"></i>
                  <span class="pokemon-tooltip-text">
                    Your in-game weather may indicate "Windy." Weather-boosted
                    pokemon in windy conditions are: Dragon, Flying,
                    Psychic.</span
                  >
  `;
  tooltipStyles.insertRule(
    ".pokemon-tooltip { position: relative; display: inline - block;}",
    0
  );
  tooltipStyles.insertRule(
    ".pokemon-tooltip-text {visibility: hidden; width: 300px; background-color: rgba(252, 252, 252, 0.9); color: #757575; font-size: 14px; font-weight: 300; text-shadow: none; line-height: 15px; text-align: center; padding: 5px 0; border: solid #757575 1px; border-radius: 6px; position: absolute; z-index: 1; bottom: 100 %; right: 50 %; margin-right: -20px; opacity: 0; transition: linear 100ms;}",
    0
  );
  tooltipStyles.insertRule(
    ".pokemon-tooltip:hover .pokemon-tooltip-text {visibility: visible; opacity: 1;",
    0
  );
}

function isNotWindy() {
  pokemonTooltipElement.innerHTML = null;
  tooltipStyles.deleteRule(
    ".pokemon-tooltip { position: relative; display: inline - block;}",
    0
  );
  tooltipStyles.deleteRule(
    ".pokemon-tooltip-text {visibility: hidden; width: 300px; background-color: rgba(252, 252, 252, 0.9); color: #757575; font-size: 14px; font-weight: 300; text-shadow: none; line-height: 15px; text-align: center; padding: 5px 0; border: solid #757575 1px; border-radius: 6px; position: absolute; z-index: 1; bottom: 100 %; right: 50 %; margin-right: -20px; opacity: 0; transition: linear 100ms;}",
    0
  );
  tooltipStyles.deleteRule(
    ".pokemon-tooltip:hover .pokemon-tooltip-text {visibility: visible; opacity: 1;",
    0
  );
}
