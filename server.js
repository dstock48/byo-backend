const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration)

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/v1/states', (req, res) => {
  db('states').select()
  .then(states => {
    res.status(200).json(states);
  })
  .catch(err => {
    res.status(500).json({ err });
  })
})

app.get('/api/v1/states/:state_abbreviation', (req, res) => {
  const { state_abbreviation } = req.params;
  db('states').where('state_abbreviation', state_abbreviation.toUpperCase()).select()
  .then(state => {
    if (!state.length) {
        return res.status(404).json({
          error: `Could not find a state with a state abbreviation of ${state_abbreviation}`
        });
      }
    res.status(200).json(state)
  })
  .catch(err => {
    res.status(500).json({ err })
  })
})

app.get('/api/v1/resorts', (req, res) => {
  db('resorts').select()
  .then(resorts => {
    res.status(200).json(resorts);
  })
  .catch(err => {
    res.status(500).json({ err });
  })
})

app.get('/api/v1/resorts/:id', (req, res) => {
  const { id } = req.params;
  db('resorts').where('id', id).select()
  .then(resort => {
    if (!resort.length) {
        return res.status(404).json({
          error: `Could not find a resort with a resort with the id of ${id}`
        });
      }
    res.status(200).json(resort)
  })
  .catch(err => {
    res.status(500).json({ err })
  })
})

app.get('/api/v1/trails', (req, res) => {
  db('trails').select()
  .then(trails => {
    res.status(200).json(trails);
  })
  .catch(err => {
    res.status(500).json({ err });
  })
})

app.get('/api/v1/trails/:id', (req, res) => {
  const { id } = req.params;
  db('trails').where('id', id).select()
  .then(trail => {
    if (!trail.length) {
        return res.status(404).json({
          error: `Could not find a trail with a trail with the id of ${id}`
        });
      }
    res.status(200).json(trail)
  })
  .catch(err => {
    res.status(500).json({ err })
  })
})

app.listen(app.get('port'), () => {
  console.log(`BYO-Backend is running on http://localhost:${app.get('port')}`);
})

module.exports = app;
