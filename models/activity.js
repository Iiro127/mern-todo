const mongoose = require('mongoose');

//Schema for activities
const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }
});

const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;