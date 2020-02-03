const db = require('../database/db-config');

module.exports = {
    add,
    find,
    findBy,
    findById,
    findPrisoners,
    remove,
    edit
};

async function add(prison) {
    const [id] = await db('prisons')
        .insert(prison);

    return findById(id);
};

function find() {
    return db('prisons')
        .select('*');
};

function findBy(prop) {
    return db('prisons')
        .where(prop);
};

function findById(id) {
    return db('prisons')
        .where({ id })
        .first();
};

async function findPrisoners(prison_id) {
    let prison = await findById(prison_id)
    .select('name', 'postal_code as zip')    
    return db('prisoners')
    .where('prison_id', prison_id)
    .select('name', 'work_exp as experience', 'skills', 'availability')
    .then(prisoners => {
        prison = {
        ...prison, prisoners
        }
        return prison;
    });
};

function remove(id) {
    return findById(id).del();
};

function edit(id, changes) {
    return findById(id).update(changes);
};