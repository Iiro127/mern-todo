import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Tasks() {
  const [todos, setTodos] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchTags, setSearchTags] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [activities, setActivities] = useState([]);

  const [task, setTask] = useState({
    name: '',
    content: '',
    startDate: '',
    endDate: '',
    tags: '',
    status: '',
    activityId: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchActivities();
    fetchTodos();
    fetchStatuses();
  }, []);

  // Fetch all activities for task creation.
  const fetchActivities = async () => {
      try {
          const response = await axios.get('http://localhost:5001/api/activities');
          setActivities(response.data);
      } catch (error) {
          console.error('Failed to fetch activities:', error);
      }
  };

  // Fetch all statuses for task creation.
  const fetchStatuses = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/statuses');
      setStatuses(data);
      if (data.length > 0) {
        setTask(prev => ({ ...prev, status: data[0].title }));
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  // Fetch all tasks for displaying purposes.
  const fetchTodos = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/todos');
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleChange = (e) => {
      const { name, value } = e.target;
      setTask(prevTask => ({
          ...prevTask,
          [name]: value
      }));
  };

  // Add a new task using web api.
  const addTodo = async () => {
    const newTask = {
        ...task,
        tags: task.tags.split(',').map(tag => tag.trim()),
        activityId: task.activityId
    };

    try {
        const { data } = await axios.post('http://localhost:5001/todos', newTask);
        setTodos([...todos, data]);
        setTask({ name: '', content: '', startDate: '', endDate: '', tags: '', status: '', activityId: '' });
    } catch (error) {
        console.error('Error adding task:', error);
    }
  };

  // Handle task editing.
  const editTodo = (todo) => {
    setEditId(todo._id);
    setTask({
      ...todo,
      tags: todo.tags.join(', ')
    });
  };

  // Save an edited task.
  const saveTodo = async () => {
      const updatedTask = {
          ...task,
          tags: task.tags.split(',').map(tag => tag.trim()),
          activityId: task.activityId
      };
      try {
          const { data } = await axios.put(`http://localhost:5001/todos/${editId}`, updatedTask);
          const updatedTodos = todos.map(todo => (todo._id === editId ? data : todo));
          setTodos(updatedTodos);
          setEditId(null);
          setTask({ name: '', content: '', startDate: '', endDate: '', tags: '', status: '', activityId: '' });
      } catch (error) {
          console.error('Error saving task:', error);
      }
  };

  // Delete a task by id.
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const filteredTodos = todos.filter(todo => {
    const matchesName = searchName ? todo.name.toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchesTags = searchTags ? todo.tags.some(tag => tag.toLowerCase().includes(searchTags.toLowerCase())) : true;
    const matchesDate = searchDate ? new Date(todo.endDate).toLocaleDateString() === new Date(searchDate).toLocaleDateString() : true;
  
    return matchesName && matchesTags && matchesDate;
  });
  
  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">ToDo List</h2>
      <div className="form-group">
        <input type="text" className="form-control mb-2" name="name" value={task.name} onChange={handleChange} placeholder="Task Name" />
        <textarea className="form-control mb-2" name="content" value={task.content} onChange={handleChange} placeholder="Task Content" />
        <input type="date" className="form-control mb-2" name="startDate" value={task.startDate} onChange={handleChange} placeholder="Start Date" />
        <input type="date" className="form-control mb-2" name="endDate" value={task.endDate} onChange={handleChange} placeholder="End Date" />
        <input type="text" className="form-control mb-2" name="tags" value={task.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
        
        <select className="form-control mb-2" name="status" value={task.status} onChange={handleChange}>
          {statuses.map(status => (
            <option key={status._id} value={status.title}>{status.title}</option>
          ))}
        </select>

        <select className="form-control mb-2" name="activity" value={task.activity} onChange={handleChange}>
          <option value="">Select an Activity</option>
          {activities.map((activity) => (
            <option key={activity._id} value={activity.title}>{activity.title}</option>
          ))}
        </select>

        {editId ? (
          <button className="btn btn-success" onClick={saveTodo}>Save Changes</button>
        ) : (
          <button className="btn btn-primary" onClick={addTodo}>Add Task</button>
        )}
      </div>
      <br></br>

      <div className="form-group">
        <input type="text" className="form-control mb-2" placeholder="Search by name..." value={searchName} onChange={e => setSearchName(e.target.value)} />
        <input type="text" className="form-control mb-2" placeholder="Search by tags..." value={searchTags} onChange={e => setSearchTags(e.target.value)} />
        <input type="date" className="form-control mb-2" placeholder="Search by date..." value={searchDate} onChange={e => setSearchDate(e.target.value)} />
      </div>


      <div className="row">
        {filteredTodos.map(todo => (
          <div key={todo._id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{todo.name || 'Unnamed Task'}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{todo.status || 'No Status'}</h6>
                <p className="card-text">{todo.content || 'No Content Available'}</p>
                <p>Activity: {todo.activity || 'No Activity Assigned'}</p>
                <div className="card-footer">
                  <small className="text-muted">
                    Start: {todo.startDate ? new Date(todo.startDate).toLocaleDateString() : 'N/A'} - 
                    End: {todo.endDate ? new Date(todo.endDate).toLocaleDateString() : 'N/A'}
                  </small>
                  <div>
                    <button className="btn btn-primary btn-sm" onClick={() => editTodo(todo)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteTodo(todo._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
);

}

export default Tasks;
