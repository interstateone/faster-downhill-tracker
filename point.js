var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({
    name: String,
    inside: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    longitude: Number,
    latitude: Number
});

module.exports = mongoose.model('Point', pointSchema);
