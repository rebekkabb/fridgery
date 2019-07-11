const express = require('express');
const router = express.Router();
const db = require("../services/database").db;

router.post('/create', (req, res, next) => {
  const collection = db().collection('users');

  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;

  // TODO: let hash = bcrypt do stuff

  console.log(collection);

  // TODO: password: hash
  // TODO: check if email already exists
  collection.insertOne({
    email: email,
    username: username,
    password: password,
  }, (err, response) => {
    if (err) throw err;
    res.redirect('/fridge')
  });
});

module.exports = router;
