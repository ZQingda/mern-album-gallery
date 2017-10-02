var express = require('express');
var multer = require('multer');
var album_controller = require('../controllers/albumController');

var router = express.Router();

router.get('/create', function(req, res) {
    res.send('Have to post not get');
});

router.post('/create', album_controller.album_create);

router.post('/delete', album_controller.album_delete);

router.get('/list', album_controller.album_list);

router.get('/get', album_controller.album_get);

module.exports = router;