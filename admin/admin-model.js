const db = require('../database/db-config');

module.exports = {
    add,
    find,
    findBy,
    findById,
    remove,
    edit,
    addPrison,
    findPrisonById,
    addPrisoner,
    findPrisonerById,
    removePrisoner,
    editPrisoner
}

async function add(admin) {
    const [id] = await db('admins').insert(admin);
    return findById(id);
};

function find() {
    return db('admins')
    .select('admins.id','admins.name', 'admins.username', 'prisons.name as prison_name' )
    .join('prisons', 'prisons.id', '=', 'admins.prison_id')
};

function findBy(prop) {
    return db('admins')
        .where(prop);
};

function findById(id) {
     return db('admins')
     .where('id', id )
     .first();
};

async function remove(id) {
    await findById(id).del();
    return findById(id);
};

async function edit(id, changes) {
    await findById(id).update(changes)
        return findById(id);
};

/**  PRISON MODELS  **/


async function addPrison(prison) {
    const [id] = await db('prisons')
        .insert(prison)
        return findPrisonById(id)
}

function findPrisonById(id) {
    return db('prisons')
        .where('prisons.id', id )
        .first();
};

/**  PRISONER MODELS  **/

async function addPrisoner(prisoner) {
    const [id] = await db('prisoners')
        .insert(prisoner);
    return findPrisonerById(id);
};

function findPrisonerById(id) {
    return db('prisoners')
        .where('prisoners.id', id )
        .select('*')
        .first()
};

async function removePrisoner(id) {
    await findPrisonerById(id).del()
        return findPrisonerById(id);
};

async function editPrisoner(id, changes) {
    await findPrisonerById(id).update(changes)
        return findPrisonerById(id);
};