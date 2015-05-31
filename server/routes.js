import express from 'express';
import browserify from 'browserify';
import React from 'react';
import passport from 'passport';
import path from 'path';
import at from 'lodash/collection/at';
import startCase from 'lodash/string/startCase';

import helpers from './lib/helpers-routes';
import manifest from '../package.json';

let router = express.Router();
const basepath = path.join(__dirname);

/**
 * Component Routes
 */
router.get('/sandbox.js', (req, res, next) => {
  const sandbox = path.join(basepath, '../src', 'sandbox.jsx');
  const b = browserify();

  res.setHeader('content-type', 'text/javascript');

  b.require('react', {expose: 'react'});
  b.require(sandbox, {expose: 'sandbox'});

  helpers.getAllAppComponentNames((componentNames) => {
    componentNames.forEach((componentName) => {
      const component = path.join(basepath, `../src/components/${componentName}/view.jsx`);

      b.require(component, {expose: componentName});
    });

    b.bundle()
      .on('error', (error) => {
        var errorMessage = [error.name, ': "', error.description, '" in ', error.filename, ' at line number ', error.lineNumber].join('');
        console.error(errorMessage, error);
        // due to Chrome not displaying response data in non 200 states need to expose the error message via a console.error
        res.send('console.error(\'' + errorMessage + '\');');
      })
      .pipe(res);
  });
});
router.get('/sandbox', (req, res) => {
  res.render('sandbox');
});
router.get('/components/:component.js', (req, res, next) => {
  const filename = path.join(basepath, '../src/components', req.params.component, 'view.jsx');
  const sandbox = path.join(basepath, '../src/components', req.params.component, 'sandbox.jsx');
  const b = browserify();

  b.require('react', {expose: 'react'});
  b.require('moment', {expose: 'moment'});
  b.require(filename, {expose: req.params.component});
  b.require(sandbox, {expose: 'sandbox'});

  res.setHeader('content-type', 'text/javascript');

  // catch file system errors, such as test.js being unreadable
  b.on('error', (error) => {
    console.error('browserify error', error);

    res.send('console.error(\'' + errorMessage + '\');');
  });

  b.bundle()
    .on('error', (error) => {
      console.log("b.bundle() error", error);

      const errorMessage = [error.name, ': "', error.description, '" in ', error.filename, ' at line number ', error.lineNumber].join('');
      // due to Chrome not displaying response data in non 200 states need to expose the error message via a console.error
      res.send('console.error(\'' + errorMessage + '\');');
    })
    .pipe(res);
});
router.get('/components/:component', (req, res) => {
  const name = req.params.component;
  const symbol = name.toLowerCase();
  const uri = helpers.toPath(`/components/${symbol}.js`);

  res.render('component', {
    component_uri: uri,
    component_name: name
  });
});
router.get('/components', (req, res) => {
  helpers.getAllAppComponentSandboxNames((componentNames) => {
    res.render('components', {
      components: componentNames
    });
  });
});

/**
 * App Routes
 */
router.get('/*', (req, res) => {
  // var App = React.createFactory(require('../src/components/main/view.jsx'));
  res.render('index', {
    title: startCase(manifest.name),
    // app: React.renderToString(App())
  });
});

export default router;
