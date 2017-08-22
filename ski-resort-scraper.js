const fs = require('fs');
const Nightmare = require('nightmare');
const nightmare = Nightmare(); // 'show: true' makes the browser open so you can see the automation happening

const result = []

const resortURLs = new Promise((res, rej) => {
  nightmare
    .goto('http://www.onthesnow.com/united-states/ski-resorts.html')
    .evaluate(() => {
      const resortList = document.querySelectorAll('.resortList tr .name a')

      let resortURLs = []
        for (let i = 0; i < 10; i++) {
          let link = resortList[i].href
          resortURLs.push(link)
        }

      return resortURLs
    })
    .end()
    .then(data => {
      res(data)
    })
    .catch((err) => {
      rej(err)
    })
})

resortURLs
  .then(urls => Promise.all(urls.map(e => scrapeResortData(e, result))).then(data => data))
  // .then(data => console.log(result))
  .then(result => {
    const output = JSON.stringify(result, null, 2)

    fs.writeFile(`resort-data.json`, output, 'utf8', (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('New file created!');
    })
  })
  .catch( error => console.log(error) )




function scrapeResortData(url, result) {
  return Nightmare()
    .goto(url)
    .wait(2000)
    .evaluate(() => {
      let resortTerrain = document.querySelector('#resort_terrain');
      let resortElevation = document.querySelector('#resort_elevation');
      let resortImportantDates = document.querySelector('#resort_impdates');

      // create empty array
      let resortInfo = {
        resortName: document.querySelector('.resort_name').textContent,
        state: document.querySelector('.rel_regions a').textContent,
        annualSnowfall: parseInt(document.querySelectorAll('#resort_impdates ul li strong')[document.querySelectorAll('#resort_impdates ul li').length-1].textContent),
        trailTotal: parseInt(resortTerrain.querySelector('ul:nth-child(2) li:first-child .value').textContent),
        dates: {
          projectedOpen: new Date(resortImportantDates.querySelector('li:nth-child(1) strong').textContent),
          daysOpenLastYear: parseInt(resortImportantDates.querySelector('li:nth-child(2) strong').textContent)
        },
        trailInfo: {
          beginner: resortTerrain.querySelector('.value.beginner').textContent,
          intermediate: resortTerrain.querySelector('.value.intermediate').textContent,
          advanced: resortTerrain.querySelector('.value.advanced').textContent,
          expert: resortTerrain.querySelector('.value.expert').textContent
        },
        elevation: {
          summit: parseInt(resortElevation.querySelector('.top .value').textContent),
          base: parseInt(resortElevation.querySelector('.bottom .value').textContent)
        },
        // skiableAcreage: parseInt(resortTerrain.querySelector('ul:nth-child(3) li:first-child .value').textContent)
      }
      return resortInfo
    })
    .end()
    .then(resort => {
      result.push(resort)
      return resort
    })
    .catch(err => console.log(err))
}
