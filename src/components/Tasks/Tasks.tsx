import React, {useState, useEffect} from 'react';
import {fetchTasks} from "../../api/tasks.tsx";
import {useLocation} from "react-router-dom";
import {Button} from "react-bootstrap";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const {boardId} = location.state || {};

    useEffect(() => {
        fetchTasksData();
    }, []);

    const fetchTasksData = async () => {
        if (!boardId) {
            console.error("boardId is not provided.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetchTasks(boardId);
            if (response?.status === 200) {
                setTasks(response?.data);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <h2>Loading tasks...</h2>;

    return (
        <div>
            <h1>Tasks</h1>
            <Button variant="primary" >Add task</Button>
            {tasks.length > 0 ? (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            {task.title}, {task.description}
                            <Button>
                                Delete task
                            </Button>
                            <Button>
                                Edit task
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <h3>No tasks found</h3>
            )}
        </div>
    );
};

export default Tasks;
