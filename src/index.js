import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import API from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('input#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));

function searchCountries(evt) {
	evt.preventDefault();

	const searchQuery = inputEl.value.trim();

	clearEl();

	if (!searchQuery) {
   return;
	}

	API.fetchCountries(searchQuery)
   .then(renderCountryCard)
   .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, something went wrong!');
   });
}

function renderCountryCard(countries) {
	if (countries.length === 1) showCountry(countries[0]);
	else if (countries.length <= 10) showCountries(countries);
	else {
   Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
   );
	}
}

function showCountry(country) {
	countryInfoEl.innerHTML = countryMarkup(country);
}

function showCountries(countries) {
	countryListEl.innerHTML = countriesMarkup(countries);
}

function clearEl() {
	countryInfoEl.innerHTML = '';
	countryListEl.innerHTML = '';
}

function countryMarkup(country) {
	return `
      <img class="country-flag" src="${country.flags.svg}" alt="${country.name.common}" />
      <div>
			<h2 class="country-name">${country.name.official}</h2>
			<p></p><span class="label">Capital:</span> <span>${country.capital?.[0]}</span></p>
			<p><span class="label">Population:</span> <span>${country.population?.toLocaleString()}</span></p>
			<p><span class="label">Languages:</span> <span>${Object.values(country.languages).join(', ')}</span></p>
      </div>
	`;
}

function countriesMarkup(countries) {
	return countries
   .map(
      country => `
      <li>
			<img class="mini-flag" src="${country.flags.svg}" alt="${country.name.common}" />
			<span>${country.name.official}</span>
      </li>`
   )
   .join('');
}
