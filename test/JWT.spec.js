const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const userToken = jwt.sign({ email: 'test@gmail.com', appName: 'BYOB', admin: false }, secretKey);
const should = chai.should(); //eslint-disable-line

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

chai.use(chaiHttp);

describe('JWT implemetation on API Routes', () => {
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

  describe('JWT send methods', () => {
    it('Should return an array of states when the JWT is passed in the request header', (done) => {
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
          done();
        });
    });

    it('Should return an array of states when the JWT is passed in as a URL query param', (done) => {
      chai.request(server)
        .get(`/api/v1/states/?token=${userToken}`)
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
          done();
        });
    });

    it('Should return an array of states when the JWT is passed in the request body', (done) => {
      chai.request(server)
        .get('/api/v1/states')
        .send({ token: userToken })
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
          done();
        });
    });
  });


  describe('SAD PATH - GET requests with no JWT', () => {
    it('/api/v1/states -  Should return a 403 error if the user does not pass in a JWT', (done) => {
      chai.request(server)
        .get('/api/v1/states')
        .end((err, res) => {
          err.should.have.status(403);
          res.should.have.property('error');
          res.error.text.should.include('You must be authorized to hit this endpoint');
          done();
        });
    });

    it('/api/v1/resorts - Should return a 403 error if the user does not pass in a JWT', (done) => {
      chai.request(server)
        .get('/api/v1/resorts')
        .end((err, res) => {
          err.should.have.status(403);
          res.should.have.property('error');
          res.error.text.should.include('You must be authorized to hit this endpoint');
          done();
        });
    });

    it('/api/v1/trails - Should return a 403 error if the user does not pass in a JWT', (done) => {
      chai.request(server)
        .get('/api/v1/trails')
        .end((err, res) => {
          err.should.have.status(403);
          res.should.have.property('error');
          res.error.text.should.include('You must be authorized to hit this endpoint');
          done();
        });
    });
  });

  describe('SAD PATH - POST, PATCH, DELETE requests without admin access', () => {
    const newState = {
      state_name: 'Puerto Rico',
      state_abbreviation: 'PR',
    };
    const newResort = {
      resort_name: 'New Resort',
      state_name: 'colorado',
      projected_open_date: '1/1/18',
      annual_snowfall: '200',
      trail_total: '50',
      days_open_last_year: '0',
      summit_elevation: '13500',
      base_elevation: '10000',
      beginner_trail_percent: '0.2',
      intermediate_trail_percent: '0.2',
      advanced_trail_percent: '0.3',
      expert_trail_percent: '0.3',
      states_id: '6',
    };
    const newTrail = {
      trail_name: 'Knee Ripper',
      trail_difficulty: 'Expert',
      resort_id: 27,
    };

    it('POST /api/v1/states - Should not allow a user without admin privileges to post a new state', (done) => {
      chai.request(server)
        .post('/api/v1/states')
        .set('authorization', userToken)
        .send(newState)
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json; //eslint-disable-line
          res.body.should.not.have.property('state_name');
          res.body.should.not.have.property('state_abbreviation');
          res.body.should.have.property('error');
          res.body.error.should.equal('You must be an admin to hit this endpoint');
          done();
        });
    });

    it('PATCH /api/v1/states/:id - Should not allow a user without admin privileges to patch a state', (done) => {
      chai.request(server)
        .patch('/api/v1/states/1')
        .set('authorization', userToken)
        .send({ state_name: 'Not a Real State Name' })
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json; //eslint-disable-line
          res.body.should.not.have.property('state_name');
          res.body.should.have.property('error');
          res.body.error.should.equal('You must be an admin to hit this endpoint');
          done();
        });
    });

    it('DELETE /api/v1/states/:id - Should not allow a user without admin priveleges to delete a state', (done) => {
      chai.request(server)
        .delete('/api/v1/states/1')
        .set('authorization', userToken)
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json; //eslint-disable-line
          res.body.should.have.property('error');
          res.body.error.should.equal('You must be an admin to hit this endpoint');
          done();
        });
    });

    it('POST /api/v1/resorts - Should not allow a user without admin priveleges to post a new resort', (done) => {
      chai.request(server)
        .post('/api/v1/resorts')
        .set('authorization', userToken)
        .send(newResort)
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json; //eslint-disable-line
          res.body.should.not.have.property('resort_name');
          res.body.should.not.have.property('trail_total');
          res.body.should.not.have.property('expert_trail_percent');
          res.body.should.have.property('error');
          res.body.error.should.equal('You must be an admin to hit this endpoint');
          done();
        });
    });

    it('PATCH /api/v1/resorts/:id - Should not allow a user without admin privileges to patch a resort', (done) => {
      chai.request(server)
        .patch('/api/v1/resorts/1')
        .set('authorization', userToken)
        .send({ resort_name: 'Not a Real Resort Name' })
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json; //eslint-disable-line
          res.body.should.not.have.property('resort_name');
          res.body.should.have.property('error');
          res.body.error.should.equal('You must be an admin to hit this endpoint');
          done();
        });
    });

    it('DELETE /api/v1/resorts/:id - Should not allow a user without admin privileges to delete a resort', (done) => {
      chai.request(server)
        .delete('/api/v1/resorts/1')
        .set('authorization', userToken)
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json; //eslint-disable-line
          res.body.should.have.property('error');
          res.body.error.should.equal('You must be an admin to hit this endpoint');
          done();
        });
    });

    it('POST /api/v1/trails - Should not allow a user without admin privileges to post a new trail', (done) => {
      chai.request(server)
        .post('/api/v1/trails')
        .set('authorization', userToken)
        .send(newTrail)
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json; //eslint-disable-line
          res.body.should.not.have.property('trail_name');
          res.body.should.not.have.property('trail_difficulty');
          res.body.should.not.have.property('resort_id');
          res.body.should.have.property('error');
          res.body.error.should.equal('You must be an admin to hit this endpoint');
          done();
        });
    });

    it('PATCH /api/v1/trails/:id - Should not allow a user without admin privileges to patch a trail', (done) => {
      chai.request(server)
        .patch('/api/v1/trails/1')
        .set('authorization', userToken)
        .send({ trail_name: 'Not a Real Trail Name' })
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json; //eslint-disable-line
          res.body.should.not.have.property('trail_name');
          res.body.should.have.property('error');
          res.body.error.should.equal('You must be an admin to hit this endpoint');
          done();
        });
    });

    it('DELETE /api/v1/trails/:id - Should not allow a user without admin privileges to delete a trail', (done) => {
      chai.request(server)
        .delete('/api/v1/trails/1')
        .set('authorization', userToken)
        .end((err, res) => {
          res.should.have.status(403);
          res.should.be.json; //eslint-disable-line
          res.body.should.have.property('error');
          res.body.error.should.equal('You must be an admin to hit this endpoint');
          done();
        });
    });
  });
});
