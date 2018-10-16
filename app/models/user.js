const db = require('../config');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
// const saltRounds = 10;



var User = db.Model.extend({
  tableName: 'users',
  initialize: () => {
    // bcrypt.hash(model.get('password'), saltRounds, (err, hash) => {
    //   model.set('password', hash);
    // });
  }
});

module.exports = User;