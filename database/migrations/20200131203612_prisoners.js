
exports.up = function(knex) {
    return knex.schema
    .createTable('prisons', prisons => {
        prisons.increments();
        prisons
        .string('name', 128)
        .notNullable()
        .unique();
        prisons
        .string('address', 128)
        .notNullable()
        .unique();
        prisons
        .string('city', 128)
        .notNullable();
        prisons
        .string('state', 2)
        .notNullable();
        prisons
        .integer('postal_code', 5)
        .notNullable()
        .index();
    })
    .createTable('admins', admins => {
        admins.increments();
        admins
        .string('username', 255)
        .notNullable()
        .unique();
        admins.string('password', 255).notNullable();
        admins.string('name', 255).notNullable();
        admins.integer('prison_id')
        .references('id')
        .inTable('prisons')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
    })
    .createTable('prisoners', prisoners => {
        prisoners.increments();
        prisoners
        .string('name', 255)
        .notNullable();
        prisoners
        .string('work_exp', 255)
        .notNullable();
        prisoners
        .string('skills', 255)
        .notNullable()
        .index();
        prisoners
        .string('availability', 255)
        .notNullable()
        .index();
        prisoners
        .integer('prison_id')
        .notNullable()
        .references('id')
        .inTable('prisons')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
    .createTable('photos', photos => {
        photos.increments();
        photos
        .binary('prisoner_photo')
        photos
        .binary('prisoner_resume')
        photos
        .integer('prisoner_id')
        .references('id')
        .inTable('prisoners')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('photos')
  .dropTableIfExists('prisoners')
  .dropTableIfExists('admins')
  .dropTableIfExists('prisons')
};
