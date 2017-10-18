var express = require('express');
var tag_controller = require('../controllers/tagController.js');

var router = express.Router();

router.get('/list', tag_controller.tag_list);

router.get('/get', tag_controller.tag_get);

router.get('/getall', tag_controller.tag_get_images);

module.exports = router;