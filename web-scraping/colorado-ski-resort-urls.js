const fs = require('fs');
const Nightmare = require('nightmare');

const nightmare = Nightmare();

nightmare
  .goto('http://www.onthesnow.com/united-states/ski-resorts.html')
  .evaluate(() => {
    const resortList = document.querySelectorAll('.resortList tr .name a');

    const resortURLs = [];
    for (let i = 0; i < resortList.length; i += 1) {
      const link = resortList[i].href;
      resortURLs.push(link);
    }
    return resortURLs;
  })
  .end()
  .then((result) => {
    const output = JSON.stringify(result, null, 2);

    /* eslint-disable no-console */
    fs.writeFile('resort-urls.json', output, 'utf8', (err) => {
      if (err) {
        return console.log(err);
      }
      return console.log('New file created!');
    });
  })
  .catch(error => console.log(error));
