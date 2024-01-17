const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  title: String,
  description: String
});

const TimelineSchema = new mongoose.Schema({
  submissionDeadline: Date,
  notificationOfAcceptance: Date,
  finalSubmission: Date,
  conferenceDates: [Date],
  timeZone: String
});

const ConferenceSchema = new mongoose.Schema({
  title: String,
  shortName: String,
  topic: String,
  location: String,
  websiteURL: String,
  description: String,
  timeline: TimelineSchema,
  speakers: String, 
  acceptedPapers: [PaperSchema]
});

const Conference = mongoose.model('Conference', ConferenceSchema);

module.exports = Conference;

