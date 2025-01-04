import React, {useState, useEffect} from 'react';
import {createTask, fetchTasks} from "../../api/tasks.tsx";
import {useLocation} from "react-router-dom";
import {Button, Form, FormControl, FormGroup, Modal, ModalTitle} from "react-bootstrap";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const {boardId} = location.state || {};
    const [showModalAddTask, setShowModalAddTask] = useState(false);
    const [taskName, setTaskName] = useState('');

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

    const toggleModalAddTask = () => {
        setShowModalAddTask((prev) => !prev);
    };

    const handleFormSubmit = async () => {
        //TODO !!!!
        const newTask = {
            title: "zadanie 1",
            description: "opis zadania do wykonania",
            userId: 2,
            board: {
                "id": 1
            }
        }
        const response = await createTask(newTask);
        if (response?.status === 201) {
            console.log("Add task!" + taskName);
            toggleModalAddTask();
            fetchTasksData();
        }

    }

    if (loading) return <h2>Loading tasks...</h2>;

    return (
        <div>
            <h1>Tasks</h1>
            <Button variant="primary" onClick={toggleModalAddTask}>Add task</Button>
            {tasks.length > 0 ? (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            {task.title}, {task.description}, {task.status}
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
            <Modal show={showModalAddTask} onHide={toggleModalAddTask}>
                <Modal.Header>
                    <ModalTitle>Add task</ModalTitle>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <FormControl
                                onChange={(e) => setTaskName(e.target.value)}
                                type="text"
                                placeholder="Enter board name"
                                required
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModalAddTask}>Close</Button>
                    <Button variant="secondary" onClick={handleFormSubmit}>Add task!</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Tasks;
