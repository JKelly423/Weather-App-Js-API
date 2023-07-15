import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./icon-map"

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather).catch(e => {
  //console.error(e)
  //alert("Error getting weather.")
})
// intl.datetimeformat just gives us the time of the current timezone we are in
// .then() returns to us a promise, res means result
// took out res and just put data because we aren't getting a response
// put .then(renderWeather) and deleted the rest
// put .catch on there in case something goes wrong

function renderWeather({current, daily, hourly}) {
  // use individual functions
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
  // remove blurred class
  document.body.classList.remove("blurred")
}

function setValue(selector, value, {parent = document} ={}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
  // started everything with data- so pass everything after that
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
  //document.querySelector("[data-current-temp]").textContent = current.currentTemp
  // Would need to do this ^^^ multiple times, make helper function instead
  currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp", current.currentTemp)
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  setValue("current-fl-high", current.highFeelsLike)
  setValue("current-fl-low", current.lowFeelsLike)
  setValue("current-wind", current.windSpeed)
  setValue("current-precip", current.precip)
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {weekday: "long"})
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
  dailySection.innerHTML = ""
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true)
    // makes sure it clones all of its children (clone a template)
    setValue("temp", day.maxTemp, { parent: element})
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element})
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.append(element)
  })
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {hour: "numeric"})
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = ""
  hourly.forEach(hour => {
    const element = hourRowTemplate.content.cloneNode(true)
    // makes sure it clones all of its children (clone a template)
    setValue("temp", hour.temp, { parent: element})
    setValue("fl-temp", hour.feelsLike, { parent: element})
    setValue("wind", hour.windSpeed, { parent: element})
    setValue("precip", hour.precip, { parent: element})
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element})
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element})
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
    hourlySection.append(element)
  })
}
