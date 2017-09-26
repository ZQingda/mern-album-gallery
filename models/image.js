var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ImageSchema = Schema({
    name: { type: String, max: 100, default: 'no-name' },
    path: { type: String, max: 100, required: true },
    date: { type: String, required: true },
    description: { type: String, required: false},
    albums: [{type: Schema.ObjectId, ref: 'Album', required: false}],
    exif: {
      make: { type: String, default: 'unknown' },
      model: { type: String, default: 'unknown' },
      fstop: { type: Number, default: 0 },
      iso: { type: Number, default: 0 },
      shutterSpeed: { type: Number, default: 0 },
      focalLength: { type: Number, default: 0 }
    }
});

//Export model
module.exports = mongoose.model('Image', ImageSchema);