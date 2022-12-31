import "./style.css";
import { getWeather } from "./weather";
import { ICON_MAP } from "./iconMap";
// get time zone
// Intl.DateTimeFormat().resolvedOptions().timeZone

navigator.geolocation.getCurrentPosition(positionSuccess, positionFailure);

function positionSuccess({ coords }) {
  let lat = coords.latitude;
  let long = coords.latitude;

  getWeather(lat, long, Intl.DateTimeFormat().resolvedOptions().timeZone)
    .then(renderWeather)
    .catch((e) => console.error(e));
}
function positionFailure() {
  alert("Position failure");
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove("blurred");
}

function setValue(selector, value, { parent = document }) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function renderCurrentWeather(current) {
  const {
    currentTemp,
    maxTemp,
    minTemp,
    maxFeelsLike,
    minFeelsLike,
    windspeed,
    precip,
    iconCode,
  } = current;
  const img = document.querySelector(".header img");
  img.src = getIcon(ICON_MAP.get(iconCode));
  setValue("current-temp", currentTemp, document);
  setValue("current-high", maxTemp, document);
  setValue("current-fl-high", maxFeelsLike, document);
  setValue("current-wind", windspeed, document);
  setValue("current-low", minTemp, document);
  setValue("current-fl-low", minFeelsLike, document);
  setValue("current-precip", precip, document);
}

function renderDailyWeather(daily) {
  document.querySelector(".day-section").innerHTML = "";

  let content = "";

  daily.forEach((day) => {
    let weekDay = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      day.timestamp
    );
    content += `
    <div class="day-card">
      <img src=${getIcon(ICON_MAP.get(day.iconCode))} class="weather-icon" />
      <div class="day-card-day">${weekDay}</div>
      <div>${day.maxTemp}&deg;</div>
    </div>
    `;
  });
  document.querySelector(".day-section").innerHTML = content;
}

function renderHourlyWeather(hourly) {
  document.querySelector("[data-hour-section]").innerHTML = "";

  let content = "";

  hourly.forEach((hour) => {
    let hourTime = new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(
      hour.timestamp
    );
    let weekDay = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      hour.timestamp
    );
    content += `
    <tr class="hour-row">
        <td>
          <div class="info-group">
            <div class="label">${weekDay}</div>
            <div>${hourTime}</div>
          </div>
        </td>
        <td>
          <img src=${getIcon(
            ICON_MAP.get(hour.iconCode)
          )} class="weather-icon" />
        </td>
        <td>
          <div class="info-group">
            <div class="label">Temp</div>
            <div>${hour.maxTemp}&deg;</div>
          </div>
        </td>
        <td>
          <div class="info-group">
            <div class="label">FL Temp</div>
            <div>${hour.feelsLike}&deg;</div>
          </div>
        </td>
        <td>
          <div class="info-group">
            <div class="label">Wind</div>
            <div>${hour.windSpeed}<span class="value-sub-info">mph</span></div>
          </div>
        </td>
        <td>
          <div class="info-group">
            <div class="label">Precip</div>
            <div>${hour.precip}<span class="value-sub-info">in</span></div>
          </div>
        </td>
      </tr>
    `;
  });
  document.querySelector("[data-hour-section]").innerHTML = content;
}

function getIcon(iconCode) {
  return `./icons/${iconCode}.svg`;
}
