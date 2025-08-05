
const common = {
    client: 'sqlite3',
    useNullAsDefault: true,
    migrations: {
        directory: './data/migrations'
    },
    seeds: {
        directory: './data/seeds'
    }
};
module.exports = {

    development: {
        ...common,  
        connection: {
            filename: './data/contacts.db3',
        }
    },

    testing: {
        ...common,
        connection: {
            filename: './data/test.db3',
        }
    },

    production: {
        //-- Uncomment the following lines to use a production database
        }
};
