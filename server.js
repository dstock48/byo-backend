const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// GET REQUESTS
app.get('/api/v1/states', (req, res) => {
  db('states').select()
    .then((states) => {
      res.status(200).json(states);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

app.get('/api/v1/states/:state_abbreviation', (req, res) => {
  const { stateAbbreviation } = req.params;
  db('states').where('state_abbreviation', stateAbbreviation.toUpperCase()).select()
    .then((state) => {
      if (!state.length) {
        return res.status(404).json({
          error: `Could not find a state with a state abbreviation of ${stateAbbreviation}`,
        });
      }
      res.status(200).json(state);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

app.get('/api/v1/resorts', (req, res) => {
  db('resorts').select()
    .then((resorts) => {
      res.status(200).json(resorts);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

app.get('/api/v1/resorts/:id', (req, res) => {
  const { id } = req.params;
  db('resorts').where('id', id).select()
    .then((resort) => {
      if (!resort.length) {
        return res.status(404).json({
          error: `Could not find a resort with a resort with the id of ${id}`,
        });
      }
      res.status(200).json(resort);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

app.get('/api/v1/trails', (req, res) => {
  db('trails').select()
    .then((trails) => {
      res.status(200).json(trails);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

app.get('/api/v1/trails/:id', (req, res) => {
  const { id } = req.params;
  db('trails').where('id', id).select()
    .then((trail) => {
      if (!trail.length) {
        return res.status(404).json({
          error: `Could not find a trail with a trail with the id of ${id}`,
        });
      }
      res.status(200).json(trail);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

// POST REQUESTS
app.post('/api/v1/resorts', (req, res) => {
  const newResort = req.body;

  const requiredParams = [
    'resort_name',
    'state_name',
    'projected_open_date',
    'annual_snowfall',
    'trail_total',
    'days_open_last_year',
    'summit_elevation',
    'base_elevation',
    'beginner_trail_percent',
    'intermediate_trail_percent',
    'advanced_trail_percent',
    'expert_trail_percent',
    'states_id',
  ];

  for (const requiredParam of requiredParams) {
    if (!newResort[requiredParam]) {
      return res.status(422).json({ error: `Missing required parameter: ${requiredParam}` });
    }
  }

  db('resorts').insert(newResort, '*')
    .then((resort) => {
      res.status(201).json(resort[0]);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

app.patch('/api/v1/resorts/:id', (req, res) => {
  const updatedResort = req.body;
  const { id } = req.params;

  db('resorts').where('id', id).select().update(updatedResort, '*')
    .then((resort) => {
      res.status(201).json(resort);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

app.delete('/api/v1/resorts/:id', (req, res) => {
  const { id } = req.params;

  db('resorts').where('id', id).del()
    .then(() => {
      res.status(202).json({ message: `The resort with ID #${id} has been deleted from the database` });
    })
    .catch(() => {
      res.status(500).json({ error: `The resort with ID #${id} could not be found and was not deleted` });
    });
});

app.listen(app.get('port'), () => {
  console.log(`BYO-Backend is running on http://localhost:${app.get('port')}`);  //eslint-disable-line
});

module.exports = app;
