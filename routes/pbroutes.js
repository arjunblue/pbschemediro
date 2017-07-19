var express = require('express');
var router = express.Router();

// Require controller modules
var jsonValidator_controller = require('../controllers/jsonSchemaValidController');



router.get('/', jsonValidator_controller.index);
router.post('/validdata', jsonValidator_controller.validJson);

module.exports = router;