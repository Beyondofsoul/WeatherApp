const BASE_URL =
  'https://api.weatherapi.com/v1/current.json?key=d434f3b38044466b8ec52826240806&q=London&aqi=no';

const cityInfo = document.querySelector('.city-info');
const textInput = document.getElementById('text-input');

const submitBtn = document.getElementById('submit-button');
let store = {
  city: 'London',
  tempC: 0,
  text: '',
  isDay: 0,
  properties: {
    humidity: {},
    windMph: {},
    pressureC: {},
  },
};

async function fetchData() {
  const result = await fetch(`${BASE_URL}&query=${store.city}`);
  const data = await result.json();

  try {
    const {
      current: {
        temp_c: tempC,
        humidity,
        wind_mph: windMph,
        is_day: isDay,
        pressure_mb: pressureC,
        condition: { text },
      },
    } = data;

    store = {
      ...store,
      tempC,
      text,
      isDay,
      properties: {
        humidity: {
          title: 'humidity',
          value: `${humidity}%`,
        },
        windMph: {
          title: 'windMph',
          value: `${windMph} km/h`,
        },
        pressureC: {
          title: 'pressureC',
          value: `${pressureC}%`,
        },
      },
    };
  } catch (e) {
    console.log(e);
  }
}

function renderProperty(properties) {
  return Object.values(properties)
    .map(({ title, value }) => {
      return `<div class='property__info'>
      <div class="property-info__value">${title}</div>
      <div class="property-info__description">${value}</div>
    </div>`;
    })
    .join('');
}

function renderComponent({ city, tempC, isDay, text, properties }) {
  const containerClass = isDay === 1 ? 'is-day' : '';
  cityInfo.innerHTML = `<div class='container ${containerClass}'>
         <div class='top'>
            <div class = 'city-subtitle'>Weather Today in </div>
            <div class = 'city-title' id='city'>
            <span>${city}</span>
        </div>
        <div class='main'><div class = 'description'>${text}</div>
        <div class = 'city-info__title'>Temp ° ${tempC}</div></div>
        <div class='properties'>
        ${renderProperty(properties)}
        </div>
        </div>
        `;
}

function handleSubmit(e) {
  fetchData();
  e.preventDefault();
  const value = store.city;
  if (!store.city) return null;
  localStorage.setItem('query', value);
  textInput.value = '';
  renderComponent(store);
}
function handleInput(e) {
  store = {
    ...store,
    city: e.target.value,
  };
}

textInput.addEventListener('input', handleInput);
submitBtn.addEventListener('click', handleSubmit);

fetchData();
