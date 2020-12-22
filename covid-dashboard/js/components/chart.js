/* eslint-disable no-undef */
const chartGlobal = document.getElementById('chart_global_id');
const globalCasesButton = document.querySelector('.chart__control_global');

const worldCases = document.querySelector('.chart__global');

const chartDaily = document.getElementById('chart_daily_id');
const dailyCasesButton = document.querySelector('.chart__control_daily');

const chartHundred = document.getElementById('chart_hundred_id');
const hundredCasesButton = document.querySelector('.chart__control_hundred');

const chartBtnContainer = document.querySelector('.chart__control');

const globalConfirmed = [];
const globalDeaths = [];
const globalRecovered = [];
const dateStage = [];
const rightDate = [];

const newConfirmed = [];
let lastDate = '';
const newRecovered = [];
const newDeaths = [];

let globalChartCreated;
let dailyChartCreated;
let hundredChartCreated;

let isShowChart = true;
let isHundredChart = true;

const worldPopulationPer100 = 78270;
const globalHundredConfirmed = [];
const globalHundredDeaths = [];
const globalHundredRecovered = [];

const todayHundredConfirmed = [];
const todayHundredDeaths = [];
const todayHundredRecovered = [];

const monthsNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formattedDate = (parseDate) => {
  const date = new Date(parseDate);
  return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
};

const sortData = () => {
  globalConfirmed.sort((a, b) => a - b);
  globalDeaths.sort((a, b) => a - b);
  globalRecovered.sort((a, b) => a - b);

  globalHundredConfirmed.sort((a, b) => a - b);
  globalHundredDeaths.sort((a, b) => a - b);
  globalHundredRecovered.sort((a, b) => a - b);

  todayHundredConfirmed.sort((a, b) => a - b);
  todayHundredDeaths.sort((a, b) => a - b);
  todayHundredRecovered.sort((a, b) => a - b);

  dateStage.sort();

  dateStage.forEach((el) => {
    rightDate.push(formattedDate(el));
  });
};

const globalChartAction = () => {
  if (!isShowChart || !isHundredChart) {
    chartDaily.classList.remove('active');
    worldCases.classList.add('active');
    chartHundred.classList.remove('active');
    isShowChart = true;
    isHundredChart = true;
  }
};

const dailyChartAction = () => {
  if (isShowChart || !isHundredChart) {
    worldCases.classList.remove('active');
    chartDaily.classList.add('active');
    chartHundred.classList.remove('active');
    isShowChart = false;
    isHundredChart = true;
  }
};

const createDailyChart = () => {
  dailyChartCreated = new Chart(chartDaily, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          label: 'Today`s Chart',
          backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f'],
          data: [newConfirmed, newRecovered, newDeaths],
        },
      ],
      labels: [
        'New Confirmed',
        'New Recovered',
        'New Deaths',
      ],
    },
    options: {
      title: {
        display: true,
        text: `Today\`s Cases: ${lastDate}`,
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  return dailyChartCreated;
};

const hundredChartAction = () => {
  if (isHundredChart) {
    worldCases.classList.remove('active');
    chartDaily.classList.remove('active');
    chartHundred.classList.add('active');
    isHundredChart = false;
  }
};

const createHundredChart = () => {
  hundredChartCreated = new Chart(chartHundred, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Global Per 100 Confirmed',
          data: globalHundredConfirmed,
          fill: false,
          borderColor: '#3e95cd',
          backgroundColor: '#3e95cd',
          borderWidth: 1,
        },
        {
          label: 'Global Per 100 Recovered',
          data: globalHundredRecovered,
          fill: false,
          borderColor: '#8e5ea2',
          backgroundColor: '#8e5ea2',
          borderWidth: 1,
        },
        {
          label: 'Global Per 100 Deaths',
          data: globalHundredDeaths,
          fill: false,
          borderColor: 'red',
          backgroundColor: 'red',
          borderWidth: 1,
        },
        {
          label: 'Today Per 100 Confirmed',
          data: todayHundredConfirmed,
          fill: false,
          borderColor: 'black',
          backgroundColor: 'black',
          borderWidth: 1,
        },
        {
          label: 'Today Per 100 Recovered',
          data: todayHundredRecovered,
          fill: false,
          borderColor: 'blue',
          backgroundColor: 'blue',
          borderWidth: 1,
        },
        {
          label: 'Today Per 100 Deaths',
          data: todayHundredDeaths,
          fill: false,
          borderColor: '#3cba9f',
          backgroundColor: '#3cba9f',
          borderWidth: 1,
        },
      ],
      labels: rightDate,
    },
    options: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 20,
          fontSize: 11,
          fontColor: 'darkslategray',
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  return hundredChartCreated;
};

const covidData = async () => {
  const response = await fetch('https://corona-api.com/timeline');
  const covidApiData = await response.json();

  const { data } = covidApiData;

  data.forEach((el) => {
    dateStage.push(el.date);
    globalConfirmed.push(el.confirmed);
    globalDeaths.push(el.deaths);
    globalRecovered.push(el.recovered);

    globalHundredConfirmed.push(Math.round(el.confirmed / worldPopulationPer100));
    globalHundredDeaths.push(Math.round(el.deaths / worldPopulationPer100));
    globalHundredRecovered.push(Math.round(el.recovered / worldPopulationPer100));

    todayHundredConfirmed.push(Math.round(el.new_confirmed / worldPopulationPer100));
    todayHundredDeaths.push(Math.round(el.new_deaths / worldPopulationPer100));
    todayHundredRecovered.push(Math.round(el.new_recovered / worldPopulationPer100));
  });

  newConfirmed.push(data[0].new_confirmed);
  newRecovered.push(data[0].new_recovered);
  newDeaths.push(data[0].new_deaths);
  lastDate += data[0].date;

  sortData();
  createDailyChart();
  createHundredChart();
};

const chartButtonActive = (event) => {
  const targetBtn = event.target;
  const activeBtn = document.querySelector('.open');

  if (targetBtn.getAttribute('class') === 'chart__control') {
    return;
  }

  if (activeBtn !== null) {
    activeBtn.classList.remove('open');
  }
  targetBtn.classList.add('open');
};

const createGlobalChart = async () => {
  worldCases.classList.add('active');

  await covidData();

  globalChartCreated = new Chart(chartGlobal, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Global Confirmed',
          data: globalConfirmed,
          fill: false,
          borderColor: '#3e95cd',
          backgroundColor: '#3e95cd',
          borderWidth: 1,
        },
        {
          label: 'Global Recovered',
          data: globalRecovered,
          fill: false,
          borderColor: '#8e5ea2',
          backgroundColor: '#8e5ea2',
          borderWidth: 1,
        },
        {
          label: 'Global Deaths',
          data: globalDeaths,
          fill: false,
          borderColor: '#3cba9f',
          backgroundColor: '#3cba9f',
          borderWidth: 1,
        },
      ],
      labels: rightDate,
    },
    options: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 50,
          fontColor: 'black',
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  return globalChartCreated;
};

globalCasesButton.addEventListener('click', () => globalChartAction());
dailyCasesButton.addEventListener('click', () => dailyChartAction());
hundredCasesButton.addEventListener('click', () => hundredChartAction());
chartBtnContainer.addEventListener('click', (event) => chartButtonActive(event));

createGlobalChart();
