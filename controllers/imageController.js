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

        var image = new Image(
            {
                path: req.files[0].path,
                date: !error && exifData.exif.CreateDate ? exifData.exif.CreateDate : !error && exifData.exif.ModifyDate ? exifData.exif.ModifyDate : 'unknown',
                albums: albums,
                exif: {
                    make: !error && exifData.image.Make ? exifData.image.Make : 'unknown',
                    model: !error && exifData.image.Model ? exifData.image.Model : 'unknown',
                    fstop: !error && exifData.exif.FNumber ? exifData.exif.FNumber : 0,
                    iso: !error && exifData.exif.ISO ? exifData.exif.ISO : 0,
                    shutterSpeed: !error && exifData.exif.ShutterSpeedValue ? exifData.exif.ShutterSpeedValue : 0,
                    focalLength: !error && exifData.exif.FocalLength ? exifData.exif.FocalLength : 0
                }
            }
        );

        image.save(function (err, i) {
            if (err) { 
                console.log('Image Save error');
                return next(err); 
            } else {
                if(albums != []) {
                    albums.map((albumid) => {
                        Album.findByIdAndUpdate(albumid,
                            { '$push' : {'images' : i._id } },
                            function(err, a) {
                                if (err) {
                                    console.log('Album update error');
                                    return next(err);
                                }
                            }
                        )
                    });
                }
            }
        });

        
        

        res.end(req.file);
    });

    //res.end(req.file);
};