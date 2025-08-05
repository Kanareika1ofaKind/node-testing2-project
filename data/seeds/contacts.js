
exports.seed = async function(knex) {
  // Deletes ALL existing entries
    return knex('contacts').truncate()
   .then(function () {
        // Inserts seed entries
        return knex('contacts').insert([
            { firstname: 'John', lastname: 'Doe', contactNo: '+31655' },
            { firstname: 'Jane', lastname: 'Smith', contactNo: '+31656' },
            { firstname: 'Alice', lastname: 'Johnson', contactNo: '+31657' },
            { firstname: 'Bob', lastname: 'Brown', contactNo: '+31658' },
            { firstname: 'Charlie', lastname: 'Davis', contactNo: '+31659' }
        ]);
   });
};
