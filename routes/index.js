const express = require('express');
const router = express.Router();
const db = require("../services/database").db;
const google = require('../services/google-util');

router.get('/', (req, res) => {
  const collection = db().collection('andmebaas');
  collection.find().toArray((err, items) => {
    res.render('index', {
      title : 'Fridgery',
      index: true,
      googleLogin: google.urlGoogle()
    });
  });
});

module.exports = router;
