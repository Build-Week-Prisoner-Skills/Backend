exports.seed = function(knex) {
  return knex('prisoners').insert([
    {
      id: 1, 
      name: 'Andy Dufresne',
      work_exp: 'Accounting',
      skills: 'Math, Planning',
      availability: 'Day pass',
      prison_id: 1
    },
    {
      id: 2, 
      name: 'Lucas Jackson',
      work_exp: 'Veteran',
      skills: 'Tenacity, Good under pressure',
      availability: 'On Site',
      prison_id: 2
    },
    {
      id: 3, 
      name: 'John Coffey',
      work_exp: 'Healthcare',
      skills: 'Healing, Compassion',
      availability: 'Work Release',
      prison_id: 3
    },
    {
      id: 4, 
      name: 'Ellis Boyd Redding',
      work_exp: 'Sales',
      skills: 'Ordering, Networking',
      availability: 'Day pass',
      prison_id: 1
    },
    {
      id: 5, 
      name: 'Dragline',
      work_exp: 'Manual Labor',
      skills: 'Leadership, Strength',
      availability: 'On Site',
      prison_id: 2
    },
    {
      id: 6, 
      name: 'Eduard Delacroix',
      work_exp: 'Animal Trainer',
      skills: 'Bilingual, Animal ',
      availability: 'On Site',
      prison_id: 3
    }
  ]);
};