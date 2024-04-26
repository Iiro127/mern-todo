const express = require('express');
const router = express.Router();
const Todo = require('./models/todo');
const cors = require('cors');

router.use(cors());
router.use(express.json());

// Get all tasks
router.get('/todos', async (req, res) => {
  console.log('Received request for tasks'); // For logging purposes
    try {
        const todos = await Todo.find().sort({ endDate: -1 }).limit(5);
        if (!todos.length) {
            return res.status(404).json({ message: "No tasks found" });
        }
        res.json(todos);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
