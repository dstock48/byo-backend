const states = require('../../../states');
const resorts = require('../../../resorts');
// const trails = require('./trails')

exports.seed = (knex, Promise) => {
  return knex('trails').del()
    .then(() => knex('resorts').del())
    .then(() => knex('states').del())

    .then(() => {
      return Promise.all([knex('states').insert(states, '*')])
        .then((statesArray) => {
          return Promise.all([
            knex('resorts').insert(resorts.map((resort) => {
              const stateMatch = statesArray[0].find((state) => {
                return state.state_name.toLowerCase() === resort.state_name.toLowerCase();
              });
              return Object.assign(resort, { states_id: parseInt(stateMatch.id) });
            })),
          ]);
        });
    })
    .catch(err => console.log('ERROR: ', err));
};
