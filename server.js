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
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.post('/api/v1/states', (req, res) => {
  const newState = req.body;
  const requiredParameter = ['state_name', 'state_abbreviation'];

  requiredParameter.forEach((param) => {
    if (!newState[param]) {
      return res.status(422).json({
        error: `Missing required parameter ${param}.`,
      });
    }
    if (newState.state_abbreviation.length !== 2) {
      return res.status(422).json({
        error: 'State abbreviations must be exactly 2 characters.',
      });
    }
    return null;
  });

  newState.state_abbreviation = newState.state_abbreviation.toUpperCase();
  newState.state_name = newState.state_name.charAt(0).toUpperCase() +
  newState.state_name.slice(1).toLowerCase();

  db('states').insert(newState, 'id')
    .then(() => {
      res.status(201).json(newState);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.patch('/api/v1/states/:id', (req, res) => {
  const { id } = req.params;
  const patch = req.body;

  if (patch.state_abbreviation.length !== 2) {
    return res.status(422).json({
      error: 'State abbreviations must be exactly 2 characters.',
    });
  }
  if (patch.id) {
    return res.status(422).json({
      error: 'You cannot change the ID.',
    });
  }
  patch.state_abbreviation = patch.state_abbreviation.toUpperCase();
  patch.state_name = patch.state_name.charAt(0).toUpperCase() +
  patch.state_name.slice(1).toLowerCase();
  db('states').where({ id }).update(patch)
    .then(() => {
      res.status(201).json(patch);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  return null;
});

app.delete('/api/v1/states/:id', (req, res) => {
  const { id } = req.params;
  db('states').where({ id }).del()
    .then(() => {
      return res.status(204).json(`Success:  The state with ${id} has been successfully deleted!`);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.get('/api/v1/states/:stateAbbreviation', (req, res) => {
  const { stateAbbreviation } = req.params;

  db('states').where('state_abbreviation', stateAbbreviation.toUpperCase()).select()
    .then((state) => {
      if (!state.length) {
        return res.status(404).json({
          error: `Could not find a state with a state abbreviation of ${stateAbbreviation}`,
        });
      }
      return res.status(200).json(state);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.get('/api/v1/states/:id/resorts', (req, res) => {
  const { id } = req.params;

  db('resorts').where({ states_id: id }).select()
    .then((resort) => {
      if (!resort.length) {
        return res.status(404).json({
          error: 'Could not find any resorts in this state.',
        });
      }
      return res.status(200).json(resort);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.get('/api/v1/resorts', (req, res) => {
  db('resorts').select()
    .then((resorts) => {
      res.status(200).json(resorts);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.get('/api/v1/resorts/:id', (req, res) => {
  const { id } = req.params;

  db('resorts').where({ id }).select()
    .then((resort) => {
      if (!resort.length) {
        return res.status(404).json({
          error: `Could not find a resort with a resort with the id of ${id}`,
        });
      }
      return res.status(200).json(resort);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.get('/api/v1/trails', (req, res) => {
  db('trails').select()
    .then((trails) => {
      res.status(200).json(trails);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.post('/api/v1/trails', (req, res) => {
  const newTrail = req.body;
  const requiredParameter = ['trail_name', 'trail_difficulty', 'resort_id'];

  requiredParameter.forEach((param) => {
    if (!newTrail[param]) {
      return res.status(422).json({
        error: `Missing required parameter ${param}.`,
      });
    }
    return null;
  });

  newTrail.trail_name = newTrail.trail_name.charAt(0).toUpperCase() +
  newTrail.trail_name.slice(1).toLowerCase();

  db('resorts').where(newTrail.resort_id).select('id');
  db('trails').insert(newTrail)
    .then(() => {
      res.status(201).json(newTrail);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.get('/api/v1/trails/:id', (req, res) => {
  const { id } = req.params;
  db('trails').where({ id }).select()
    .then((trail) => {
      if (!trail.length) {
        return res.status(404).json({
          error: `Could not find a trail with a trail with the id of ${id}`,
        });
      }
      return res.status(200).json(trail);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  });

  app.patch('/api/v1/trails/:id', (req, res) => {
  const { id } = req.params;
  const patch = req.body;

  if (patch.id) {
    return res.status(422).json({
      error: 'You cannot change the ID.',
    });
  }
  db('trails').where({ id }).update(patch)
    .then(() => {
      res.status(201).json(patch);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  return null;
  });

  app.delete('/api/v1/trails/:id', (req, res) => {
  const { id } = req.params;
  db('trails').where({ id }).del()
    .then(() => {
      res.status(202);
    })
    .catch((error) => {
      res.status(500).json({ error });
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

app.get('/api/v1/resorts/:id/trails', (req, res) => {
const { id } = req.params;

db('trails').where({ resort_id: id }).select()
  .then((trail) => {
    if (!trail.length) {
      return res.status(404).json({
        error: `There is no resort with an id of ${id}.`,
      });
    }
    return res.status(200).json(trail);
  })
  .catch((error) => {
    res.status(500).json({ error });

app.listen(app.get('port'), () => {
  console.log(`BYO-Backend is running on http://localhost:${app.get('port')}`);
});

module.exports = app;
