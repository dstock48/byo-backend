/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

chai.use(chaiHttp);

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

  describe('GET api/v1/states', () => {
    it('Should return an array of states', (done) => {
      chai.request(server)
        .get('/api/v1/states')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('GET api/v1/resorts', () => {
    it('Should return an array of all resorts', (done) => {
      chai.request(server)
        .get('/api/v1/resorts')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(332);
          res.body[0].should.have.property('resort_name');
          res.body[0].should.have.property('state_name');
          res.body[0].should.have.property('projected_open_date');
          res.body[0].should.have.property('annual_snowfall');
          res.body[0].should.have.property('trail_total');
          res.body[0].should.have.property('days_open_last_year');
          res.body[0].should.have.property('summit_elevation');
          res.body[0].should.have.property('base_elevation');
          res.body[0].should.have.property('beginner_trail_percent');
          res.body[0].should.have.property('intermediate_trail_percent');
          res.body[0].should.have.property('advanced_trail_percent');
          res.body[0].should.have.property('expert_trail_percent');
          res.body[0].should.have.property('states_id');
          res.body[0].should.have.property('created_at');
          done();
        });
    });
    it('Should return only the resorts from a specific state', (done) => {
      chai.request(server)
        .get('/api/v1/resorts?state_name=vermont')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(15);
          res.body[0].state_name.should.eql('vermont');
        });
      chai.request(server)
        .get('/api/v1/resorts?state_name=montana')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.length(12);
          res.body[0].state_name.should.eql('montana');
          done();
        });
    });
    it('Should return an error status if you do not hit the endpoint correctly', (done) => {
      chai.request(server)
        .get('/api/v1/resort') // should be 'resorts'
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('Should return a specific resort', (done) => {
      chai.request(server)
        .get('/api/v1/resorts/16')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.length(1);
          res.body[0].state_name.should.eql('colorado');
          res.body[0].resort_name.should.eql('Aspen / Snowmass');
        });
      chai.request(server)
        .get('/api/v1/resorts/28')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.length(1);
          res.body[0].state_name.should.eql('montana');
          res.body[0].resort_name.should.eql('Big Sky Resort');
          done();
        });
    });
    it('Should return an error message and status if no resort is found', (done) => {
      chai.request(server)
        .get('/api/v1/resorts/9999')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.eql({ error: 'Could not find a resort with the id of 9999' });
          done();
        });
    });
    it('Should return all trails for a specific resort', (done) => {
      chai.request(server)
        .get('/api/v1/resorts/171/trails')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.length(3);
          res.body[1].should.have.property('trail_name');
          res.body[1].trail_name.should.eql('Basically Flat');
          res.body[1].should.have.property('trail_difficulty');
          res.body[1].trail_difficulty.should.eql('Beginner');
          res.body[1].should.have.property('trail_length');
          res.body[1].trail_length.should.eql('1.35');
          res.body[1].should.have.property('open');
          res.body[1].open.should.eql(true);
          res.body[1].should.have.property('resort_id');
          res.body[1].resort_id.should.eql(171);
          res.body[1].should.have.property('created_at');
          res.body[1].should.have.property('resort_name');
          res.body[1].resort_name.should.eql('Mount Snow');
          done();
        });
    });
    it('Should return an error message and status if the resort is not found', (done) => {
      chai.request(server)
        .get('/api/v1/resorts/9999/trails')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.eql({ error: 'There is no resort with an id of 9999.' });
          done();
        });
    });
  });
});
