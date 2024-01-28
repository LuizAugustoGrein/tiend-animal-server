const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '185.211.7.52',
        port: 3306,
        user: 'u596350710_tiend_animal',
        password: 'TiendAnimal!2023',
        database: 'u596350710_tiend_animal'
    }
});

module.exports = knex;