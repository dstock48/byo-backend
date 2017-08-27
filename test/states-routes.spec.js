const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const adminToken = jwt.sign({ email: 'test@turing.io', appName: 'BYOB', admin: true }, secretKey);
const userToken = jwt.sign({ email: 'test@gmail.com', appName: 'BYOB', admin: false }, secretKey);

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
          res.res.text.should.include('Winter Resort API');
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
        .set('authorization', userToken)
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
        .set('authorization', userToken)
        .end((err, res) => {
          err.should.have.status(404);
          res.should.have.property('error');
          res.error.text.should.include('Cannot GET /api/v1/state');
          done();
        });
    });
  });

  describe('GET /api/v1/states/:stateAbbreviation', () => {
    it('Should return a single state based on the state abbreviation passed as a param', (done) => {
      chai.request(server)
        .get('/api/v1/states/CO')
        .set('authorization', userToken)
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
        .set('authorization', userToken)
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
        .set('authorization', userToken)
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
        .set('authorization', userToken)
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
        .set('authorization', userToken)
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
        .set('authorization', adminToken)
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
        .set('authorization', adminToken)
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
        .set('authorization', adminToken)
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
        .set('authorization', adminToken)
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
        .set('authorization', adminToken)
        .send({
          state_abbreviation: 'pr',
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('Missing required parameter: state_name');
          done();
        });
    });

    it('SAD PATH - Should return a 422 status with an error message if the state abreviation is not exactly 2 characters', (done) => {
      chai.request(server)
        .post('/api/v1/states')
        .set('authorization', adminToken)
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
        .set('authorization', adminToken)
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
        .set('authorization', adminToken)
        .send({
          state_abbreviation: 'dd',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json; //eslint-disable-line
          res.body[0].should.have.property('state_abbreviation');
          res.body[0].state_abbreviation.should.equal('DD');
          res.headers.should.have.property('content-type');
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          done();
        });
    });

    it('Should update multiple records', (done) => {
      chai.request(server)
        .patch('/api/v1/states/3')
        .set('authorization', adminToken)
        .send({
          state_abbreviation: 'bn',
          state_name: 'Joelandiaville',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json; //eslint-disable-line
          res.body[0].should.have.property('state_abbreviation');
          res.body[0].state_abbreviation.should.equal('BN');
          res.body[0].should.have.property('state_name');
          res.body[0].state_name.should.equal('Joelandiaville');
          res.headers.should.have.property('content-type');
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          done();
        });
    });

    it('SAD PATH - Should not allow you to update an ID', (done) => {
      chai.request(server)
        .patch('/api/v1/states/3')
        .set('authorization', adminToken)
        .send({
          state_abbreviation: 'bn',
          state_name: 'Joelandiaville',
          id: 5467,
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.should.be.json; //eslint-disable-line
          res.body.should.have.property('error');
          res.body.error.should.equal('You cannot change the ID.');
          done();
        });
    });

    it('SAD PATH - Should return an error if the state does not exist', (done) => {
      chai.request(server)
        .patch('/api/v1/states/56')
        .set('authorization', adminToken)
        .send({
          state_abbreviation: 'bn',
          state_name: 'Joelandiaville',
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json; //eslint-disable-line
          res.body.should.have.property('error');
          res.body.error.should.equal('The state with ID# 56 was not found and could not be updated');
          done();
        });
    });
  });

  describe('DELETE /api/v1/states/:id', () => {
    it('should delete a specific record from the states table of the database', (done) => {
      const newState = {
        state_name: 'Joeville',
        state_abbreviation: 'jv',
      };

      chai.request(server)
        .get('/api/v1/states')
        .set('authorization', userToken)
        .end((err, res) => {
          res.body.length.should.eql(50);

          chai.request(server)
            .post('/api/v1/states')
            .set('authorization', adminToken)
            .send(newState)
            .end((err1, res1) => {
              res1.should.have.status(201);

              chai.request(server)
                .get('/api/v1/states')
                .set('authorization', userToken)
                .end((err2, res2) => {
                  res2.body.should.have.length(51);

                  chai.request(server)
                    .delete('/api/v1/states/51')
                    .set('authorization', adminToken)
                    .end((err3, res3) => {
                      res3.body.success.should.eql('The state with ID# 51 has been successfully deleted!');

                      chai.request(server)
                        .get('/api/v1/states')
                        .set('authorization', userToken)
                        .end((err4, res4) => {
                          res4.body.should.have.length(50);
                          done();
                        });
                    });
                });
            });
        });
    });

    it('SAD PATH - should return an error when trying to delete a record that does not exist', (done) => {
      chai.request(server)
        .delete('/api/v1/states/327')
        .set('authorization', adminToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.eql({ error: 'The state with ID# 327 was not found and could not be deleted' });
          done();
        });
    });

    it('SAD PATH - should return an error if the state has a resort linked to it', (done) => {
      chai.request(server)
        .delete('/api/v1/states/6')
        .set('authorization', adminToken)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have.property('error');
          res.body.error.should.have.property('detail');
          res.body.error.detail.should.equal('Key (id)=(6) is still referenced from table "resorts".');
          done();
        });
    });
  });
});
