/*
  Schema to tasks
*/

const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    tags: [String],
    status: String,
    activity: { type: String }
});

const Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
