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
