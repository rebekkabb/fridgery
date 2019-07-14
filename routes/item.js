const express = require('express');
const router = express.Router();
const db = require("../services/database").db;
const session = require('express-session');

router.get('/delete', async (req, res) => {

    const collection = db().collection('items');
    const name = req.query.name;
    const quantity = req.query.quantity;
    let email = req.session.user;
    const fridge = await getFridge(email);

    collection.deleteOne({
        fridge: fridge._id,
        name: name,
        quantity: parseInt(quantity)
    }, (err, response) => {
        if(err) throw err;
        res.redirect('/fridge');
    });
});

router.post('/add', async (req, res) => {
    const itemCollection = db().collection('items');

    let name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
    let quantity = req.body.quantity;
    let quantityType = req.body.quantityType;
    let email = req.session.user;

    const fridge = await getFridge(email);

    if(quantity === '' && name === ''){
        res.redirect('/fridge');
        return;
    }

    if(quantity === ''){
        quantity = 0;
    }

    if(await itemCollection.findOne({name: name, fridge: fridge._id}) === null){
        await itemCollection.insertOne({
            fridge: fridge._id,
            name: name,
            quantity: parseInt(quantity),
            quantityType: quantityType
        });
        res.redirect('/fridge');
    }
    else{
        res.redirect('/fridge');
    }
});

router.post('/update', async (req, res) => {
    const collection = db().collection('items');
    let newQuantity = req.body.quantity;
    let newQuantityType = req.body.quantityType;
    let email = req.session.user;
    const fridge = await getFridge(email);

    if(newQuantity === ''){
        if(parseInt(req.query.quantity) === 0){
            newQuantity = 0;
        }
        else{
            newQuantity = req.query.quantity;
        }
    }

    let chosen = {name: req.query.name, fridge: fridge._id};
    let change = {$set: {quantity: parseInt(newQuantity), quantityType: newQuantityType}};

    collection.updateOne(chosen, change, (err, response) => {
        if(err) throw err;
        res.redirect('/fridge');
    });
});

async function getFridge(email) {
    const fridges = db().collection('fridges');
    return await fridges.findOne({user: email})
}

module.exports = router;