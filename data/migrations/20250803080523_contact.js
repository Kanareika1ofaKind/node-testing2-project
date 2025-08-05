

exports.up = function (knex) {

    return knex.schema
        .createTable('contacts', (table) => {
            table.increments('contact_id').primary();
            table.string('firstname').notNullable();
            table.string('lastname').notNullable();
            table.string('contactNo').notNullable();
        })

};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('contacts');
};
