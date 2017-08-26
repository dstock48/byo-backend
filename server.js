const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const db = require('knex')(configuration);
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const app = express();


// /////////////////////////////////////////////////////////////////
// MIDDLEWARE  /////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

const checkAuth = (request, response, next) => {
  const token = request.body.token || request.query.token || request.headers.authorization;
  let authorized;

  if (!token) {
    return response.status(403).json({ error: 'You must be authorized to hit this endpoint' });
  }
  try {
    authorized = jwt.verify(token, secretKey);
  } catch (err) {
    response.status(403).json({ error: 'Invalid token' });
  }
  if (authorized) {
    next();
  }
  return null;
};

const checkAdmin = (request, response, next) => {
  const token = request.body.token || request.query.token || request.headers.authorization;
  let authorized;

  if (!token) {
    return response.status(403).json({ error: 'You must be authorized to hit this endpoint' });
  }
  try {
    authorized = jwt.verify(token, secretKey);
  } catch (err) {
    response.status(403).json({ error: 'Invalid token' });
  }
  if (authorized.admin) {
    next();
  } else {
    response.status(403).json({ error: 'You must be an admin to hit this endpoint' });
  }
  return null;
};

const formatEntryCapitalization = (request, response, next) => {
  const entry = request.body;
  const capitalizeEntryName = (entryName) => {
    return entryName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  if (entry.state_name) {
    entry.state_name = capitalizeEntryName(entry.state_name);
  }
  next();
};

const checkStateAbbreviationFormat = (request, response, next) => {
  const state = request.body;

  if (state.state_abbreviation) {
    state.state_abbreviation = state.state_abbreviation.toUpperCase();

    if (state.state_abbreviation.length !== 2) {
      return response.status(422).json({
        error: 'State abbreviations must be exactly 2 characters.',
      });
    }
    next();
  }
  return null;
};


// /////////////////////////////////////////////////////////////////
// BIND MIDDLEWARE  ////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(checkAuth);


// /////////////////////////////////////////////////////////////////
// JSON WEB TOKEN AUTH  ////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

app.post('/api/v1/auth', (req, res) => {
  const { email, appName } = req.body;
  const admin = email.endsWith('@turing.io');
  const token = jwt.sign({ email, appName, admin }, secretKey, { expiresIn: '1y' });

  res.status(201).json({ token });
});


// /////////////////////////////////////////////////////////////////
// STATE ROUTES  ///////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

// READ ALL STATES
app.get('/api/v1/states', (req, res) => {
  db('states').select()
    .then((states) => {
      res.status(200).json(states);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// READ SPECIFIC STATE
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

// READ ALL RESORTS IN A SPECIFIC STATE
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

// CREATE NEW STATE
app.post('/api/v1/states', checkAdmin, formatEntryCapitalization, checkStateAbbreviationFormat, (req, res) => {
  const newState = req.body;
  const requiredParameter = ['state_name', 'state_abbreviation'];

  requiredParameter.forEach((param) => {
    if (!newState[param]) {
      return res.status(422).json({
        error: `Missing required parameter ${param}.`,
      });
    }
    return null;
  });

  if (newState.token) delete newState.token;

  db('states').insert(newState, 'id')
    .then(() => {
      res.status(201).json(newState);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// UPDATE STATE
app.patch('/api/v1/states/:id', checkAdmin, formatEntryCapitalization, checkStateAbbreviationFormat, (req, res) => {
  const { id } = req.params;
  const updatedState = req.body;

  if (updatedState.id) {
    return res.status(422).json({
      error: 'You cannot change the ID.',
    });
  }

  if (updatedState.token) delete updatedState.token;

  db('states').where({ id }).update(updatedState)
    .then(() => res.status(200).json(updatedState))
    .catch(error => res.status(500).json({ error }));
  return null;
});

// DELETE STATE
app.delete('/api/v1/states/:id', checkAdmin, (req, res) => {
  const { id } = req.params;
  db('states').where({ id }).del().returning('*')
    .then((state) => {
      if (!state.length) {
        res.status(404).json({ error: `The state with ID# ${id} was not found and could not be deleted` });
      }
      res.status(200).json({
        success: `The state with ID# ${id} has been successfully deleted!`,
        deletedStateInfo: state[0],
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// /////////////////////////////////////////////////////////////////
// RESORT ROUTES  //////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

// READ ALL RESORTS
app.get('/api/v1/resorts', (req, res) => {
  const stateName = req.query.state_name;

  if (stateName) {
    db('resorts').where('state_name', stateName.toLowerCase()).select()
      .then((resorts) => {
        return res.status(200).json(resorts);
      });
    return;
  }

  db('resorts').select()
    .then((resorts) => {
      res.status(200).json(resorts);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// READ SPECIFIC RESORT
app.get('/api/v1/resorts/:id', (req, res) => {
  const { id } = req.params;

  db('resorts').where({ id }).select()
    .then((resort) => {
      if (!resort.length) {
        return res.status(404).json({
          error: `Could not find a resort with the id of ${id}`,
        });
      }
      return res.status(200).json(resort);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// READ ALL TRAILS IN A SPECIFIC RESORT
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
    });
});

// CREATE NEW RESORT
app.post('/api/v1/resorts', checkAdmin, (req, res) => {
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

  requiredParams.forEach((param) => {
    if (!newResort[param]) {
      return res.status(422).json({ error: `Missing required parameter: ${param}` });
    }
    return null;
  });

  if (newResort.token) delete newResort.token;

  db('resorts').insert(newResort, '*')
    .then((resort) => {
      res.status(201).json(resort[0]);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

// UPDATE RESORT
app.patch('/api/v1/resorts/:id', checkAdmin, (req, res) => {
  const updatedResort = req.body;
  const { id } = req.params;

  if (updatedResort.id) {
    return res.status(422).json({
      error: 'You cannot change the ID.',
    });
  }

  if (updatedResort.token) delete updatedResort.token;

  db('resorts').where('id', id).update(updatedResort, '*')
    .then((resort) => {
      if (!resort.length) {
        return res.status(404).json({ error: `The resort with ID# ${id} was not found and could not be updated` });
      }
      return res.status(201).json(resort);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
  return null;
});

// DELETE RESORT
app.delete('/api/v1/resorts/:id', checkAdmin, (req, res) => {
  const { id } = req.params;

  db('resorts').where('id', id).del().returning('*')
    .then((resort) => {
      if (!resort.length) {
        return res.status(404).json({ error: `The resort with ID# ${id} was not found and could not be deleted` });
      }
      res.status(200).json({
        success: `The resort with ID# ${id} has been deleted from the database`,
        deletedResortInfo: resort[0],
      });
      return null;
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});


// /////////////////////////////////////////////////////////////////
// TRAILS ROUTES  //////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

// READ ALL TRAILS
app.get('/api/v1/trails', (req, res) => {
  db('trails').select()
    .then((trails) => {
      res.status(200).json(trails);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// READ A SPECIFIC TRAIL
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

// CREATE NEW TRAIL
app.post('/api/v1/trails', checkAdmin, (req, res) => {
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

  if (newTrail.token) delete newTrail.token;

  db('resorts').where(newTrail.resort_id).select('id');
  db('trails').insert(newTrail)
    .then(() => {
      res.status(201).json(newTrail);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// UPDATE TRAIL
app.patch('/api/v1/trails/:id', checkAdmin, (req, res) => {
  const { id } = req.params;
  const updatedTrail = req.body;

  if (updatedTrail.id) {
    return res.status(422).json({
      error: 'You cannot change the ID.',
    });
  }

  if (updatedTrail.token) delete updatedTrail.token;

  db('trails').where({ id }).update(updatedTrail)
    .then(() => {
      res.status(201).json(updatedTrail);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  return null;
});

// DELETE TRAIL
app.delete('/api/v1/trails/:id', checkAdmin, (req, res) => {
  const { id } = req.params;
  db('trails').where({ id }).del().returning('*')
    .then((trail) => {
      if (!trail.length) {
        res.status(404).json({ error: `The trail with ID# ${id} was not found and could not be deleted` });
      }
      res.status(200).json({
        success: `The trail with ID# ${id} has been deleted from the database`,
        deletedTrailInfo: trail[0],
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});


app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`BYO-Backend is running on http://localhost:${app.get('port')}`); //eslint-disable-line
});

module.exports = app;
