const express = require('express');
const Activity = require('./models/activity');
const router = express.Router();

// Post a new activity
router.post('/', async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delet an activity by id
router.delete('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deletedActivity = await Activity.findByIdAndDelete(id);
      if (!deletedActivity) {
          return res.status(404).json({ message: "Activity not found" });
      }
      res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

module.exports = router;
