const states = require('../../../states');
const resorts = require('../../../resorts')
// const trails = require('./trails')

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('trails').del()
    .then(() => knex('resorts').del())
    .then(() => knex('states').del())

    .then(() => {
      // Inserts seed entries
      return Promise.all([
        knex('states').insert(states,'*')
      ])
      .then(statesArray => {
        return Promise.all([
          knex('resorts').insert(resorts.map((resort) => {
            const thisState = statesArray.find((state) => {
              console.log(state[0].state_name, 'stste');
              return state[0].state_name.toLowerCase() === resort.state_name.toLowerCase()
            });

             console.log(resort.state_name);
             console.log(this.state);
            return Object.assign(resort, {states_id: parseInt(thisState.id)})
          }))
        ])
      })
    })
    .catch(err => console.log('ERROR: ', err))
};
