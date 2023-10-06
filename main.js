import './style.css';
import "bootstrap/dist/css/bootstrap.min.css"; 
import { endpointPaises } from './endPoint';
import { endPointSelected } from './endPoint';
import {uniqBy, filter, orderBy, forEach, remove} from "lodash";
import { endPointCoordinates } from './endPoint';

const mainSection = document.querySelector('#mainSection');
const miSelect = mainSection.querySelector('.select-dinamico1');
const miSelect2 = mainSection.querySelector('.select-dinamico2');
const info = document.querySelector('.info-country');
let codigoPaises = [];

const fetchData = (url) => {
  return fetch(url).then((data) => {
    if(!data.ok) {
      throw new Error(`HTTP error! Status: ${data.status}`);
    }
    return data.json();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  miSelect.innerHTML = "<option disabled selected>Selecciona una Región</option>";
  miSelect2.innerHTML = "<option disabled selected>Selecciona un País</option>";
  fetchData(endpointPaises)
  .then((regiones) => {
    
    const nonDuplicateRegions = uniqBy(regiones, 'region');
    const depuratedRegions =  remove(nonDuplicateRegions, (element) => {
      return element.region !== 'Antarctic';
    });
    const orderedRegions = orderBy(depuratedRegions, ['region'], ['asc']);
    const option = (data) => `
    <option value="${data.region}">${data.region}</option>`;
    orderedRegions.forEach((element) => {
      miSelect.innerHTML += option(element);
    });
    miSelect.addEventListener("change", (e) => {
      /* e.preventDefault(); */
      miSelect2.innerHTML = "";
      miSelect2.innerHTML = "<option disabled selected>Selecciona un País</option>";
      const filteredCountries = filter(regiones, (data) => data.region === e.target.value);
      const orderedCountires = orderBy(filteredCountries, ['name.common'], ['asc']);
      orderedCountires.forEach((element) => {
        codigoPaises.push({name: element.name.common, code: element.cca3});
      });

      const option2 = (data) => `
      <option value="${data.name.common}">${data.name.common}</option>`;
     
      orderedCountires.forEach((element) => {
        miSelect2.innerHTML += option2(element);
      })
    })
  })
  .catch(error => {
    console.log(error);
  });
})

miSelect2.addEventListener("change", (e) => {
  /* e.preventDefault(); */
  const pais = e.target.value;
  fetchData(endPointSelected(pais))
  .then((data) => {
    const dataCountry = ([{name, flags, population, region, capital, languages, currencies, borders, area, latlng}]) => {
      let stringBorders = "";
      let stringBordersComplete =[];
      let currencyName = "";
      let currencySymbol = "";
      let stringLanguages = [];
      if(borders) {
        stringBorders = Object.values(borders);
        forEach(codigoPaises, (element) => {
          forEach(stringBorders, (e) => {
            if(e === element.code) {
              stringBordersComplete.push(element.name);
            }
          });
        });
        stringBordersComplete = stringBordersComplete.join(', ');
      } else {
        stringBordersComplete = 'No borders';
      }
      if(currencies) {
        currencyName = Object.entries(currencies)[0][1].name;
        currencySymbol = Object.entries(currencies)[0][1].symbol;
      } else {
        currencyName = 'No currencies';
        currencySymbol = 'No symbol';
      }
      if(languages) {
        forEach(languages, (e) => {
          stringLanguages.push(e);
        });
        stringLanguages = stringLanguages.join(', ');
      } else {
        stringLanguages = 'No languages';
      }
      const urlMap = endPointCoordinates(latlng[1], latlng[0]);
    return `<article class= "col-4">
      <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
         <div class="col-md-4 px-2 align-self-center">
          <img src="${flags.png}" class="img-fluid rounded-start border border-dark-subtle" alt="${name.common} flag.">
         </div>
         <div class="col-md-8">
          <div class="card-body">
           <h3 class="card-title text-center">${name.common}</h3>
           <p class="card-text">Localized in the ${region} region, ${name.common} is a country with a population of ${population.toLocaleString()} inhabitants. The capital city is ${capital}. The main spoken language(s) is/are ${stringLanguages}. The currency is the ${currencyName}, with the symbol of ${currencySymbol}. This country has an area of ${area.toLocaleString()} km2.</p>
           <p class="card-text"><small class="text-body-secondary">${name.common} has the following country borders: ${stringBordersComplete}.</small></p>
          </div>
        </div>
       </div>
      </div>  
    </article>
    <article class= "col-4">
      <div class="card mb-3" style="max-width: 540px;">
        <div class="card-body">
            <h3 class="card-title text-center">${name.common} in the World</h3>
        </div>
        <img src="${urlMap}">
     </div>
    </article>
    `;
    }
    
    info.innerHTML = dataCountry(data);
  })
  .catch(error => {
    console.log(error);
  })
})