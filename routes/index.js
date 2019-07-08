const express = require('express');
const router = express.Router();
const db = require("../services/database").db;

/* GET home page. */
router.get('/', (req, res, next) => {
  const collection = db().collection('andmebaas');
  collection.find().toArray((err, items) => {
    res.render('index', {
      title: 'fRIDG',
      people: items
    });
  });
});

module.exports = router;
