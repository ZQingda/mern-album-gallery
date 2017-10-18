var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TagSchema = Schema({
    name: {type: String, max: 100, required: true, unique: true},
    albums: [{type: Schema.ObjectId, ref: 'Album'}]
});

module.exports = mongoose.model('Tag', TagSchema);