const express = require('express');
const router = express.Router();
const db = require("../services/database").db;
const bcrypt = require('bcrypt');
var BCRYPT_SALT_ROUNDS = 12;


router.post('/create', (req, res, next) => {
    const collection = db().collection('users');

    let email = req.body.email;
    let password = req.body.password;

    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, (err, hash) => {
        if (err) throw err;
        password = hash;

        collection.insertOne({
            email: email,
            password: password,
        }, (err, response) => {
            if (err) throw err;
            res.redirect('/')
        });
    });
});

router.post('/login', async (req, res, next) => {
    const collection = db().collection('users');

    let email = req.body.email;
    let insertedPassword = req.body.password;

    console.log(email);

    const user = await collection.findOne({email: email});

    console.log(user);
    if (!user) {
        return res.status(401).send('User not found.');
    }

    bcrypt.compare(insertedPassword, user.password, (err, result) => {
        if (result === true) {
            req.session.user = email;
            res.redirect('/fridge');
        } else {
            res.status(401).send("Wrong password");
        }
    });
});

router.get('/logout', (req, res, next) => {
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;
