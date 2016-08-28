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

var extend = require('lodash').assign;
var mysql = require('mysql');

function getConnection () {
  return mysql.createConnection(extend({
    database: 'chimehack'
  }, {
    host: '104.198.230.163',
    user: 'root',
    password: 'root',
    port: '3306'
  }));
}

// [START create]
function create (data, cb) {
  var connection = getConnection();
  connection.query('INSERT INTO `location` SET ?', data, function (err, res) {
    if (err) {
      return cb(err);
    }
    read(res.insertId, cb);
  });
  connection.end();
}
// [END create]

function read (id, cb) {
  var connection = getConnection();
  connection.query(
    'SELECT * FROM `location` WHERE `id` = ?', id, function (err, results) {
      if (err) {
        return cb(err);
      }
      if (!results.length) {
        return cb({
          code: 404,
          message: 'Not found'
        });
      }
      cb(null, results[0]);
    });
  connection.end();
}

// [START update]
function update (id, data, cb) {
  var connection = getConnection();
  connection.query(
    'UPDATE `location` SET ? WHERE `id` = ?', [data, id], function (err) {
      if (err) {
        return cb(err);
      }
      read(id, cb);
    });
  connection.end();
}
// [END update]

function _delete (id, cb) {
  var connection = getConnection();
  connection.query('DELETE FROM `location` WHERE `id` = ?', id, cb);
  connection.end();
}

module.exports = {
  createSchema: createSchema,
  create: create,
  read: read,
  update: update,
  delete: _delete
};

if (module === require.main) {
  console.log(
    'Running this script directly will allow you to initialize your mysql ' +
    'database.\n This script will not modify any existing tables.\n');

  createSchema();
}

function createSchema () {
  var connection = getConnection();
  connection.query(
    'CREATE DATABASE IF NOT EXISTS `chimehack`; ' +
    'USE `chimehack`; ' +
    'CREATE TABLE IF NOT EXISTS locationtbl ( ' +
    'id INT UNSIGNED NOT NULL AUTO_INCREMENT, ' +
    'username VARCHAR(255) NULL, ' +
    'location VARCHAR(255) NULL, ' +
    'PRIMARY KEY (id));',
    function (err) {
      if (err) {
        throw err;
      }
      console.log('Successfully created schema');
      connection.end();
    }
  );
}
