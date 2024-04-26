const express = require('express');
const router = express.Router();
const Todo = require('./models/todo'); // Adjust the path as necessary
const cors = require('cors');

router.use(cors());
router.use(express.json()); // For parsing application/json

// Assuming you have some mock data or a database setup
const tasks = [
  { id: 1, name: 'Task 1', dueDate: new Date(Date.now() + 86400000) },
  { id: 2, name: 'Task 2', dueDate: new Date(Date.now() + 172800000) },
  { id: 3, name: 'Task 3', dueDate: new Date(Date.now() + 259200000) },
  // More tasks...
];

// GET all tasks
router.get('/todos', async (req, res) => {
  console.log('Received request for tasks'); // This will log each request received
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
