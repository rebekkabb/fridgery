const express = require('express');
const router = express.Router();
const db = require("../services/database").db;
const session = require('express-session');

router.get('/', async (req, res) => {
    const items = db().collection('items');
    const fridges = db().collection('fridges');
    let fridge = await fridges.findOne({user: req.session.user});
    if (!fridge) {
        fridge = fridges.insertOne({
            user: req.session.user
        })
    }
    const itemsResult = await items.find({
        fridge: fridge._id
    }).toArray();
    res.render('fridge', {
        items: itemsResult,
        user: req.session.user
    });

});

module.exports = router;