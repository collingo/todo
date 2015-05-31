'use strict';

import bodyParser from 'body-parser';
import cons from 'consolidate';
import cookieParser from 'cookie-parser';
import errorhandler from 'errorhandler';
import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import logger from 'morgan';
import nib from 'nib';
import passport from 'passport';
import path from 'path';
import session from 'express-session';
import favicon from 'serve-favicon';
import stylus from 'stylus';
import {Strategy as LocalStrategy} from 'passport-local';
import r from 'rethinkdb';
import camelCase from 'lodash/string/camelCase';
import capitalize from 'lodash/string/capitalize';

import manifest from '../package.json';
import routes from './routes.js';

// import ESRethink from 'express-session-rethinkdb';
// const RDBStore = ESRethink(session);
// const rDBStore = new RDBStore({
//   connectOptions: {
//     db: camelCase(manifest.name),
//     host: process.env.DB_PORT_28015_TCP_ADDR,
//     port: process.env.DB_PORT_28015_TCP_PORT
//   },
//   table: 'session',
//   sessionTimeout: 86400000,
//   flushInterval: 60000
// });

// Internal dependencies
let app = express();
let dbConnection;
let srcPath = path.join(__dirname, '../src');
let buildPath = path.join(__dirname, '../public');
let logPath = path.join(__dirname, '../logs');
let logStream = fs.createWriteStream(
  path.join(logPath, '/access.log'),
  {flags: 'w'}
);
let logFormat = JSON.stringify({
  method: ':method',
  url: ':url',
  status: ':status',
  date: ':date[iso]',
  duration: ':response-time ms',
  content_length: ':res[content-length]',
  app_name: camelCase(manifest.name),
  app_version: manifest.version,
});

app.set('port', process.env.PORT || 8888);
app.set('host', process.env.VIRTUAL_HOST);
app.set('x-powered-by', false);
app.engine('html', cons.lodash);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

if (app.get('env') === 'development') {
  app.use(errorhandler());
}
app.use(favicon(path.join(buildPath, 'favicon.png')));
app.use(logger(logFormat, {stream: logStream}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'copycat',
  saveUninitialized: false,
  resave: false,
  // cookie: { maxAge: 860000 },
  // store: rDBStore
}));
app.use(passport.initialize());
app.use(passport.session());

// rethinkdb connection
app.use((req, res, next) => {
  r.connect({
    host: process.env.DB_PORT_28015_TCP_ADDR,
    port: process.env.DB_PORT_28015_TCP_PORT,
    authKey: "",
    db: camelCase(manifest.name)
  }, function(error, conn) {
    if (error) {
      console.log(error);
    }
    else {
      req.dbConnection = conn;
      next();
    }
  });
});

app.use(stylus.middleware({
  src: srcPath,
  dest: buildPath,
  compress: false,
  debug: true,
  linenos: true,
  force: true,
  sourcemap: true,
  compile: function (str, path) {
    return stylus(str).set('filename', path).use(nib())
  }
}));
app.use(express.static(buildPath));
app.use('/', routes);

http.createServer(app).listen(app.get('port'));
console.log(`${capitalize(camelCase(manifest.name))} ${manifest.version} up and running on ${app.get('port')} mapped to ${app.get('host')}`);

// Middleware to close a connection to the database
app.use((req, res, next) => {
  req.dbConnection.close();
});
