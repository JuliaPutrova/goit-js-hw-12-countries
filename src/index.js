import './sass/main.scss';

import API from '../src/js/fetchCountries';
import cardCountry from '../src/templates/country-card';
import previewCardCountry from '../src/templates/preview-country';

import debounce from 'lodash.debounce';
import { error, notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  cardContainer: document.querySelector('.js-card-container'),
  searchForm: document.querySelector('.js-search-form'),
}

refs.searchForm.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
    const searchQuery = e.target.value;

    refs.cardContainer.innerHTML = '';

    if (searchQuery.length < 1 && searchQuery === " " && searchQuery=== ".")
        return;
    
    API.fetchCountries(searchQuery)
        .then(searchInfo)
        .catch(myNotice);
};

function searchInfo (countries) {
    if (countries.length > 10) {
        error({
            text: 'Too many matches found. Please enter a more specific query!',
            delay: 5000,
        });  
    };
    
     if (countries.status === 404) {
        errorMessage('Sorry, nothing was found for your query!');
            }
    if (countries.length > 1 && countries.length < 10) {
        refs.cardContainer.innerHTML = previewCardCountry(countries);
    };
    if (countries.length === 1) {
        refs.cardContainer.innerHTML = cardCountry(...countries);
    };
    
};

function errorMessage(message) {
    error ({
            title:`${message}`,
            delay: 2000,    
        });
}
const myNotice = () => {
        notice({
            text: 'Invalid entered value',
            delay: 2000,
        });
    }


