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
          res.body.forEach((item) => {
            item.should.have.property('resort_name');
            item.should.have.property('state_name');
            item.should.have.property('projected_open_date');
            item.should.have.property('annual_snowfall');
            item.should.have.property('trail_total');
            item.should.have.property('days_open_last_year');
            item.should.have.property('summit_elevation');
            item.should.have.property('base_elevation');
            item.should.have.property('beginner_trail_percent');
            item.should.have.property('intermediate_trail_percent');
            item.should.have.property('advanced_trail_percent');
            item.should.have.property('expert_trail_percent');
            item.should.have.property('states_id');
            item.should.have.property('created_at');
          });
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
          res.body.forEach((item) => {
            item.state_name.should.eql('vermont');
          });
        });
      chai.request(server)
        .get('/api/v1/resorts?state_name=montana')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.length(12);
          res.body.forEach((item) => {
            item.state_name.should.eql('montana');
          });
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
          res.body.forEach((item) => {
            item.should.have.property('trail_name');
            item.should.have.property('trail_difficulty');
            item.should.have.property('trail_length');
            item.should.have.property('open');
            item.should.have.property('resort_id');
            item.should.have.property('created_at');
            item.should.have.property('updated_at');
            item.should.have.property('resort_name');
          });
          res.body[1].trail_name.should.eql('Basically Flat');
          res.body[1].trail_difficulty.should.eql('Beginner');
          res.body[1].trail_length.should.eql('1.35');
          res.body[1].open.should.eql(true);
          res.body[1].resort_id.should.eql(171);
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
  describe('POST /api/v1/resorts', () => {
    it('should add a new resort to the resorts table in the database', (done) => {
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

      chai.request(server)
        .post('/api/v1/resorts')
        .send(newResort)
        .end((err, res) => {
          res.should.have.status(201);

          chai.request(server)
            .get('/api/v1/resorts')
            .end((error, resp) => {
              resp.body.should.have.length(333);
              done();
            });
        });
    });
    it('should return an error when not provide all required parameters', (done) => {
      const newResortMissingParam = {
        resort_name: 'New Resort',
        state_name: 'colorado',
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

      chai.request(server)
        .post('/api/v1/resorts')
        .send(newResortMissingParam)
        .end((err, res) => {
          res.body.should.eql({ error: 'Missing required parameter: projected_open_date' });

          done();
        });
    });
  });

  describe('DELETE /api/v1/resorts/:id', () => {
    it.only('should delete a specific record from the resorts table of the database', (done) => {
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

      chai.request(server)
        .get('/api/v1/resorts')
        .end((err, res) => {
          res.body.length.should.eql(332);

          chai.request(server)
            .post('/api/v1/resorts')
            .send(newResort)
            .end((err1, res1) => {
              res1.should.have.status(201);

              chai.request(server)
                .get('/api/v1/resorts')
                .end((err2, res2) => {
                  res2.body.should.have.length(333);

                  chai.request(server)
                    .delete('/api/v1/resorts/333')
                    .end((err3, res3) => {
                      res3.body.success.should.eql('The resort with ID# 333 has been deleted from the database');

                      chai.request(server)
                        .get('/api/v1/resorts')
                        .end((err4, res4) => {
                          res4.body.should.have.length(332);
                          done();
                        });
                    });
                });
            });
        });
    });
  });
});
