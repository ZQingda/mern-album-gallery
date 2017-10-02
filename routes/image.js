var express = require('express');
var multer = require('multer');
var image_controller = require('../controllers/imageController');

var router = express.Router();

var upload = multer({ dest: './public/uploads'})

/* POST image. */
router.post('/delete', image_controller.image_delete);

router.get('/', function(req, res) {
    res.send('Not implemented!!');
});

router.get('/upload', function(req, res) {
    res.send('Have to post not get');
});

router.post('/upload', upload.array('photo'), image_controller.image_post);

module.exports = router;