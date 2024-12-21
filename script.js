const link =
  'https://api.weatherapi.com/v1/current.json?key=d434f3b38044466b8ec52826240806&q=London&aqi=no';

const cityInfo = document.querySelector('.city-info');
const textInput = document.getElementById('text-input');

const form = document.getElementById('form');
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
  const result = await fetch(`${link}&query=${store.city}`);
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

  renderComponent();
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

function markup() {
  const { tempC, properties, city, text, isDay } = store;

  const containerClass = isDay === 1 ? 'is-day' : '';
  return `<div class='container ${containerClass}'>
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
function renderComponent() {
  cityInfo.innerHTML = markup();
}
function handleSubmit(e) {
  e.preventDefault();
  const value = store.city;
  if (!store.city) return null;

  localStorage.setItem('query', value);
  fetchData();
}
function handleInput(e) {
  store = {
    ...store,
    city: e.target.value,
  };
}

textInput.addEventListener('input', handleInput);
form.addEventListener('click', handleSubmit);

fetchData();
