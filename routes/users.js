const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/:inimene', (req, res, next) => {
  res.send(req.params.inimene);
});

module.exports = router;
