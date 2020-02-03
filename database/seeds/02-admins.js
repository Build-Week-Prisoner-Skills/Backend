const bcrypt = require('bcryptjs');
const password = ('password');
const hash = bcrypt.hashSync(password, 10);

exports.seed = function(knex) {
  return knex('admins').insert([
    {
      id: 1, 
      name: 'Warden Norton',
      username: 'snorton',
      password: hash,
      prison_id: 1
    },
    {
      id: 2, 
      name: 'the Captain',
      username: 'smartin',
      password: hash,
      prison_id: 2
    },
    {
      id: 3, 
      name: 'Hal Moores',
      username: 'hmoores',
      password: hash,
      prison_id: 3
    }
  ]);
};