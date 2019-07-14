const express = require('express');
const router = express.Router();
const db = require("../services/database").db;

router.get('/', (req, res) => {
    const collection = db().collection('items');
    collection.find().toArray((err, items) => {
        res.render('fridge', {
            people: items
        });
    });
});

module.exports = router;