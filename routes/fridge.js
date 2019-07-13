const express = require('express');
const router = express.Router();
const db = require("../services/database").db;

router.get('/', requiresLogin, (req, res) => {
    const collection = db().collection('fridge');
    collection.find().toArray((err, items) => {
        res.render('fridge', {
            people: items
        });
    });
});

function requiresLogin(req, res, next) {
    if (req.session && req.session.user) {
        console.log(req.session.user);
        return next();
    } else {
        var err = new Error('You must be logged in to see this page');
        err.status = 401;
        return next(err);
    }
}

module.exports = router;