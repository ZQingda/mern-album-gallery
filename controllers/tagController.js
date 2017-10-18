var Tag = require('../models/tag');
var Album = require('../models/album');
var Image = require('../models/image');

var async = require('async');

exports.tag_list = function (req, res, next) {
    Tag.find({})
        .sort([['name', 'ascending']])
        .exec(function (err, listTags) {
            if (err) {
                console.log('Tag list err : ' + err);
                return next(err);
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(listTags);
        })
}

exports.tag_get = function (req, res, next) {
    Tag.find({ name: req.body.tagName })
        .populate('albums')
        .exec(function (err, tag) {
            if (err) {
                console.log('Tag get error : ' + err);
                return next(err);
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(tag);
        })
}

exports.tag_get_images = function (req, res, next) {

    Tag.find({ name: req.body.tagName })
        .populate({
            path: 'albums',
            populate: { path: 'images' }
        })
        .exec(function (err, tag) {
            if (err) {
                console.log('Tag get error : ' + err);
                return next(err);
            }

            var allImages = tag.albums.reduce(function (total, current) {
                return total.concat(current.images);
            }, []);

            res.setHeader('Content-Type', 'application//json');
            res.send(allImages);

        })

}
