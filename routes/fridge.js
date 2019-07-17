const express = require('express');
const router = express.Router();
const db = require("../services/database").db;
const session = require('express-session');

router.get('/', async (req, res) => {
    const items = db().collection('items');
    const fridges = db().collection('fridges');
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

    res.render('fridge', {
        items: itemsResult,
        user: req.session.user,
        access: accessFridges
    });

});

router.post('/accessGranted', async (req, res) => {
    const collection = db().collection('fridges');
    let email = req.session.user;
    const accessEmail = req.body.email;

    let chosen = {user: email};
    let change = {$push: {
        access: accessEmail
    }};

    collection.updateOne(chosen, change, (err, response) => {
        if(err) throw err;
        res.redirect('/fridge');
    });

});

router.get('/:user', async (req, res) =>{
    const items = db().collection('items');
    const fridges = db().collection('fridges');
    const currentUser = req.session.user;
    const user = req.params.user;
    let accessFridges = await getFridges(user);
    const fridge = await fridges.findOne({user: user});

    const itemsResult = await items.find({
        fridge: fridge._id
    }).toArray();

    if( await fridges.findOne( {user: user, access : currentUser})){
        res.render('fridge', {
            items: itemsResult,
            user: user,
            access: accessFridges
        });
    } else{
        return res.status(401).send('No access.');
    }
});

async function getFridges(email){
    const fridges = db().collection('fridges');
    return await fridges.find({access: email}).toArray()
}

module.exports = router;