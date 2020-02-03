const db = require('../database/db-config');

module.exports = {
    find,
    findBy,
    findById
};

function find() {
    return db('prisoners')
    .select('prisoners.id', 'prisoners.name', 'prisoners.work_exp', 'prisoners.skills', 'prisoners.availability', 'prisons.name as facility', 'prisons.postal_code as postal_code')
    .join('prisons', 'prisons.id', '=', 'prisoners.prison_id');
};

function findBy(prop) {
    return db('prisoners')
        .where(prop);
};

function findById(id) {
    return db('prisoners')
        .where('prisoners.id', id )
        .select('prisoners.id', 'prisoners.name', 'prisoners.work_exp', 'prisoners.skills', 'prisoners.availability', 'prisoners.prison_id', 'prisons.name as facility', 'prisons.postal_code as postal_code')
        .join('prisons', 'prisons.id', '=', 'prisoners.prison_id')
        .first()
};