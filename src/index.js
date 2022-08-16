import './css/styles.css';

const DEBOUNCE_DELAY = 300;

function fetchCountries(name){
  return fetch(`https://restcountries.com/v3.1/name/${name}`);
}