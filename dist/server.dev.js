"use strict";

var path = require('path');

var express = require('express');

var exphbs = require('express-handlebars');

var app = express();
var PORT = process.env.PORT || 3001;

var sequelize = require('./config/connection');

var hbs = exphbs.create({});

var session = require('express-session');

var SequelizeStore = require('connect-session-sequelize')(session.Store);

var sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};
app.use(session(sess));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(require('./controllers/'));
sequelize.sync({
  force: false
}).then(function () {
  app.listen(PORT, function () {
    return console.log('Now listening');
  });
});