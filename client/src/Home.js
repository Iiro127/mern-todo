import React, { useState, useEffect } from 'react';
import axios from 'axios';

/*
    Home page. Also serves the role of the landing page.
*/

function Home() {
    const [tasks, setTasks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [number, setNumber] = useState(null); 

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                console.log('Fetching tasks...');  // For logging purposes
                const response = await axios.get('http://localhost:5001/api/tasks/todos');
                setTasks(response.data);

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

                //Fetch the amount of tasks the user has created (statistics)
                try {
                    console.log('Fetching number...'); // For logging purposes
                    const response = await axios.get('http://localhost:5118/Tasks/getNumber');
                    console.log('Number fetched:', response.data); // Log the fetched number
                    setNumber(response.data.number);
                
                } catch (error) {
                    console.error('Failed to fetch number:', error);
                }
                
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
                setNotifications(prev => [...new Set([...prev, "Failed to fetch tasks."])]);
            }
        };

        fetchTasks();
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
            <div className="number-section">
                {number !== null ? (
                    <h3>You have created {number} tasks so far.</h3>
                ) : (
                    <h3>Loading task amount...</h3>
                )}
            </div>

        </div>
    );
}

export default Home;
