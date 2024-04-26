import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'


function Activities() {
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const { data } = await axios.get('http://localhost:5001/api/activities');
    setActivities(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5001/api/activities', { title });
      setActivities([...activities, data]);
      setTitle('');
    } catch (error) {
      console.error('Failed to create activity:', error);
    }
  };

  const deleteActivity = async (id) => {
      try {
          await axios.delete(`http://localhost:5001/api/activities/${id}`);
          setActivities(activities.filter(activity => activity._id !== id));
      } catch (error) {
          console.error('Failed to delete activity:', error);
      }
  };

  return (
    <div className="container mt-5">
      <h2>Manage activities</h2>
      <div className="form-group">
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Activity Title"
          required
        />
        <button type="submit">Add Activity</button>
      </form>
      </div>
      <ul>
          {activities.map(activity => (
              <li key={activity._id}>
                  {activity.title}
                  <button className="btn btn-danger btn-sm" onClick={() => deleteActivity(activity._id)}>Delete</button>
              </li>
          ))}
      </ul>
    </div>
  );
}

export default Activities;
