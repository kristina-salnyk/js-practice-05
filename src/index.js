import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import countryInfo from './templates/country-info.hbs';
import countriesList from './templates/countries-list.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

function searchInputHandler(event) {
  const countryName = event.target.value.trim();
  if (!countryName) {
    clearCountriesMarkup();
    Notify.info('Please enter the name of the country.');
    return;
  }

  fetchCountries(countryName)
    .then(countries => {
      clearCountriesMarkup();

      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        return;
      }
      if (countries.length <= 10) {
        renderCountriesList(countries);
        return;
      }
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
  refs.countryList.innerHTML = countriesList(countries);
}

function renderCountryInfo(country) {
  const countryData = {
    ...country,
    languages: Object.values(country.languages).join(', '),
  };
  refs.countryInfo.innerHTML = countryInfo(countryData);
}

function clearCountriesMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

refs.searchInput.addEventListener(
  'input',
  debounce(searchInputHandler, DEBOUNCE_DELAY)
);
