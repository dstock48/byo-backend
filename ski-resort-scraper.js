const fs = require('fs');
const Nightmare = require('nightmare');

const nightmare = Nightmare(); // 'show: true' makes the browser open so you can see the automation happening

const result = [];

const resortURLs = new Promise((res, rej) => {
  nightmare
    .goto('http://www.onthesnow.com/united-states/ski-resorts.html')
    .evaluate(() => {
      const resortList = document.querySelectorAll('.resortList tr .name a');

      const resortURLs = [];
      for (let i = 330; i < 336; i++) {
        const link = resortList[i].href;
        resortURLs.push(link);
      }

      return resortURLs;
    })
    .end()
    .then((data) => {
      res(data);
    })
    .catch((err) => {
      rej(err);
    });
});

resortURLs
  .then(urls => Promise.all(urls.map(e => scrapeResortData(e, result))).then(data => data))
  // .then(data => console.log(result))
  .then((result) => {
    const output = JSON.stringify(result, null, 2);

    fs.writeFile('resort-data.json', output, 'utf8', (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('New file created!');
    });
  })
  .catch(error => console.log(error));


function scrapeResortData(url, result) {
  return Nightmare()
    .goto(url)
    .wait(2000)
    .evaluate(() => {
      const resortTerrain = document.querySelector('#resort_terrain');
      const resortElevation = document.querySelector('#resort_elevation');
      const resortImportantDates = document.querySelector('#resort_impdates');

      // create empty array
      const resortInfo = {
        state_name: document.querySelector('.rel_regions a').textContent,
        resort_name: document.querySelector('.resort_name').textContent,
        trail_total: parseInt(resortTerrain.querySelector('ul:nth-child(2) li:first-child .value').textContent),
        projected_open_date: new Date(resortImportantDates.querySelector('li:nth-child(1) strong').textContent),
        annual_snowfall: parseInt(document.querySelectorAll('#resort_impdates ul li strong')[document.querySelectorAll('#resort_impdates ul li').length - 1].textContent),
        days_open_last_year: parseInt(resortImportantDates.querySelector('li:nth-child(2) strong').textContent),
        beginner_trail_percent: parseInt(resortTerrain.querySelector('.value.beginner').textContent) / 100,
        intermediate_trail_percent: parseInt(resortTerrain.querySelector('.value.intermediate').textContent) / 100,
        advanced_trail_percent: parseInt(resortTerrain.querySelector('.value.advanced').textContent) / 100,
        expert_trail_percent: parseInt(resortTerrain.querySelector('.value.expert').textContent) / 100,
        summit_elevation: parseInt(resortElevation.querySelector('.top .value').textContent),
        base_elevation: parseInt(resortElevation.querySelector('.bottom .value').textContent),
      };
      return resortInfo;
    })
    .end()
    .then((resort) => {
      result.push(resort);
      return resort;
    })
    .catch(err => console.log(err));
}
