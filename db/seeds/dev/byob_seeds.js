const states = require('../../../states');
// const resorts = require('./resorts')
// const trails = require('./trails')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('trails').del()
    .then(() => knex('resorts')).del()
    .then(() => knex('states')).del()

    .then(() => {
      // Inserts seed entries
      return Promise.all([
        knex('states').insert({
          states
        }, 'id')
      ])
    })
    .catch(err => console.log('ERROR: ', err))
};
