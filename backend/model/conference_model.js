const mongoose = require('mongoose')

const ConferenceSchema = new mongoose.Schema({
    Title: String,
    ShortName: String,
    Category: String,
    Location: String,
    WebsiteURL: String
    // TimeLine: Object,
    // Speakers: Object,
    // Acceptedpapers: Object
})

const ConferenceModel = mongoose.model('conferences', ConferenceSchema)
module.exports = ConferenceModel