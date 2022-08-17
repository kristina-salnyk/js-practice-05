import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

function searchInputHandler(event) {
  const countryName = event.target.value.trim();
  if (!countryName) return;

  clearCountriesMarkup();

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10)
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      else if (countries.length === 1) renderCountryInfo(countries);
      else renderCountriesList(countries);
    })
    .catch(error => {
      // Not found error
      if (Number(error.message) === 404)
        Notify.failure('Oops, there is no country with that name.');
      // Another error
      else Notify.failure('Failed to get data, please try again later.');
    });
}

function renderCountriesList(countries) {
  refs.countryList.innerHTML = countries
    .map(country => {
      return `
          <li class="country-list__item">
            <img src="${country.flags.svg}" width="50" height="30" alt="Flag of ${country.name.official}"/>
            <p>${country.name.official}</p>
          </li>
      `;
    })
    .join('');
}

function renderCountryInfo(countries) {
  refs.countryInfo.innerHTML =
    `
    <h1 class="country-info__title">
    <img src="${countries[0].flags.svg}" width="100" height="60" alt="Flag of ${countries[0].name.official}"/>` +
    `${countries[0].name.official}</h1>
    <p><span>Capital:</span> ${countries[0].capital}</p>
    <p><span>Population:</span> ${countries[0].population}</p>
    <p><span>Languages:</span> ${Object.values(countries[0].languages).join(
      ', '
    )}</p>
`;
}

function clearCountriesMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

refs.searchInput.addEventListener(
  'input',
  debounce(searchInputHandler, DEBOUNCE_DELAY)
);
