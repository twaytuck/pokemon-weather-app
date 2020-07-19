//GET DATE TIME INFO
//Get date info
let currentInfo = new Date();
let currentHourAmPm = currentInfo.getHours();
//Get day of the week & time in am/pm
function insertDayTime() {
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
  let currentWeekDay = weekDays[currentInfo.getDay()];
  //Current hours
  if (currentHourAmPm === 0) {
    currentHourAmPm = 12;
  }
  if (currentHourAmPm > 12) {
    currentHourAmPm = currentHourAmPm - 12;
  }
  //Current minutes
  let currentMinute = currentInfo.getMinutes();
  currentMinute = currentMinute.toString();
  if (currentMinute.length === 1) {
    currentMinute = `0${currentMinute}`;
  }
  //Change day of the week and time
  let currentDayOfTheWeekTime = document.querySelector("#day-of-the-week-time");
  currentDayOfTheWeekTime.innerHTML = `${currentWeekDay} ${currentHourAmPm}:${currentMinute}`;
}

//Get am or pm
function insertAmPm(currentHourAmPm) {
  //am or pm
  let amPM = document.querySelector("#am-pm");
  if ((currentHourAmPm) => 12) {
    amPM.innerHTML = "pm";
  } else {
    amPM.innerHTML = "am";
  }
}

//Get month, date, year
function insertDate() {
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
  let currentMonth = calendarMonths[currentInfo.getMonth()];
  //Current Date
  let currentDate = currentInfo.getDate();
  //Current Year
  let currentYear = currentInfo.getFullYear();
  //Change the month, date, year
  let currentMonthDateYear = document.querySelector("#month-date-year");
  currentMonthDateYear.innerHTML = `| ${currentMonth} ${currentDate}, ${currentYear}`;
}

//insert current day, time, date information
function getCurrentDateInfo() {
  insertDayTime();
  insertAmPm();
  insertDate();
}
getCurrentDateInfo();

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

//Default = Calgary, Alberta, Canada
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Calgary&units=${unit}&appid=${apiKey}`;
function defaultConditions(response) {
  //Capture current temp in Calgary
  let defaultTemperature = response.data.main.temp;
  //Make current temp available for fahrenheit/celsius conversion functions
  window.currentCel = defaultTemperature;
  //Round current temp and display in HTML
  let roundedDefaultTemp = Math.round(defaultTemperature);
  todayCurrentTemperature.innerHTML = roundedDefaultTemp;
  //Capture current Calgary windspeed, round it, convert it to km/h, and display in HTML
  let defaultWindSpeed = response.data.wind.speed;
  defaultWindSpeed = Math.round(defaultWindSpeed * 3.6);
  windSpeedElement.innerHTML = defaultWindSpeed;
  //Capture current Calgary humidity and display in HTML
  let defaultHumidity = response.data.main.humidity;
  humidityElement.innerHTML = defaultHumidity;
}
//Send Get request to API for Calgary then run function to capture info
axios.get(apiUrl).then(defaultConditions);

//City Search
function localConditionsFromInput(response) {
  let status = response.status;
  //If get request returns an ok response
  if (status === 200) {
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
    window.currentCel = temperatureFromInput;
    //Round the current temp and display in HTML
    let roundedTempFromInput = Math.round(temperatureFromInput);
    todayCurrentTemperature.innerHTML = roundedTempFromInput;
    //Capture current windspeed for searched city, round it, display in HTML
    let windSpeedFromInput = response.data.wind.speed;
    windSpeedFromInput = Math.round(windSpeedFromInput * 3.6);
    windSpeedElement.innerHTML = windSpeedFromInput;
    //Capture current humidity for searched city and display in HTML
    let humidity = response.data.main.humidity;
    humidityElement.innerHTML = humidity;
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
  //Capture local temperature
  let localTemperature = response.data.main.temp;
  //Make local temp available to fahrenheit/celsius conversion functions
  window.currentCel = localTemperature;
  //Round local temp and display in HTML
  let roundedLocalTemp = Math.round(localTemperature);
  todayCurrentTemperature.innerHTML = roundedLocalTemp;
  //Capture local humidity and display in HTML
  let localHumidity = response.data.main.humidity;
  humidityElement.innerHTML = localHumidity;
  //Capture local windspeed, round, and display in HTML
  let localWindspeed = response.data.wind.speed;
  localWindspeed = Math.round(localWindspeed * 3.6);
  windSpeedElement.innerHTML = localWindspeed;
  //Capture local city name from API response and display in HTML
  let localCity = response.data.name;
  h1.innerHTML = localCity;
  //Capture local country from API response and display in HTML
  let localCountry = response.data.sys.country;
  provinceCity.innerHTML = localCountry;
}
//Capture local coordinates and define API url
function getLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
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
let day1temp = document.querySelector("#day-1-temp");
let day1Unit = document.querySelector("#day-1-unit");
let day2temp = document.querySelector("#day-2-temp");
let day2Unit = document.querySelector("#day-2-unit");
let day3temp = document.querySelector("#day-3-temp");
let day3Unit = document.querySelector("#day-3-unit");
let day4temp = document.querySelector("#day-4-temp");
let day4Unit = document.querySelector("#day-4-unit");
let day5temp = document.querySelector("#day-5-temp");
let day5Unit = document.querySelector("#day-5-unit");
//Change each C to F
function forecastUnitToFahrenheit() {
  day1Unit.innerHTML = "F";
  day2Unit.innerHTML = "F";
  day3Unit.innerHTML = "F";
  day4Unit.innerHTML = "F";
  day5Unit.innerHTML = "F";
}
//Change placeholder temps to F
function forecastTempToFahrenheit() {
  day1temp.innerHTML = "70°";
  day2temp.innerHTML = "72°";
  day3temp.innerHTML = "66°";
  day4temp.innerHTML = "59°";
  day5temp.innerHTML = "68°";
}
//Change each F to C
function forecastUnitToCelsius() {
  day1Unit.innerHTML = "C";
  day2Unit.innerHTML = "C";
  day3Unit.innerHTML = "C";
  day4Unit.innerHTML = "C";
  day5Unit.innerHTML = "C";
}
//Change placeholder temps to C
function forecastTempToCelsius() {
  day1temp.innerHTML = "21°";
  day2temp.innerHTML = "22°";
  day3temp.innerHTML = "19°";
  day4temp.innerHTML = "15°";
  day5temp.innerHTML = "20°";
}
//Convert all C to F
function convertToFahrenheit() {
  let currentCel = window.currentCel;
  let currentFar = currentCel * 1.8 + 32;
  let roundedFar = Math.round(currentFar);
  window.currentFar = currentFar;
  todayCurrentTemperature.innerHTML = roundedFar;
  fahrenheit.innerHTML = "<strong> F </strong>";
  celsius.innerHTML = "C";
  forecastUnitToFahrenheit();
  forecastTempToFahrenheit();
}
//Convert all F to C
function convertToCelsius() {
  let currentFar = window.currentFar;
  let currentCel = (currentFar - 32) / 1.8;
  let roundedCel = Math.round(currentCel);
  todayCurrentTemperature.innerHTML = roundedCel;
  celsius.innerHTML = "<strong> C </strong>";
  fahrenheit.innerHTML = "F";
  forecastUnitToCelsius();
  forecastTempToCelsius();
}
//On click change between Fahrenheit and Celsius
fahrenheit.addEventListener("click", convertToFahrenheit);
celsius.addEventListener("click", convertToCelsius);
