const countries = document.querySelector('.countries');
const input = document.getElementById('search');

const daysMode = document.querySelector('.days__mode');
const countsMode = document.querySelector('.counts__mode');
const globalCases = document.querySelector('.global__cases');
const dailyCases = document.querySelector('.daily__cases');
const allCases = document.querySelector('.all__cases');
const thousandsCases = document.querySelector('.thousands__cases');

const arrowRight = document.querySelector ('.arrow__right');
const arrowLeft = document.querySelector ('.arrow__left');
const confirmed = document.querySelector ('.confirmed');
const deaths = document.querySelector ('.deaths');
const recovered = document.querySelector ('.recovered');

let responce;
let isGlobalCasesMode = true;
let isAllCasesMode = true;
let countClickArrow = 0;
let isConfirmedMode = true;
let isDeathCasesMode = false;
let isRecoveredMode = false;
let searchTerm = '';

const fetchData = async () => {
  responce = await fetch('https://corona.lmao.ninja/v2/countries').then(res => res.json());                 
};

const getInfo = async () => {

  await fetchData();

  responce.forEach(country => {
    if (country.country === 'MS Zaandam') {
      country.population = 76804;
    }
    if (country.country === 'Diamond Princess') {
      country.population = 28670;
    }
  });

  responce = responce.filter(country => country.country.toLowerCase().includes(searchTerm.toLowerCase()));

  if(isGlobalCasesMode && isAllCasesMode && isConfirmedMode) {
    responce.sort((a, b) => a.cases < b.cases ? 1 : -1);
    responce.forEach(country => createCards(country, country.cases));
  } 
  else if(!isGlobalCasesMode && isAllCasesMode && isConfirmedMode) {
    responce.sort((a, b) => a.todayCases < b.todayCases ? 1 : -1);
    responce.forEach(country => createCards(country, country.todayCases));
  }
  else if(isGlobalCasesMode && !isAllCasesMode && isConfirmedMode) {
    responce.sort((a, b) => Math.round((a.casesPerOneMillion / 10)) < Math.round((b.casesPerOneMillion / 10)) ? 1 : -1);

    responce.forEach(country => {
      let totalConfirmedPer100 = Math.round((country.casesPerOneMillion / 10));

      createCards(country, totalConfirmedPer100)
    });
  }
  else if(!isGlobalCasesMode && !isAllCasesMode && isConfirmedMode) {
    responce.sort((a, b) => Math.round((a.todayCases / a.population) * 100000) < Math.round((b.todayCases / b.population) * 100000) ? 1 : -1);
    
    responce.forEach(country => {
      let newConfirmedPer100 = Math.round((country.todayCases / country.population) * 100000);
      createCards(country, newConfirmedPer100);
    });
  }


  else if(isGlobalCasesMode && isAllCasesMode && isDeathCasesMode) {
    responce.sort((a, b) => a.deaths < b.deaths ? 1 : -1);
    responce.forEach(country => createCards(country, country.deaths));
  } 
  else if(!isGlobalCasesMode && isAllCasesMode && isDeathCasesMode) {
    responce.sort((a, b) => a.todayDeaths < b.todayDeaths ? 1 : -1);
    responce.forEach(country => createCards(country, country.todayDeaths));
  }
  else if(isGlobalCasesMode && !isAllCasesMode && isDeathCasesMode) {
    responce.sort((a, b) => Math.round((a.deaths / a.population) * 100000) < Math.round((b.deaths / b.population) * 100000) ? 1 : -1);
  
    responce.forEach(country => {
      let totalDeathsPer100 = Math.round((country.deaths / country.population) * 100000);
      createCards(country, totalDeathsPer100);
    });
  }
  else if(!isGlobalCasesMode && !isAllCasesMode && isDeathCasesMode) {
    responce.sort((a, b) => Math.round((a.todayDeaths / a.population) * 100000) < Math.round((b.todayDeaths / b.population) * 100000) ? 1 : -1);
  
    responce.forEach(country => {
      let newDeathsPer100 = Math.round((country.todayDeaths / country.population) * 100000);
      createCards(country, newDeathsPer100);
    });
  }


  else if(isGlobalCasesMode && isAllCasesMode && isRecoveredMode) {
    responce.sort((a, b) => a.recovered < b.recovered ? 1 : -1);
    responce.forEach(country => createCards(country, country.recovered));
  } 
  else if(!isGlobalCasesMode && isAllCasesMode && isRecoveredMode) {
    responce.sort((a, b) => a.todayRecovered < b.todayRecovered ? 1 : -1);
    responce.forEach(country => createCards(country, country.todayRecovered));
  }
  else if(isGlobalCasesMode && !isAllCasesMode && isRecoveredMode) {
    responce.sort((a, b) => Math.round((a.recovered / a.population) * 100000) < Math.round((b.recovered / b.population) * 100000) ? 1 : -1);
  
    responce.forEach(country => {
      let totalRecoveredPer100 = Math.round((country.recovered / country.population) * 100000);
      createCards(country, totalRecoveredPer100);
    });
  }
  else if(!isGlobalCasesMode && !isAllCasesMode && isRecoveredMode) {
    responce.sort((a, b) => Math.round((a.todayRecovered / a.population) * 100000) < Math.round((b.todayRecovered / b.population) * 100000) ? 1 : -1);
  
    responce.forEach(country => {
      let newRecoveredPer100 = Math.round((country.todayRecovered / country.population) * 100000);
      createCards(country, newRecoveredPer100);
    });
  }
};

//create elemets
const createCards = (country, numbers) => {
  const countryContainer = document.createElement('div');
  const countryInfo = document.createElement('div');
  const countryFlag = document.createElement('div');
  const countryName = document.createElement('div');
  const countryCases = document.createElement('div');  
  
  countryContainer.className = 'country__container';
  countryInfo.className = 'country__info';
  countryFlag.className = 'country__flag';
  countryName.className = 'country__name';
  countryCases.className = 'country__cases';

  countryName.innerText = country.country;
  countryCases.innerText = numbers;
  countryFlag.innerHTML = `<img src="${country.countryInfo.flag}" class="flag__img">`;

  countries.append(countryContainer);
  countryContainer.append(countryInfo, countryCases);
  countryInfo.append(countryFlag, countryName);
};

//change Switchers
const changeSwitchersDaysMode = () => {
  if(isGlobalCasesMode) {
    globalCases.classList.add('hide');
    dailyCases.classList.remove('hide');
    isGlobalCasesMode = false;
  } else if (!isGlobalCasesMode) {
    globalCases.classList.remove('hide');
    dailyCases.classList.add('hide');
    isGlobalCasesMode = true;
  }   
}

const changeSwitchersCasesMode = () => {
  if(isAllCasesMode) {
    allCases.classList.add('hide');
    thousandsCases.classList.remove('hide');
    isAllCasesMode = false;
  } else if (!isAllCasesMode) {
    allCases.classList.remove('hide');
    thousandsCases.classList.add('hide');
    isAllCasesMode = true;
  }
}

daysMode.addEventListener('click', () => {
  countries.innerHTML = '';
  changeSwitchersDaysMode();
  getInfo();
});

countsMode.addEventListener('click', () => {
  countries.innerHTML = '';
  changeSwitchersCasesMode();
  getInfo();
});

//change indicators
arrowRight.addEventListener('click', () => {
  if(countClickArrow === 0) {
    confirmed.classList.add('hide');
    deaths.classList.remove('hide');
    
    arrowLeft.classList.remove('unactive');

    countClickArrow = 1;
    isConfirmedMode = false;
    isDeathCasesMode = true;
  }

  else if(countClickArrow === 1) {
    deaths.classList.add('hide');
    recovered.classList.remove('hide');

    arrowRight.classList.add('unactive');

    countClickArrow = 2;
    isDeathCasesMode = false;
    isRecoveredMode = true;
  }

  countries.innerHTML = '';
  getInfo();
})

arrowLeft.addEventListener('click', () => {
  if(countClickArrow === 1) {
    confirmed.classList.remove('hide');
    deaths.classList.add('hide');

    arrowLeft.classList.add('unactive')

    countClickArrow = 0;
    isDeathCasesMode = false;
    isConfirmedMode = true;
  }  
  
  else if(countClickArrow === 2) {
    deaths.classList.remove('hide');
    recovered.classList.add('hide');

    arrowRight.classList.remove('unactive');

    countClickArrow = 1;
    isDeathCasesMode = true;
    isRecoveredMode = false;
  }

  countries.innerHTML = '';
  getInfo();
})

input.addEventListener('input', (event) => {
  searchTerm = event.target.value;

  countries.innerHTML = '';

  getInfo();
});

document.addEventListener ('DOMContentLoaded', () => {
  getInfo();
});
