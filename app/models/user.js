const db = require('../config');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
const saltRounds = 10;



var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function() {
    this.on('creating', function(model, attrs, options) {
      console.log('hashing password!');
      bcrypt.hash(model.get('password'), saltRounds, (err, hash) => {
        console.log('hashing password part 2!');
        if (err) {
          throw err;
        } else {
          console.log('password hashed!', hash);
          model.set('password', hash);
          callback(null, hash);
        }
      });
    });
    this.on('fetching', function(model, attrs, options) {
      console.log('checking password!');
      let hash = new User({username: model.get('username')}).fetch().then(model.get('password'));
      bcrypt.compare(model.get('password'), hash, (err, res) => {
        console.log('checking password part 2!');
        if (err) {
          throw err;
        } else {
          console.log(res);
          callback(res);
        }
      });
    });
  }
});

module.exports = User;