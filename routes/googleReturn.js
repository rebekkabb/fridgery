const express = require('express');
const router = express.Router();
const db = require("../services/database").db;
const google = require("../services/google-util");

router.get('/callback', async (req, res, next) => {
    const collection = db().collection('users');
    const googleUser = await google.getGoogleAccountFromCode(req.query.code);

    let email = googleUser.email;

    const user = await collection.findOne({email: email});

    if (!user) {
        await collection.insertOne({
            email: email,
            type: 'google',
        });
    }

    if (email) {
        req.session.user = email;
        res.redirect('/fridge');
    }
});

module.exports = router;
