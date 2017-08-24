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
  .catch(error => {
    res.status(500).json({ error });
  })
})

app.post('/api/v1/states', (req, res) => {
  const newState = req.body;

  for (let requiredParameter of ['state_name', 'state_abbreviation']) {
    if (!newState[requiredParameter]) {
      return res.status(422).json({
        error: `Missing required parameter ${requiredParameter}.`
      })
      if (newState.state_abbreviation !== 2) {
        return res.status(422).json({
          error: 'State abbreviations must be exactly 2 characters.'
        })
      }
    }
  }
  newState.state_abbreviation = newState.state_abbreviation.toUpperCase();
  newState.state_name = newState.state_name.charAt(0).toUpperCase() +
  newState.state_name.slice(1).toLowerCase()

  db('states').insert(newState, 'id')
  .then(state => {
    res.status(201).json(newState)
  })
  .catch(error => {
    res.status(500).json({ error });
  });
})

app.patch('/api/v1/states/:id', (req, res) => {
  const { id } = req.params;
  const patch = req.body;

  if (patch.state_abbreviation.length !== 2) {
    return res.status(422).json({
      error: 'State abbreviations must be exactly 2 characters.'
    })
  }
  if (patch.id) {
    return res.status(422).json({
      error: 'You cannot change the ID.'
    })
  }
  patch.state_abbreviation = patch.state_abbreviation.toUpperCase()
  patch.state_name = patch.state_name.charAt(0).toUpperCase() +
  patch.state_name.slice(1).toLowerCase()
  db('states').where({ id }).update(patch)
  .then(patched => {
    res.status(201).json(patch)
  })
  .catch(error => {
    res.status(500).json({ error })
  })
})

app.delete('/api/v1/states/:id', (req, res) => {
  const { id } = req.params;
  db('states').where({ id }).del()
  .then(res => {
    res.status(202)
  })
  .catch(error => {
    res.status(500).json({ error })
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
  .catch(error => {
    res.status(500).json({ error })
  })
})

app.get('/api/v1/resorts', (req, res) => {
  db('resorts').select()
  .then(resorts => {
    res.status(200).json(resorts);
  })
  .catch(error => {
    res.status(500).json({ error });
  })
})

app.get('/api/v1/resorts/:id', (req, res) => {
  const { id } = req.params;

  db('resorts').where({ id }).select()
  .then(resort => {
    if (!resort.length) {
        return res.status(404).json({
          error: `Could not find a resort with a resort with the id of ${id}`
        });
      }
    res.status(200).json(resort)
  })
  .catch(error => {
    res.status(500).json({ error })
  })
})

app.get('/api/v1/trails', (req, res) => {
  db('trails').select()
  .then(trails => {
    res.status(200).json(trails);
  })
  .catch(error => {
    res.status(500).json({ error });
  })
})

app.post('/api/v1/trails', (req, res) => {
  const newTrail = req.body;

  for (let requiredParameter of ['trail_name', 'trail_difficulty', 'resort_id']) {
    if (!newTrail[requiredParameter]) {
      return res.status(422).json({
        error: `Missing required parameter ${requiredParameter}.`
      })
    }
  }
  newTrail.trail_name = newTrail.trail_name.charAt(0).toUpperCase() +
  newTrail.trail_name.slice(1).toLowerCase()

  db('resorts').where(newTrail.resort_id).select('id')
  db('trails').insert(newTrail)
  .then(trail => {
    res.status(201).json(newTrail)
  })
  .catch(error => {
    res.status(500).json({ error });
  });
})

app.get('/api/v1/trails/:id', (req, res) => {
  const { id } = req.params;

  db('trails').where({ id }).select()
  .then(trail => {
    if (!trail.length) {
        return res.status(404).json({
          error: `Could not find a trail with a trail with the id of ${id}`
        });
      }
    res.status(200).json(trail)
  })
  .catch(error => {
    res.status(500).json({ error })
  })
})

app.patch('/api/v1/trails/:id', (req, res) => {
  const { id } = req.params;
  const patch = req.body;

  if (patch.id) {
    return res.status(422).json({
      error: 'You cannot change the ID.'
    })
  }
  db('trails').where({ id }).update(patch)
  .then(patched => {
    res.status(201).json(patch)
  })
  .catch(error => {
    res.status(500).json({ error })
  })
})

app.delete('/api/v1/trails/:id', (req, res) => {
  const { id } = req.params;
  db('trails').where({ id }).del()
  .then(res => {
    res.status(202)
  })
  .catch(error => {
    res.status(500).json({ error })
  })
})

app.listen(app.get('port'), () => {
  console.log(`BYO-Backend is running on http://localhost:${app.get('port')}`);
})

module.exports = app;
