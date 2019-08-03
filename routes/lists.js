const express = require('express');
const router = express.Router();
const db = require("../services/database").db;

router.get('/', async (req, res) => {
    const list = db().collection('shoppingList');
    const fridges = db().collection('fridges');
    const recipes = db().collection('recipes');

    let fridge = await fridges.findOne({user: req.session.user});

    const shoppingListResult = await list.find({
        fridge: fridge._id
    }).toArray();

    const recipeListResult = await recipes.find({
        fridge: fridge._id
    }).toArray();

    res.render('lists', {
        user: req.session.user,
        shoppingList: shoppingListResult,
        recipes: recipeListResult
    });
});

router.post('/addInfo', async (req, res) => {
    const list = db().collection('shoppingList');
    let email = req.session.user;
    let info = req.body.info;

    const fridge = await getFridge(email);

    await list.insertOne({
        fridge: fridge._id,
        info: info,
        checked: false
    });
    res.redirect('/lists/');
});

router.get("/deleteAll", async (req, res) => {
    const list = db().collection('shoppingList');
    let email = req.session.user;

    const fridge = await getFridge(email);

    try {
        list.deleteMany({fridge: fridge._id});
        res.redirect('/lists');
    } catch (e) {
        res.redirect('/lists');
    }
});

router.post("/addRecipe", async (req, res) => {
    const recipes = db().collection('recipes');
    let email = req.session.user;
    const fridge = await getFridge(email);

    let name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
    let prepTime = req.body.prepTime;
    let cookingTime = req.body.cookingTime;
    let servings = req.body.servings;
    let nutritionInfo = req.body.nutritionInfo;
    let instructions = req.body.instructions;

    await recipes.insertOne({
        fridge: fridge._id,
        name: name,
        prepTime: prepTime,
        cookingTime: cookingTime,
        servings: servings,
        nutritionInfo: nutritionInfo,
        instructions: instructions
    });
    res.redirect('/lists/');
});

router.get("/deleteRecipe", async (req, res) => {
    let name = req.query.name;
    const recipes = db().collection('recipes');
    let email = req.session.user;
    const fridge = await getFridge(email);

    recipes.deleteOne({
        fridge: fridge._id,
        name: name,
    }, (err, response) => {
        if(err) throw err;
        res.redirect('/lists/');
    });
});

async function getFridge(email) {
    const fridges = db().collection('fridges');
    return await fridges.findOne({user: email})
}


module.exports = router;

