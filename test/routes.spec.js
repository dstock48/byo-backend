const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should(); //eslint-disable-line

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  describe('GET /', () => {
    it('Should return the home page with text', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html; //eslint-disable-line
          res.res.text.should.include('BYO-Backend');
          done();
        });
    });
  });
});

describe('API routes', () => {
  beforeEach((done) => {
    db.migrate.rollback()
      .then(() => {
        db.migrate.latest()
          .then(() => {
            db.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  describe('GET /api/v1/states', () => {
    it('Should return an array of states', (done) => {
      chai.request(server)
        .get('/api/v1/states')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('array');
          res.body.length.should.equal(50);
          res.body.forEach((state) => {
            state.should.have.property('id');
            state.id.should.not.be.NaN; //eslint-disable-line
            state.should.have.property('state_name');
            state.should.have.property('state_abbreviation');
            state.should.have.property('created_at');
            state.should.have.property('updated_at');
          });
          res.body[0].id.should.equal(1);
          res.body[0].state_name.should.equal('Alabama');
          res.body[0].state_abbreviation.should.equal('AL');
          res.body[16].id.should.equal(17);
          res.body[16].state_name.should.equal('Kentucky');
          res.body[16].state_abbreviation.should.equal('KY');
          done();
        });
    });

    it('SAD PATH - Should return a 404 if the get is improperly called', (done) => {
      chai.request(server)
        .get('/api/v1/state')
        .end((err, res) => {
          err.should.have.status(404);
          res.should.have.property('error');
          res.error.text.should.include('Cannot GET /api/v1/state');
          done();
        });
    });
  });

  describe('GET /api/v1/states:/stateAbbreviation', () => {
    it('Should return a single state based on the state abbreviation passed as a param', (done) => {
      chai.request(server)
        .get('/api/v1/states/CO')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('id');
          res.body[0].id.should.not.be.NaN; //eslint-disable-line
          res.body[0].id.should.equal(6);
          res.body[0].should.have.property('state_name');
          res.body[0].state_name.should.equal('Colorado');
          res.body[0].should.have.property('state_abbreviation');
          res.body[0].state_abbreviation.should.equal('CO');
          res.body[0].should.have.property('created_at');
          res.body[0].should.have.property('updated_at');
          done();
        });
    });

    it('Should allow a param that is case insensitive', (done) => {
      chai.request(server)
        .get('/api/v1/states/al')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          done();
        });
    });

    it('SAD PATH - Should return a 404 with an error message if the param doesn\'t exist', (done) => {
      chai.request(server)
        .get('/api/v1/states/yt')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('Could not find a state with a state abbreviation of yt');
          done();
        });
    });
  });

  describe('GET /api/v1/states/:id/resorts', () => {
    it('Should return all resorts that are in a given state', (done) => {
      chai.request(server)
        .get('/api/v1/states/44/resorts')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('array');
          res.body.length.should.equal(13);
          res.body.forEach((resort) => {
            resort.should.have.property('id');
            resort.should.have.property('resort_name');
            resort.should.have.property('state_name');
            resort.should.have.property('projected_open_date');
            resort.should.have.property('annual_snowfall');
            resort.should.have.property('trail_total');
            resort.should.have.property('days_open_last_year');
            resort.should.have.property('summit_elevation');
            resort.should.have.property('base_elevation');
            resort.should.have.property('beginner_trail_percent');
            resort.should.have.property('intermediate_trail_percent');
            resort.should.have.property('advanced_trail_percent');
            resort.should.have.property('expert_trail_percent');
            resort.should.have.property('states_id');
            resort.states_id.should.equal(44);
            resort.should.have.property('created_at');
            resort.should.have.property('updated_at');
          });
          res.body[0].id.should.equal(7);
          res.body[0].resort_name.should.equal('Alta Ski Area');
          res.body[0].state_name.should.equal('utah');
          res.body[0].projected_open_date.should.equal('2017-12-01T07:00:00.000Z');
          res.body[0].annual_snowfall.should.equal(560);
          res.body[0].trail_total.should.equal(116);
          res.body[0].days_open_last_year.should.equal(150);
          res.body[0].summit_elevation.should.equal(10550);
          res.body[0].base_elevation.should.equal(8529);
          res.body[0].beginner_trail_percent.should.equal('0.250');
          res.body[0].intermediate_trail_percent.should.equal('0.400');
          res.body[0].advanced_trail_percent.should.equal('0.350');
          res.body[0].expert_trail_percent.should.equal('0.000');
          done();
        });
    });

    it('SAD PATH - Should return a 404 status with an error message if a state does not have any resorts', (done) => {
      chai.request(server)
        .get('/api/v1/states/43/resorts')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('Could not find any resorts in this state.');
          done();
        });
    });
  });

  describe('POST /api/v1/states', () => {
    it('Should allow the addition of a new state', (done) => {
      chai.request(server)
        .post('/api/v1/states')
        .send({
          state_name: 'Puerto Rico',
          state_abbreviation: 'PR',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json; //eslint-disable-line
          res.body.should.have.property('state_name');
          res.body.state_name.should.equal('Puerto Rico');
          res.body.should.have.property('state_abbreviation');
          res.body.state_abbreviation.should.equal('PR');
          res.headers.should.have.property('content-type');
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          done();
        });
    });

    it('Should format the state name and abbreviation properly', (done) => {
      chai.request(server)
        .post('/api/v1/states')
        .send({
          state_name: 'puERtO riCo',
          state_abbreviation: 'pr',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json; //eslint-disable-line
          res.body.should.have.property('state_name');
          res.body.state_name.should.equal('Puerto Rico');
          res.body.should.have.property('state_abbreviation');
          res.body.state_abbreviation.should.equal('PR');
          res.headers.should.have.property('content-type');
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          done();
        });
    });

    it('SAD PATH - Should return a 500 status with an error message if a state name  already exists', (done) => {
      chai.request(server)
        .post('/api/v1/states')
        .send({
          state_name: 'colorado',
          state_abbreviation: 'cl',
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('constraint');
          res.body.error.constraint.should.equal('states_state_name_unique');
          done();
        });
    });

    it('SAD PATH - Should return a 500 status with an error message if a state abbreviation already exists', (done) => {
      chai.request(server)
        .post('/api/v1/states')
        .send({
          state_name: 'crazyville',
          state_abbreviation: 'co',
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('constraint');
          res.body.error.constraint.should.equal('states_state_abbreviation_unique');
          done();
        });
    });

    it('SAD PATH - Should return a 422 status with an error message if a required parameter is missing', (done) => {
      chai.request(server)
        .post('/api/v1/states')
        .send({
          state_abbreviation: 'pr',
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('Missing required parameter state_name.');
          done();
        });
    });

    it('SAD PATH - Should return a 422 status with an error message if the state abreviation is not exactly 2 characters', (done) => {
      chai.request(server)
        .post('/api/v1/states')
        .send({
          state_name: 'puERtO riCo',
          state_abbreviation: 'partyrico',
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('State abbreviations must be exactly 2 characters.');
          done();
        });
    });

    it('SAD PATH - Should return a 500 status with an error message if a property is posted that doesn\'t exist in the database', (done) => {
      chai.request(server)
        .post('/api/v1/states')
        .send({
          state_name: 'puERtO riCo',
          state_abbreviation: 'pr',
          random_thing: 'thing',
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.routine.should.equal('checkInsertTargets');
          done();
        });
    });
  });

  describe('PATCH /api/v1/states/:id', () => {
    it('Should update one record', (done) => {
      chai.request(server)
        .patch('/api/v1/states/3')
        .send({
          state_abbreviation: 'dd',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json; //eslint-disable-line
          res.body.should.have.property('state_abbreviation');
          res.body.state_abbreviation.should.equal('DD');
          res.body.should.not.have.property('state_abbreviation');
          res.headers.should.have.property('content-type');
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          done();
        });
    });
  });
});
