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

describe('API trails routes - /api/v1/trails', () => {
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

  describe('GET /api/v1/trails', () => {
    it('Should return an array of trails', (done) => {
      chai.request(server)
        .get('/api/v1/trails')
        .set('authorization', userToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('array');
          res.body.length.should.equal(6);
          res.body.forEach((trail) => {
            trail.should.have.property('id');
            trail.id.should.not.be.NaN; //eslint-disable-line
            trail.should.have.property('trail_name');
            trail.should.have.property('trail_difficulty');
            trail.should.have.property('trail_length');
            trail.should.have.property('open');
            trail.should.have.property('resort_id');
            trail.should.have.property('resort_name');
            trail.should.have.property('created_at');
            trail.should.have.property('updated_at');
          });
          res.body[0].id.should.equal(1);
          res.body[0].trail_name.should.equal('Super Duper Trooper Trail');
          res.body[0].trail_difficulty.should.equal('Advanced');
          res.body[0].trail_length.should.equal('3.50');
          res.body[0].open.should.equal(true);
          res.body[0].resort_id.should.equal(304);
          res.body[0].resort_name.should.equal('Vail');
          res.body[4].id.should.equal(5);
          res.body[4].trail_name.should.equal('You Will DIE!');
          res.body[4].trail_difficulty.should.equal('Expert');
          res.body[4].trail_length.should.equal('7.85');
          res.body[4].open.should.equal(false);
          res.body[4].resort_id.should.equal(28);
          res.body[4].resort_name.should.equal('Big Sky Resort');
          done();
        });
    });

    it('SAD PATH - Should return a 404 if the get is improperly called', (done) => {
      chai.request(server)
        .get('/api/v1/trail')
        .set('authorization', userToken)
        .end((err, res) => {
          err.should.have.status(404);
          res.should.have.property('error');
          res.error.text.should.include('Cannot GET /api/v1/trail');
          done();
        });
    });
  });

  describe('GET /api/v1/trails/:id', () => {
    it('Should return a single trail based on ID passed as a param', (done) => {
      chai.request(server)
        .get('/api/v1/trails/3')
        .set('authorization', userToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.have.property('id');
          res.body[0].id.should.not.be.NaN; //eslint-disable-line
          res.body[0].id.should.equal(3);
          res.body[0].should.have.property('trail_name');
          res.body[0].trail_name.should.equal('Sad Path');
          res.body[0].should.have.property('trail_difficulty');
          res.body[0].trail_difficulty.should.equal('Beginner');
          res.body[0].should.have.property('trail_length');
          res.body[0].trail_length.should.equal('1.20');
          res.body[0].should.have.property('open');
          res.body[0].open.should.equal(true);
          res.body[0].should.have.property('resort_name');
          res.body[0].resort_name.should.equal('Mount Snow');
          res.body[0].should.have.property('resort_id');
          res.body[0].resort_id.should.equal(171);
          res.body[0].should.have.property('created_at');
          res.body[0].should.have.property('updated_at');
          done();
        });
    });

    it('SAD PATH - Should return a 404 with an error message if the ID doesn\'t exist', (done) => {
      chai.request(server)
        .get('/api/v1/trails/7')
        .set('authorization', userToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('Could not find a trail with the id of 7');
          done();
        });
    });
  });

  describe('POST /api/v1/trails', () => {
    it('Should allow the addition of a new trail', (done) => {
      chai.request(server)
        .post('/api/v1/trails')
        .set('authorization', adminToken)
        .send({
          trail_name: 'The Oregon Trail',
          trail_difficulty: 'beginner',
          resort_id: 234,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json; //eslint-disable-line
          res.body.should.have.property('trail_name');
          res.body.trail_name.should.equal('The Oregon Trail');
          res.body.should.have.property('trail_difficulty');
          res.body.trail_difficulty.should.equal('beginner');
          res.body.should.have.property('resort_id');
          res.body.resort_id.should.equal(234);
          res.headers.should.have.property('content-type');
          res.headers['content-type'].should.equal('application/json; charset=utf-8');
          done();
        });
    });

    it('SAD PATH - Should return a 422 status with an error message if a required parameter is missing', (done) => {
      chai.request(server)
        .post('/api/v1/trails')
        .set('authorization', adminToken)
        .send({
          trail_name: 'Cool Story Bro',
          resort_id: 234,
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.should.be.json; //eslint-disable-line
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.equal('Missing required parameter: trail_difficulty');
          done();
        });
    });

    it('SAD PATH - Should return a 500 status with an error message if a property is posted that doesn\'t exist in the database', (done) => {
      chai.request(server)
        .post('/api/v1/trails')
        .set('authorization', adminToken)
        .send({
          trail_name: 'Sidewinder',
          trail_difficulty: 'Expert',
          resort_id: 234,
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

    describe('PATCH /api/v1/trails/:id', () => {
      it('Should update one record', (done) => {
        chai.request(server)
          .patch('/api/v1/trails/3')
          .set('authorization', adminToken)
          .send({
            trail_name: 'The trail with no name',
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json; //eslint-disable-line
            res.body[0].should.have.property('trail_name');
            res.body[0].trail_name.should.equal('The trail with no name');
            res.headers.should.have.property('content-type');
            res.headers['content-type'].should.equal('application/json; charset=utf-8');
            done();
          });
      });

      it('Should update multiple records', (done) => {
        chai.request(server)
          .patch('/api/v1/trails/3')
          .set('authorization', adminToken)
          .send({
            trail_name: 'Sidewinder',
            trail_difficulty: 'Expert',
            resort_id: 234,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json; //eslint-disable-line
            res.body[0].should.have.property('trail_name');
            res.body[0].trail_name.should.equal('Sidewinder');
            res.body[0].should.have.property('trail_difficulty');
            res.body[0].trail_difficulty.should.equal('Expert');
            res.body[0].should.have.property('resort_id');
            res.body[0].resort_id.should.equal(234);
            res.headers.should.have.property('content-type');
            res.headers['content-type'].should.equal('application/json; charset=utf-8');
            done();
          });
      });

      it('SAD PATH - Should not allow you to update an ID', (done) => {
        chai.request(server)
          .patch('/api/v1/trails/3')
          .set('authorization', adminToken)
          .send({
            trail_name: 'Sidewinder',
            trail_difficulty: 'Expert',
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

      it('SAD PATH - Should return an error if the trail does not exist', (done) => {
        chai.request(server)
          .patch('/api/v1/trails/56')
          .set('authorization', adminToken)
          .send({ trail_name: 'Sidewinder' })
          .end((err, res) => {
            res.should.have.status(404);
            res.should.be.json; //eslint-disable-line
            res.body.should.have.property('error');
            res.body.error.should.equal('The trail with ID# 56 was not found and could not be updated');
            done();
          });
      });
    });

    describe('DELETE /api/v1/trails/:id', () => {
      it('should delete a specific record from the trails table of the database', (done) => {
        const newTrail = {
          trail_name: 'Sidewinder',
          trail_difficulty: 'Expert',
          resort_id: 234,
        };

        chai.request(server)
          .get('/api/v1/trails')
          .set('authorization', userToken)
          .end((err, res) => {
            res.body.length.should.eql(6);

            chai.request(server)
              .post('/api/v1/trails')
              .set('authorization', adminToken)
              .send(newTrail)
              .end((err1, res1) => {
                res1.should.have.status(201);

                chai.request(server)
                  .get('/api/v1/trails')
                  .set('authorization', userToken)
                  .end((err2, res2) => {
                    res2.body.should.have.length(7);

                    chai.request(server)
                      .delete('/api/v1/trails/7')
                      .set('authorization', adminToken)
                      .end((err3, res3) => {
                        res3.body.success.should.eql('The trail with ID# 7 has been deleted from the database');

                        chai.request(server)
                          .get('/api/v1/trails')
                          .set('authorization', userToken)
                          .end((err4, res4) => {
                            res4.body.should.have.length(6);
                            done();
                          });
                      });
                  });
              });
          });
      });

      it('SAD PATH - should return an error when trying to delete a record that does not exist', (done) => {
        chai.request(server)
          .delete('/api/v1/trails/327')
          .set('authorization', adminToken)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.eql({ error: 'The trail with ID# 327 was not found and could not be deleted' });
            done();
          });
      });
    });
  });
});
