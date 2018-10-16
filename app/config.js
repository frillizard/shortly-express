const path = require('path');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/shortly.sqlite')
  },
  useNullAsDefault: true
});
const db = require('bookshelf')(knex);

db.knex.schema.hasTable('urls').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('urls', (link) => {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('baseUrl', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then( (table) => {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('clicks').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('clicks', (click) => {
      click.increments('id').primary();
      click.integer('linkId');
      click.timestamps();
    }).then( (table) => {
      console.log('Created Table', table);
    });
  }
});

/************************************************************/
// Add additional schema definitions below
/************************************************************/

db.knex.schema.hasTable('users').then((exists) => {
  if (!exists) {
    db.knex.schema.createTable('users', (users) => {
      users.increments('id').primary();
      users.string('username', 255);
      users.string('password', 255);
      users.timestamps();
    }).then( (table) => {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;
