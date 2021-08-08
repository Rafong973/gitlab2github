const { sql } = require('../../config');
const knex = require('knex');

const { client, host , user, password, database, port } = sql;

const DB = knex({
    client,
    connection: {
        host,
        user,
        password,
        database,
        charset: 'utf8mb4',
        dateStrings: "date",
        port
    }
});

module.exports = DB;
