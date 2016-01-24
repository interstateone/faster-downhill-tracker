var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({
    name: String,
    inside: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    coordinates: { type: [Number], index: '2dsphere' }
});

module.exports = mongoose.model('Point', pointSchema);
