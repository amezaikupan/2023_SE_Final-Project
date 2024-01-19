const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  title: String,
  description: String
});

const TimelineSchema = new mongoose.Schema({
  'conferenceDates': [Date],
  'abstracts/full-textPaperSubmissionDeadline': Date,
  'notificationOfAcceptance/rejection': Date,
  'finalPaper(cameraReady)Submission&EarlyBirdRegistrationDeadline': Date,
  timeZone: String
});

const ConferenceSchema = new mongoose.Schema({
  title: String,
  shortName: String,
  topic: String,
  location: String,
  websiteUrl: String,
  description: String,
  timeline: TimelineSchema,
  speakers: String, 
  acceptedPapers: [PaperSchema]
});

const Conference = mongoose.model('Conference', ConferenceSchema);

module.exports = Conference;

