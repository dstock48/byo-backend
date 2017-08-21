const fs = require('fs');
const Nightmare = require('nightmare');
const nightmare = Nightmare(); // 'show: true' makes the browser open so you can see the automation happening

nightmare
  .goto('http://www.onthesnow.com/united-states/ski-resorts.html')
  .evaluate(() => {
    const resortList = document.querySelectorAll('.resortList tr .name a')

    let resortURLs = []
      for (let i = 0; i < resortList.length; i++) {
        let link = resortList[i].href
        resortURLs.push(link)
      }

    return resortURLs
  })
  .end()
  // .then(data => {
  //   console.log(data);
  // })
  .then(result => {
      const output = JSON.stringify(result, null, 2)

      fs.writeFile(`resort-urls.json`, output, 'utf8', (err) => {
        if (err) {
          return console.log(err);
        }
        console.log('New file created!');
      })
    })
    .catch( error => console.log(error) )
