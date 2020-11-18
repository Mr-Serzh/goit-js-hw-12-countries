import debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries';
import countryExamplesTpl from './templates/country-examples.hbs';
import countryCardTpl from './templates/country.hbs';

import { notice, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const inputEl = document.querySelector('.input-search');
const cardContainer = document.querySelector('.js-card-container');
let countryToSearch = '';

inputEl.addEventListener(
  'input',
  debounce(() => {
    onSearch();
  }, 500),
);

function onSearch() {
  countryToSearch = inputEl.value;
  console.log(countryToSearch);

  if (!countryToSearch) {
    clearMarkup();
    return;
  }

  fetchCountries.fetchCountries(countryToSearch)
    .then(checkingNumberOfCountries)
    .catch(onFetchError);
}

function checkingNumberOfCountries(countries) {
  if (countries.length > 10) {
    clearMarkup();
    tooManyCountries();
  } else if (countries.length <= 10 && countries.length > 1) {
    clearMarkup();
    renderMarkup(countryExamplesTpl, countries);    
  } else if (countries.length === 1) {
    clearMarkup();
    renderMarkup(countryCardTpl, countries[0]);
  } else {
    clearMarkup();
    noResult();
  }
}

function renderMarkup(template, countries) {
  const markup = template(countries);
  cardContainer.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  cardContainer.innerHTML = '';
}

function noResult() {
  error({
    text: 'No matches found!',
    delay: 1500,
    closerHover: true,
  });
}

function tooManyCountries() {
  notice({
    text: 'Too many matches found. Please enter a more specific query!',
    delay: 1500,
    closerHover: true,
  });
}

function onFetchError(error) {
  clearMarkup();
  console.log(error);
}