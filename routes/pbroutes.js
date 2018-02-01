var express = require('express');
var router = express.Router();

// Require controller modules
var jsonValidator_controller = require('../controllers/jsonSchemaValidController');
//var nxhook = require('../controllers/nxhook');
var xmlgenerate = require('../controllers/generateXML');




router.get('/', jsonValidator_controller.index);
router.post('/validdata', jsonValidator_controller.validJson);
//router.post('/sqspush', nxhook.sqspush);
//router.get('/sqspull', nxhook.sqspull);
router.post('/generateXmlForOTP',xmlgenerate.createXmlFile);


module.exports = router;