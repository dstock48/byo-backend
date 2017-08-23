/* eslint-disable */

const fs = require('fs');
const Nightmare = require('nightmare');
var states = require('./states');

const nightmare = Nightmare(); // 'show: true' makes the browser open so you can see the automation happening

const result = [];

const resortURLs = new Promise((res, rej) => {
  nightmare
    .goto('http://www.onthesnow.com/united-states/ski-resorts.html')
    .evaluate(() => {
      const resortList = document.querySelectorAll('.resortList tr .name a');  //eslint-disable-line

      const resortLinks = [];
      for (let i = 15; i < 25; i += 1) {
        const link = resortList[i].href;
        resortLinks.push(link);
      }

      return resortLinks;
    })
    .end()
    .then((data) => {
      res(data);
    })
    .catch((err) => {
      rej(err);
    });
});

function scrapeResortData(url, result) {
  return Nightmare()
    .goto(url)
    .wait(2000)
    .evaluate(() => {
      const resortTerrain = document.querySelector('#resort_terrain');  //eslint-disable-line
      const resortElevation = document.querySelector('#resort_elevation');  //eslint-disable-line
      let impDateCells = document.querySelectorAll('#resort_impdates li')
      // const resortImportantDates = document.querySelector('#resort_impdates');  //eslint-disable-line
      const daysOpenLastYr = Array.from(impDateCells).find(item => item.innerText.startsWith('Days Open Last'))
      const projOpenDate = Array.from(impDateCells).find(item => item.innerText.startsWith('Projected Opening'))
      let relRegionItems = document.querySelectorAll('.rel_regions a')

      let stateName = [...relRegionItems].find(item => {
      	let thisState;
        const states = [
          {
              "state_name": "Alabama",
              "state_abbreviation": "AL"
          },
          {
              "state_name": "Alaska",
              "state_abbreviation": "AK"
          },
          {
              "state_name": "Arizona",
              "state_abbreviation": "AZ"
          },
          {
              "state_name": "Arkansas",
              "state_abbreviation": "AR"
          },
          {
              "state_name": "California",
              "state_abbreviation": "CA"
          },
          {
              "state_name": "Colorado",
              "state_abbreviation": "CO"
          },
          {
              "state_name": "Connecticut",
              "state_abbreviation": "CT"
          },
          {
              "state_name": "Delaware",
              "state_abbreviation": "DE"
          },
          {
              "state_name": "Florida",
              "state_abbreviation": "FL"
          },
          {
              "state_name": "Georgia",
              "state_abbreviation": "GA"
          },
          {
              "state_name": "Hawaii",
              "state_abbreviation": "HI"
          },
          {
              "state_name": "Idaho",
              "state_abbreviation": "ID"
          },
          {
              "state_name": "Illinois",
              "state_abbreviation": "IL"
          },
          {
              "state_name": "Indiana",
              "state_abbreviation": "IN"
          },
          {
              "state_name": "Iowa",
              "state_abbreviation": "IA"
          },
          {
              "state_name": "Kansas",
              "state_abbreviation": "KS"
          },
          {
              "state_name": "Kentucky",
              "state_abbreviation": "KY"
          },
          {
              "state_name": "Louisiana",
              "state_abbreviation": "LA"
          },
          {
              "state_name": "Maine",
              "state_abbreviation": "ME"
          },
          {
              "state_name": "Maryland",
              "state_abbreviation": "MD"
          },
          {
              "state_name": "Massachusetts",
              "state_abbreviation": "MA"
          },
          {
              "state_name": "Michigan",
              "state_abbreviation": "MI"
          },
          {
              "state_name": "Minnesota",
              "state_abbreviation": "MN"
          },
          {
              "state_name": "Mississippi",
              "state_abbreviation": "MS"
          },
          {
              "state_name": "Missouri",
              "state_abbreviation": "MO"
          },
          {
              "state_name": "Montana",
              "state_abbreviation": "MT"
          },
          {
              "state_name": "Nebraska",
              "state_abbreviation": "NE"
          },
          {
              "state_name": "Nevada",
              "state_abbreviation": "NV"
          },
          {
              "state_name": "New Hampshire",
              "state_abbreviation": "NH"
          },
          {
              "state_name": "New Jersey",
              "state_abbreviation": "NJ"
          },
          {
              "state_name": "New Mexico",
              "state_abbreviation": "NM"
          },
          {
              "state_name": "New York",
              "state_abbreviation": "NY"
          },
          {
              "state_name": "North Carolina",
              "state_abbreviation": "NC"
          },
          {
              "state_name": "North Dakota",
              "state_abbreviation": "ND"
          },
          {
              "state_name": "Ohio",
              "state_abbreviation": "OH"
          },
          {
              "state_name": "Oklahoma",
              "state_abbreviation": "OK"
          },
          {
              "state_name": "Oregon",
              "state_abbreviation": "OR"
          },
          {
              "state_name": "Pennsylvania",
              "state_abbreviation": "PA"
          },
          {
              "state_name": "Rhode Island",
              "state_abbreviation": "RI"
          },
          {
              "state_name": "South Carolina",
              "state_abbreviation": "SC"
          },
          {
              "state_name": "South Dakota",
              "state_abbreviation": "SD"
          },
          {
              "state_name": "Tennessee",
              "state_abbreviation": "TN"
          },
          {
              "state_name": "Texas",
              "state_abbreviation": "TX"
          },
          {
              "state_name": "Utah",
              "state_abbreviation": "UT"
          },
          {
              "state_name": "Vermont",
              "state_abbreviation": "VT"
          },
          {
              "state_name": "Virginia",
              "state_abbreviation": "VA"
          },
          {
              "state_name": "Washington",
              "state_abbreviation": "WA"
          },
          {
              "state_name": "West Virginia",
              "state_abbreviation": "WV"
          },
          {
              "state_name": "Wisconsin",
              "state_abbreviation": "WI"
          },
          {
              "state_name": "Wyoming",
              "state_abbreviation": "WY"
          }
        ]
      	states.forEach(state => {
      		if (state.state_name === item.innerText) {
      			thisState = state
      		}
      	})
      	return thisState
      })


      console.log(daysOpenLastYr);

      // create empty array
      const resortInfo = {
        state_name: stateName.textContent,
        resort_name: document.querySelector('.resort_name').textContent,  //eslint-disable-line
        trail_total: parseInt(resortTerrain.querySelector('ul:nth-child(2) li:first-child .value').textContent),
        projected_open_date: new Date(projOpenDate.querySelector('strong').textContent),
        annual_snowfall: parseInt(document.querySelectorAll('#resort_impdates ul li strong')[document.querySelectorAll('#resort_impdates ul li').length - 1].textContent),  //eslint-disable-line
        days_open_last_year: parseInt(daysOpenLastYr.querySelector('strong').textContent),
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
