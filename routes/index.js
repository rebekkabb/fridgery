const express = require('express');
const router = express.Router();
const db = require("../services/database").db;

router.get('/', (req, res) => {
  const collection = db().collection('andmebaas');
  collection.find().toArray((err, items) => {
    res.render('index', {
      title : 'Fridgery'
    });
  });
});

module.exports = router;
