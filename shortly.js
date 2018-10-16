const express = require('express');
const util = require('./lib/utility');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const session = require('express-session');


const db = require('./app/config');
const Users = require('./app/collections/users');
const User = require('./app/models/user');
const Links = require('./app/collections/links');
const Link = require('./app/models/link');
const Click = require('./app/models/click');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
// app.use(session({}));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/create', (req, res) => {
  res.render('index');
});

app.get('/links', (req, res) => {
  Links.reset().fetch().then(function(links) {
    res.status(200).send(links.models);
  });
});

app.post('/links', (req, res) => {
  let uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  new Link({ url: uri }).fetch().then((found) => {
    if (found) {
      res.status(200).send(found.attributes);
    } else {
      util.getUrlTitle(uri, (err, title) => {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }

        Links.create({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        })
          .then((newLink) => {
            res.status(200).send(newLink);
          });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  new User({ username: req.body.username }).fetch().then((found) => {
    if (found) {
      res.send('Username already exists');
    } else {
      Users.create({
        username: req.body.username,
        password: req.body.password
      });
      res.send('Account created!');
    }
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  let credentials = {
    username: req.body.username,
    password: req.body.password
  };

  new User(credentials).fetch().then((found) => {
    if (found) {
      res.send('Login successful!');
    } else {
      res.send('Account not found');
    }
  });
});

/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', (req, res) => {
  new Link({ code: req.params[0] }).fetch().then((link) => {
    if (!link) {
      res.redirect('/');
    } else {
      let click = new Click({
        linkId: link.get('id')
      });

      click.save().then(() => {
        link.set('visits', link.get('visits') + 1);
        link.save().then(() => {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

module.exports = app;
