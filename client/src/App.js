import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Tasks from './Tasks';
import Activities from './Activities';

/*
  Contains the navigation bar at the top of the UI. Landing page for the app is Home.js
*/
function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">ToDo App</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/tasks">Tasks</Link>
            <Link className="nav-link" to="/activities">Activities</Link>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/activities" element={<Activities />} />
      </Routes>
    </Router>
  );
}

export default App;
