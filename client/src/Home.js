import React, { useState, useEffect } from 'react';
import axios from 'axios';

/*
    Home page. Also serves the role of the landing page.
*/

function Home() {
    const [tasks, setTasks] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

        // Notification functionality. Adds a notification if a task is overdue.
        
        const fetchTasks = async () => {
            try {
                console.log('Fetching tasks...');  // For logging purposes
                const response = await axios.get('http://localhost:5001/api/tasks/todos');
                setTasks(response.data);

                // For some reason the notifications were printed twice. Had to add a functionality to remove duplicates.

                const newNotifications = response.data.reduce((acc, task) => {
                    if (new Date(task.endDate) < new Date()) {
                        const message = `Task "${task.name}" is overdue!`;
                        if (!acc.includes(message)) {
                            acc.push(message);
                        }
                    }
                    return acc;
                }, []);

                setNotifications(prev => [...new Set([...prev, ...newNotifications])]);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
                setNotifications(prev => [...new Set([...prev, "Failed to fetch tasks."])]);
            }
        };
        fetchTasks(); // Display tasks
    }, []);

    return (
        <div className="container mt-5">
            <h2>Welcome to the Home Page</h2>
            <div className="notifications">
                <h3>Notifications</h3>
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <p key={index}>{notification}</p>
                    ))
                ) : (
                    <p>No notifications.</p>
                )}
            </div>
            <div className="latest-tasks">
                <h3>Latest Tasks</h3>
                <ul>
                    {tasks.map(task => (
                        <li key={task._id}>{task.name} - Due: {new Date(task.endDate).toLocaleDateString()}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;
