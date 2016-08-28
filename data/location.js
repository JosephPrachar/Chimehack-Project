// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cloudsql = require('./cloudsql.js');
var router = express.Router();

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({ extended: false }));

// Set Content-Type for all responses for these routes
router.use(function (req, res, next) {
  res.set('Content-Type', 'text/html');
  next();
});

/**
 * POST /books/add
 *
 * Create a location.
 */
// [START add_post]
router.post('/add', function insert (req, res, next) {
  console.log("Add (post) route hit");
  var data = req.body;

  // Save the data to the database.
  cloudsql.create(data, function (err, savedData) {
    if (err) {
      return next(err);
    }
    res.redirect(req.baseUrl + '/' + savedData.id);
  });
});
// [END add_post]

router.post('/addquest', function insert2 (req, res, next) {
  console.log("Add quest (post) route hit");
  var data = req.body;

  cloudsql.create_quest(data, function(err, savedData) {
    if (err) {
      return next(err);
    }
  });
  res.redirect(req.baseUrl);
})

/**
 * GET /books/:id/edit
 *
 * Display a book for editing.
 */
router.get('/:location/edit', function editForm (req, res, next) {
  cloudsql.read(req.params.username, function (err, entity) {
    if (err) {
      return next(err);
    }
    res.redirect(req.baseUrl);
  });
});

/**
 * POST /books/:id/edit
 *
 * Update a book.
 */
router.post('/:location/edit', function update (req, res, next) {
  var data = req.body;

  cloudsql.update(req.params, data, function (err, savedData) {
    if (err) {
      return next(err);
    }
    res.redirect(req.baseUrl + '/' + savedData.id);
  });
});

/**
 * GET /books/:id
 *
 * Display a book.
 */
router.get('/:location', function get (req, res, next) {
  cloudsql.read(req.params.username, function (err, entity) {
    if (err) {
      return next(err);
    }
    res.redirect(req.baseUrl);
  });
});

/**
 * GET /books/:id/delete
 *
 * Delete a book.
 */
router.get('/:location/delete', function _delete (req, res, next) {
  cloudsql.delete(req.params.username, function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(req.baseUrl);
  });
});

/**
 * Errors on "/books/*" routes.
 */
router.use(function handleRpcError (err, req, res, next) {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = err.message;
  next(err);
});

module.exports = router;
