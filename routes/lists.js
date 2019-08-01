const express = require('express');
const router = express.Router();
const db = require("../services/database").db;

router.get('/', async (req, res) => {



    res.render('lists', {
        user: req.session.user,
    });

});

module.exports = router;

