// models/schemas.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }
});

const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;