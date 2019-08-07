const express = require('express');
const router = express.Router();
const db = require("../services/database").db;
const session = require('express-session');

router.get('/', async (req, res) => {
    const items = db().collection('items');
    const fridges = db().collection('fridges');
    const history = db().collection('itemHistory');
    let user = req.session.user;
    let accessFridges = await getFridges(user);

    let fridge = await fridges.findOne({user: req.session.user});
    if (!fridge) {
        fridge = fridges.insertOne({
            user: req.session.user,
            access: []
        })
    }
    const itemsResult = await items.find({
        fridge: fridge._id
    }).toArray();

    const itemHistory = await history.find({
        fridge: fridge._id
    }).toArray();

    res.render('fridge', {
        items: itemsResult,
        user: req.session.user,
        access: accessFridges,
        history: itemHistory,
        fridge: true
    });

});

router.post('/accessGranted', async (req, res) => {
    const collection = db().collection('fridges');
    let email = req.session.user;
    const accessEmail = req.body.email;

    let chosen = {user: email};
    let change = {
        $push: {
            access: accessEmail
        }
    };

    collection.updateOne(chosen, change, (err, response) => {
        if (err) throw err;
        res.redirect('/fridge');
    });

});

router.get('/:user', async (req, res) => {
    const items = db().collection('items');
    const fridges = db().collection('fridges');
    const currentUser = req.session.user;
    const user = req.params.user;
    let accessFridges = await getFridges(user);
    const fridge = await fridges.findOne({user: user});

    const itemsResult = await items.find({
        fridge: fridge._id
    }).toArray();

    if (await fridges.findOne({user: user, access: currentUser})) {
        res.render('friendlyFridge', {
            items: itemsResult,
            user: user,
            access: accessFridges
        });
    } else {
        return res.status(401).send('No access.');
    }
});

router.get('/:user/*', async (req, res, next) => {
    console.log("test");
    const currentUser = req.session.user;
    const user = req.params.user;
    const fridges = db().collection('fridges');

    if (await fridges.findOne({user: user, access: currentUser})) {
        next();
    } else {
        return res.status(401).send('No access to that fridge honey.');
    }
});

router.post('/:user/add', async (req, res) => {
    const itemCollection = db().collection('items');
    let email = req.params.user;
    const history = db().collection('itemHistory');
    let name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
    let quantity = req.body.quantity;
    let quantityType = req.body.quantityType;

    console.log(email);

    const fridge = await getFridge(email);

    if (quantity === '' && name === '') {
        res.redirect('/fridge/' + req.params.user);
        return;
    }

    if (quantity === '') {
        quantity = 0;
    }

    if (await itemCollection.findOne({name: name, fridge: fridge._id}) === null) {
        await history.insertOne({
            fridge: fridge._id,
            name: name,
            quantity: parseInt(quantity),
            quantityType: quantityType
        });
        await itemCollection.insertOne({
            fridge: fridge._id,
            name: name,
            quantity: parseInt(quantity),
            quantityType: quantityType
        });
        res.redirect('/fridge/' + req.params.user);
    } else {
        res.redirect('/fridge/' + req.params.user);
    }
});

router.get('/:user/delete', async (req, res) => {

    const collection = db().collection('items');
    const name = req.query.name;
    const quantity = req.query.quantity;
    let email = req.params.user;
    const fridge = await getFridge(email);

    collection.deleteOne({
        fridge: fridge._id,
        name: name,
        quantity: parseInt(quantity)
    }, (err, response) => {
        if (err) throw err;
        res.redirect('/fridge/' + req.params.user);
    });
});

router.post('/:user/update', async (req, res) => {
    const collection = db().collection('items');
    let newQuantity = req.body.quantity;
    let newQuantityType = req.body.quantityType;
    let email = req.params.user;
    const fridge = await getFridge(email);

    if (newQuantity === '') {
        if (parseInt(req.query.quantity) === 0) {
            newQuantity = 0;
        } else {
            newQuantity = req.query.quantity;
        }
    }

    let chosen = {name: req.query.name, fridge: fridge._id};
    let change = {$set: {quantity: parseInt(newQuantity), quantityType: newQuantityType}};

    collection.updateOne(chosen, change, (err, response) => {
        if (err) throw err;
        res.redirect('/fridge/' + req.params.user);
    });
});

async function getFridge(email) {
    const fridges = db().collection('fridges');
    return await fridges.findOne({user: email})
}

async function getFridges(email) {
    const fridges = db().collection('fridges');
    return await fridges.find({access: email}).toArray()
}

module.exports = router;