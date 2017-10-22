var ExifImage = require('exif').ExifImage;
var Image = require('../models/image');
var Album = require('../models/album');


exports.image_post = function (req, res, next) {
    console.log(req.files[0]);
    console.log('PATH: ' + '../' + req.files[0].path);
    console.log(req.body);

    var albums = req.body.albumid === 'noid' ? [] : [req.body.albumid];

    new ExifImage({ image: req.files[0].path }, function (error, exifData) {
        if (error) {
            console.log('EXIF error: ' + error.message);
        }

        var imageInstance = {
            path: req.files[0].path,
            date: !error && exifData.exif.CreateDate ? exifData.exif.CreateDate : !error && exifData.exif.ModifyDate ? exifData.exif.ModifyDate : 'unknown',
            //albums: albums,
            exif: {
                valid : error ? false : true,
                make: !error && exifData.image.Make ? exifData.image.Make : 'unknown',
                model: !error && exifData.image.Model ? exifData.image.Model : 'unknown',
                fstop: !error && exifData.exif.FNumber ? exifData.exif.FNumber : 0,
                iso: !error && exifData.exif.ISO ? exifData.exif.ISO : 0,
                shutterSpeed: !error && exifData.exif.ShutterSpeedValue ? exifData.exif.ShutterSpeedValue : 0,
                focalLength: !error && exifData.exif.FocalLength ? exifData.exif.FocalLength : 0
            }
        }


        var image = new Image(
            imageInstance
        );

        image.save(function (err, i) {
            if (err) {
                console.log('Image Save error');
                return next(err);
            } else {
                if (albums != []) {
                    albums.map((albumid) => {
                        Album.findByIdAndUpdate(albumid,
                            { '$push': { 'images': i._id } },
                            function (err, a) {
                                if (err) {
                                    console.log('Album update error');
                                    return next(err);
                                }
                                res.setHeader('Content-Type', 'application/json');
                                res.end(req.file);
                            }
                        )
                    });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(req.file);
                }
            }
        });


        
    });

    //res.end(req.file);
};

exports.image_delete = function (req, res, next) {
    console.log('DELETING IMAGES');
    console.log(req.body);
    console.log(req.body.albumid);
    console.log(req.body.deletionIds);
    // if (req.body.albumid && req.body.albumid != 'all') {
    Album.update(
        {},
        { $pullAll: { 'images': req.body.deletionIds } },
        { multi: true },
        function (err, raw) {
            console.log('Mongo raw output: ');
            console.log(raw);
            if (err) {
                console.log('Delete from album error: ' + err);
                next(err);
            }
        });
    // }
    if (req.body.deletionIds) {
        Image.remove({ _id: { $in: req.body.deletionIds } },
            function (err) {
                if (err) {
                    console.log('Image delete error: ' + err);
                    next(err);
                }
            }
        );
    }

    res.setHeader('Content-Type', 'application/json');
    res.end();

}

exports.image_update = function(req, res, next) {
    var imageInfo = {};
    var keys = ['name', 'description', 'date'];
    keys.forEach((key, index) => {
        if (req.body[key]) imageInfo[key] = req.body[key];
    });

    console.log('IMAGEINFO : ');
    console.log(imageInfo);


    Image.findByIdAndUpdate(
        req.body.imageId,
        { $set : imageInfo},
        function(err) {
            if(err) {
                console.log('Image update error : ' + err);
            }
            res.setHeader('Content-Type', 'application/json');
            res.end();
        }
    );
}