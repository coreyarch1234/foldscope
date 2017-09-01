//Date conversion
// var date = //Whatever date you get from the request
var newDate, dateArray, month, newMonth, day, newDay, year, tempYear, newYear;
var monthDict = {
  "January": "1/",
  "February": "2/",
  "March": "3/",
  "April": "4/",
  "May": "5/",
  "June": "6/",
  "July": "7/",
  "August": "8/",
  "September": "9/",
  "October": "10/",
  "November": "11/",
  "December": "12/",
};
function convertMonth(month) {
  newMonth = monthDict[month];
  return newMonth;
}
function convertDay(day) {
  newDay = day.replace(",", "/");
  return newDay;
}
function convertYear(year) {
  tempYear = year.split("");
  newYear = tempYear[tempYear.length-2] + tempYear[tempYear.length-1];
  return newYear;
}

module.exports = function(date) {
    dateArray = date.split(" ");
    month = dateArray[0];
    day = dateArray[1];
    year = dateArray[2];
    newMonth = convertMonth(month);
    newDay = convertDay(day);
    newYear = convertYear(year);
    newDate = newMonth+newDay+newYear;
    return newDate;
}
