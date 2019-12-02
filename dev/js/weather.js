const regeneratorRuntime = require("regenerator-runtime");

const API_key = '5192852c11d17a1f1fecee2048f9b89d';
const body = document.querySelector('body');
const form = body.querySelector('.city-form');
const cityField = form.querySelector('.city-field');
const unitButtons = form.querySelectorAll('input[name="units"]');
const resultsDisplayArea = document.querySelector('.results');
const cityDisplayArea = resultsDisplayArea.querySelector('.city');
const iconDisplayArea = resultsDisplayArea.querySelector('.icon i');
const tempDisplayArea = resultsDisplayArea.querySelector('.temp');
const minDisplayArea = resultsDisplayArea.querySelector('.min');
const maxDisplayArea = resultsDisplayArea.querySelector('.max');
const descDisplayArea = resultsDisplayArea.querySelector('.description');
const errorDisplayArea = body.querySelector('.error-message');
const progressBar = document.querySelector('.progress-bar-container');

function showError(data) {
  errorDisplayArea.innerHTML = data.message;
  body.className = '';
  progressBar.style.display = 'none';
  resultsDisplayArea.style.display = 'none';
  errorDisplayArea.style.display = 'block';
}

function showProgressBar() {
  progressBar.style.display = 'flex';
  resultsDisplayArea.style.display = 'none';
  errorDisplayArea.style.display = 'none';
}

function showWeather(data) {
  if (data) {
    cityDisplayArea.innerHTML = data.name;
    let visualData = getVisualData(data);
    iconDisplayArea.className = 'wi wi-' + visualData.icon;
    body.className = visualData.time + ' ' + visualData.icon;
    tempDisplayArea.innerHTML = Math.round(data.main.temp) + '&deg;';
    minDisplayArea.innerHTML = 'Min: ' + Math.round(data.main.temp_min) + '&deg;';
    maxDisplayArea.innerHTML = 'Max: ' + Math.round(data.main.temp_max) + '&deg;';
    descDisplayArea.innerHTML = data.weather[0].description;
    progressBar.style.display = 'none';
    resultsDisplayArea.style.display = 'block';
    errorDisplayArea.style.display = 'none';
  }
}

function getVisualData(result) {
  const date = new Date();
  const sunrise = new Date(result.sys.sunrise * 1000);
  const sunset = new Date(result.sys.sunset * 1000);
  let weatherIconID = '';
  let timeOfDay = '';
  if (date >= sunrise && date < sunset) {
    weatherIconID = `owm-day-${result.weather[0].id}`;
    timeOfDay = 'day';
  } else {
    weatherIconID = `owm-night-${result.weather[0].id}`;
    timeOfDay = 'night';
  }
  return {'icon': weatherIconID, 'time': timeOfDay};
}

function showWeatherByCity() {
  let city = cityField.value;
  let units = form.querySelector('input[name="units"]:checked').value;
  if (city && units) {
    var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=' + units + '&appid=' + API_key;
    getWeatherData(url).then(data => {
      showWeather(data);
    });
  }
}

function showWeatherByCoords(position) {
  let units = form.querySelector('input[name="units"]:checked').value;
  let url = 'https://api.openweathermap.org/data/2.5/weather'
    + '?lat=' + position.coords.latitude 
    + '&lon=' + position.coords.longitude
    + '&units=' + units + '&appid=' + API_key;
  getWeatherData(url).then(data => {
    showWeather(data);
  });
}

async function getWeatherData(url) {
  return fetch(url)
    .then(response => Promise.all([response.ok, response.json()]))
    .then(([responseOk, data]) => {
      if (responseOk) {
        return data;
      } else {
        if (data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('There was an error');
        }
      }
    })
    .catch(error => showError(error));
}

export {form, cityField, unitButtons, showProgressBar, showWeatherByCity, showWeatherByCoords};
