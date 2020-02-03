exports.seed = function(knex) {
  return knex('prisons').insert([
    {
      id: 1, 
      name: 'Shawshank State Prison',
      address: '100 Reformatory Road',
      city: 'Mansfield',
      state: 'ME',
      postal_code: 04401
    },
    {
      id: 2, 
      name: 'Road Prison 36',
      address: 'W Main Street',
      city: 'Tavares',
      state: 'FL',
      postal_code: 32778
    },
    {
      id: 3, 
      name: 'Cold Mountain Penitentiary',
      address: 'Cockrill Bend Boulevard',
      city: 'Cold Mountain',
      state: 'LA',
      postal_code: 70712
    }
  ]);
};