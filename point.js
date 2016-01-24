var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({
    name: String,
    date: { type: Date, default: Date.now },
    longitude: Number,
    latitude: Number
});

module.exports = mongoose.model('Point', pointSchema);
