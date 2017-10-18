var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AlbumSchema = Schema({
    name: { type: String, max: 100, default: 'no-name' },
    tags: [{type: String, max: 100}],
    description: { type: String, required: false},
    images: [{type: Schema.ObjectId, ref: 'Image'}],
    tags: [{type: Schema.ObjectId, ref: 'Tag'}]
});

//Export model
module.exports = mongoose.model('Album', AlbumSchema);