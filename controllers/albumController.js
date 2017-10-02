var Album = require('../models/album');
var Image = require('../models/image');
var async = require('async');

exports.album_create = function (req, res, next) {
    console.log('Run album create');
    console.log(req.body.albumName ? req.body.albumName : "nope!!!!");

    var album = new Album(
        {
            name: req.body.albumName,
            description: req.body.albumDesc,
            images: []
        }
    );

    album.save(function (err) {
        if (err) { return next(err); }
    });

    res.end();
}

exports.album_list = function (req, res) {
    Album.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_albums) {
            if (err) { return next(err); }

            res.setHeader('Content-Type', 'application/json');
            res.send(list_albums);
        });
}

exports.album_get = function (req, res, next) {

    console.log("QUERY HERE : ")
    console.log(req.query);

    if (req.query.albumid) {
        async.waterfall([
            function (callback) {
                Album.findById(req.query.albumid)
                    .exec(function (err, album) {
                        if (err) {
                            console.log('Album find error');
                            return next(err);
                        }
                        console.log(album ? album : "NOPE");
                        callback(null, album);
                    });
            },
            function (album, callback) {
                Image.find({
                    '_id': { $in: album.images }
                }, function (err, listImages) {
                    if (err) {
                        console.log('Album image find error: ' + err);
                        return next(err);
                    }
                    callback(null, listImages);
                });
            }
        ], function (err, listImages) {
            console.log(listImages);
            res.setHeader('Content-Type', 'application/json');
            res.send(listImages);
        });
    } else {
        Image.find()
        .exec(function (err, listImages) {
            if (err) { 
                console.log('All image find error: ' + err)
                return next(err); 
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(listImages);
        });
    }
}

exports.album_delete = function(req, res, next) {
    Album.remove({ _id : req.body.albumid},
        function(err) {
            if(err) {
                console.log('Album delete error: ' + err);
                next(err);
            }
        }
    );
    res.end();
}