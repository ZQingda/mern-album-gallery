var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AlbumSchema = Schema({
    name: { type: String, max: 100, default: 'no-name' },
    description: { type: String, required: false},
    images: [{type: Schema.ObjectId, ref: 'Image'}],
});

//Export model
module.exports = mongoose.model('Album', AlbumSchema);