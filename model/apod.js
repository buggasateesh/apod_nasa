var mongoose = require('mongoose');

var apodSchema = new mongoose.Schema({
    date: Date,
    explanation: String,
    hdurl: String,
    media_type: String,
    service_version: String,
    title: String,
    url: String
}, { collection: 'apod' }, { strict: false });

var apod = module.exports = mongoose.model('apod', apodSchema);