const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./taskRoutes');
const Todo = require('./models/todo');
const activityRoutes = require('./activityRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/todoDB123', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema for statuses. Includes available statuses for the user to choose.
const statusSchema = new mongoose.Schema({
  title: String,
  style: String, 
});
const Status = mongoose.model('Status', statusSchema);

const initialStatuses = [
  { title: 'New', style: 'bg-primary text-white' },
  { title: 'In Progress', style: 'bg-warning text-dark' },
  { title: 'Done', style: 'bg-success text-white' },
  { title: 'Cancelled', style: 'bg-danger text-white' }
];

// Add statuses for selection.
async function seedStatuses() {
  const existingCount = await Status.countDocuments();
  if (existingCount === 0) {
    await Status.insertMany(initialStatuses);
    console.log('Statuses seeded!');
  }
}

// Routes
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.get('/statuses', async (req, res) => {
  try {
    const statuses = await Status.find();
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Posts a new task to the MongoDB database.
app.post('/todos', async (req, res) => {
  const { name, content, startDate, endDate, tags, status, activity } = req.body;
  if (!name || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
  }
  const newTodo = new Todo({
      name,
      content,
      startDate,
      endDate,
      tags,
      status,
      activity 
  });
  try {
      await newTodo.save();
      res.json(newTodo);
  } catch (err) {
      console.error('Error saving new task:', err);
      res.status(500).json({ message: err.message });
  }
});

// Finds a task by parameters.
app.put('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).send("No item found");
    }
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


  // Route to update a todo's text and due date
app.put('/todos/edit/:id', async (req, res) => {
    const { text, dueDate } = req.body;
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        { $set: { text: text, dueDate: dueDate } },
        { new: true }
      );
      res.json(updatedTodo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Route to delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).send("No item found");
    }
    res.status(200).send("Todo deleted");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Import routing for tasks and activities.
app.use('/api/tasks', taskRoutes);
app.use('/api/activities', activityRoutes);

app.listen(PORT, () => {
  seedStatuses();
  console.log(`Server running on port ${PORT}`);
});
