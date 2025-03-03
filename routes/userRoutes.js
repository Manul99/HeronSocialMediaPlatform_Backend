const express = require('express');
const { register } = require('../controllers/UserControllers');
const router = express.Router();

router.post('/',register);

module.exports = router;