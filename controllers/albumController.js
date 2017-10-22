var Album = require('../models/album');
var Image = require('../models/image');
var Tag = require('../models/tag');
var async = require('async');


var tag_create = function (albumid, tags) {
    async.series([
        function (callback) {
            //console.log('Tags: ' + tags);
            //console.log('Album name: ' + a.name);

            async.each(
                tags,
                function (tag, callback) {
                    //console.log(tag);
                    Tag.findOneAndUpdate(
                        { name: tag },
                        { $addToSet: { albums: albumid } },
                        { upsert: true, new: true },
                        function (err, tag) {
                            if (err) { console.log('Tag upsert err: ' + err); }
                            //console.log(tag);
                        }
                    );
                    callback();
                },
                function (err) {
                    if (err) {
                        console.log('Async tag upsert err: ' + err);
                    }
                    //console.log('Done upserting tags');
                }
            );

            callback(null);
        },
        function (callback) {
            console.log(albumid);
            Tag.find(
                { albums: albumid },
                function (err, listTags) {
                    if (err) {
                        console.log('Album create Tag find error');
                    }
                    var tagIds = listTags.map((tag) => {
                        return tag._id;
                    });
                    //console.log('List tags: ' + listTags);
                    //console.log('Tag ID list: ');
                    //console.log(tagIds);
                    callback(null, tagIds);
                }
            );
        }
    ], function (err, results) {

        var tagIdList = results[1];
        //console.log('Callback tagIds : ');
        //console.log(tagIdList);
        //console.log(a._id);

        //console.log('Album found : ');
        Album.update(
            { _id: albumid },
            { $addToSet: { tags: { $each: tagIdList } } },
            function (err, album) {
                if (err) {
                    console.log('Album find update tag error: ' + err);
                }
            }
        )
    });
}

var tag_album_remove = function (albumid, tagid) {
    var query = tagid ? { _id : tagid, albums : albumid } : { albums : albumid };

    async.series([
        function (callback) {
            Tag.update(
                query,
                { $pull: { albums: albumid } },
                { multi: true },
                function (err, result) {
                    if (err) {
                        console.log('Album deletion tag removal error : ' + err);
                        callback(err);
                    }
                    console.log('Removal complete');
                    callback(null);
                }
            );
        },
        function (callback) {
            console.log('HEEEEEEEERE');
            Tag.remove(
                { albums : { $exists : true,  $size: 0 } },
                function (err, removed) {
                    if (err) {
                        console.log('Remove empty tag error : ' + err);
                        callback(err);
                    }
                    console.log('Removed ' + removed + ' tags');
                    callback(null);
                }
            )
        }
    ], function(err, result) {
        if (err) {
            console.log('TAG ALBUM REMOVE ERROR : ' + err);
        }
    })
}

exports.album_create = function (req, res, next) {
    //console.log('Run album create');
    //console.log(req.body.albumName ? req.body.albumName : "nope!!!!");

    //console.log(req.body.albumTags);
    var tags = req.body.albumTags ? req.body.albumTags.split(/\s*[\s,]\s*/) : false;

    var album = new Album(
        {
            name: req.body.albumName,
            tags: [],
            description: req.body.albumDesc,
            images: []
        }
    );


    album.save(function (err, a) {
        if (err) {
            console.log('Album save error : ' + err);
            return next(err);
        }

        if (tags) {
            tag_create(a._id, tags);
        }

    });

    res.setHeader('Content-Type', 'application/json');
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

        Album.findById(req.query.albumid)
            .populate('images')
            .populate('tags')
            .exec(function (err, album) {
                if (err) {
                    console.log('Album find error');
                    return next(err);
                }
                console.log(album ? album : "NOPE");
                res.setHeader('Content-Type', 'application/json');
                res.send({
                    images: [],
                    album: album
                });
            });

    } else {
        Image.find()
            .exec(function (err, listImages) {
                if (err) {
                    console.log('All image find error: ' + err)
                    return next(err);
                }
                res.setHeader('Content-Type', 'application/json');
                res.send({
                    images: listImages,
                    album: {}
                });
            });
    }
}

exports.album_delete = function (req, res, next) {
    var id = req.body.albumid;

    tag_album_remove(id);

    Album.remove({ _id: id },
        function (err) {
            if (err) {
                console.log('Album delete error: ' + err);
                next(err);
            }
            res.setHeader('Content-Type', 'application/json');
            res.end();
        }
    );

}

/* exports.album_list_all_tags = function(req, res, next) {
    var 
} */

exports.album_add_tags = function (req, res, next) {
    /* console.log('ADD TAGS: ');
    console.log(req.body.albumid);
    console.log(req.body.newTags); */
    var newTagsArray = req.body.newTags.split(/\s*[\s,]\s*/);
    var id = req.body.albumid;
    //console.log(newTagsArray);

    tag_create(id, newTagsArray);

    res.setHeader('Content-Type', 'application/json');
    res.end();
}

exports.album_remove_tag = function (req, res, next) {
    console.log('TAG TO REMOVE: ')
    console.log(req.body.tagid);
    var albumid = req.body.albumid;
    var tagid = req.body.tagid;

    async.series([
        function (callback) {
            Album.update(
                { _id: albumid },
                { $pull: { tags: tagid } },
                {},
                (err) => {
                    if (err) {
                        console.log('Album remove tag error: ' + err);
                        callback(err);
                    }
                    callback(null);
                }
            );

        },
        function (callback) {
            console.log('FIRSST HERE');
            tag_album_remove(albumid, tagid);
            callback(null);
        },
    ], function (err, results) {
        res.setHeader('Content-Type', 'application/json');
        res.end();
    })

}