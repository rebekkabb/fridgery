const express = require('express');
const router = express.Router();
const db = require("../services/database").db;

router.get('/delete', (req, res) => {

    const collection = db().collection('fridge');
    const name = req.query.name;
    const quantity = req.query.quantity;

    console.log(name,quantity);

    collection.deleteOne({
       name: name,
       quantity: parseInt(quantity)
    }, (err, response) => {
        if(err) throw err;
        res.redirect('/fridge');
    });
});

router.post('/add', async (req, res) => {

    const collection = db().collection('fridge');
    let name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
    let quantity = req.body.quantity;

    if(quantity === '' && name === ''){
        res.redirect('/fridge');
        return;
    }

    if(quantity === ''){
        quantity = 0;
    }

    if(await collection.findOne({name:name}) === null){
        await collection.insertOne({
            name: name,
            quantity: parseInt(quantity)
        });
        res.redirect('/fridge');
    }
    else{
        res.redirect('/fridge');
    }
});

router.post('/update', (req, res) => {

    const collection = db().collection('fridge');
    let newQuantity = req.body.quantity;

    let chosen = {name: req.query.name};
    let change = {$set: {quantity: parseInt(newQuantity)}};

    collection.updateOne(chosen, change, (err, response) => {
        if(err) throw err;
        res.redirect('/fridge');
    });
});

module.exports = router;