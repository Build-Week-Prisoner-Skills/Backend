const db = require('../database/db-config');

module.exports = {
    find,
    findByPrisonId,
    findById
};

function find() {
    return db('prisoners')
    .select('prisoners.id', 'prisoners.name', 'prisoners.work_exp', 'prisoners.skills', 'prisoners.availability', 'prisons.name as facility', 'prisons.postal_code as postal_code')
    .join('prisons', 'prisons.id', '=', 'prisoners.prison_id');
};

function findByPrisonId(prison_id) {
    return db('prisoners')
        .where('prisoners.prison_id', prison_id);
};

function findById(id) {
    return db('prisoners')
        .where('prisoners.id', id )
        .select('prisoners.id', 'prisoners.name', 'prisoners.work_exp', 'prisoners.skills', 'prisoners.availability', 'prisoners.prison_id', 'prisons.name as facility', 'prisons.postal_code as postal_code')
        .join('prisons', 'prisons.id', '=', 'prisoners.prison_id')
        .first()
};