import {MDCTextField} from './mdc-textfield.js';
import {form as weatherForm, cityField, unitButtons, showProgressBar, showWeatherByCity, showWeatherByCoords} from './weather.js';

const textField = new MDCTextField(document.querySelector('.mdc-text-field'));

weatherForm.addEventListener('submit', function(e) {
  e.preventDefault();
  cityField.blur();
  if (cityField.value) {
    showProgressBar();
    showWeatherByCity();
  } else if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      showProgressBar();
      showWeatherByCoords(position);
    });
  }
});

for (var i = 0 ; i < unitButtons.length; i++) {
  unitButtons[i].addEventListener('change', function() {
    if (cityField.value) {
      showProgressBar();
      showWeatherByCity();
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        showProgressBar();
        showWeatherByCoords(position);
      });
    }
  });
}

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    showProgressBar();
    showWeatherByCoords(position);
  });
}
