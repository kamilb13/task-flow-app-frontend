import React, {useState, useEffect} from 'react';
import {changeTaskStatus, createTask, deleteTask, editTasks, fetchTasks} from "../../api/tasks.tsx";
import {useLocation} from "react-router-dom";
import {Button, Form, FormCheck, FormControl, FormGroup, Modal, ModalTitle} from "react-bootstrap";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const {boardId} = location.state || {};
    const [showModalAddTask, setShowModalAddTask] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [status, setStatus] = useState('');
    const [taskIdToChangeStatus, setTaskIdToChangeStatus] = useState('');
    const [taskEditModal, setTaskEditModal] = useState(false);
    const [taskToEditId, setTaskToEditId] = useState('');

    const [statusChangeModal, setStatusChangeModal] = useState(false);
    const toggleModalChange = () => {
        setStatusChangeModal(!statusChangeModal);
    }

    const toggleModalEditTask = () => {
        setTaskEditModal(!taskEditModal);
    }

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
        if (taskName === '' || taskDescription === '') {
            return;
        }
        const newTask = {
            title: taskName,
            description: taskDescription,
            userId: localStorage.getItem("userid"),
            board: {
                id: boardId
            }
        }
        const response = await createTask(newTask);
        if (response?.status === 201) {
            // console.log("Add task!" + taskName);
            toggleModalAddTask();
            setTaskName('');
            setTaskDescription('');
            fetchTasksData();
        }
    }

    const handleChangeStatus = () => {

    }



    if (loading) return <h2>Loading tasks...</h2>;

    const submitCheckBox = async () => {
        console.log("submitCheckBox", status);
        try {
            const response = await changeTaskStatus(taskIdToChangeStatus, status);
            console.log("RESPONSE " + response);
            if (response?.status === 200) {
                fetchTasksData();
            }
        } catch (error) {
            console.log(error.message);
        }
        toggleModalChange();
        setStatus(null);
    }

    const handleStatusChange = (e) => {
        const {value} = e.target;
        setStatus(value);
    };

    const handelDeleteTask = async (taskId) => {
        try {
            const response = await deleteTask(taskId);
            console.log(response?.status);
            if (response?.status === 200) {
                fetchTasksData();
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    const handelEditTask = async () => {
        try {
            const response = await editTasks(taskToEditId, taskName, taskDescription, boardId);
        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <div>
            <h1>Tasks</h1>
            <Button variant="primary" onClick={toggleModalAddTask}>Add task</Button>
            {tasks.length > 0 ? (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            {task.id}, {task.title}, {task.description}, {task.status}
                            <Button onClick={() => handelDeleteTask(task.id)}>
                                Delete task
                            </Button>
                            <Button onClick={() => {
                                toggleModalEditTask();
                                setTaskName(task.title);
                                setTaskDescription(task.description);
                                setTaskToEditId(task.id);
                            }}>
                                Edit task
                            </Button>
                            <Button onClick={() => {
                                toggleModalChange();
                                setTaskIdToChangeStatus(task.id);
                            }}>
                                Change Status
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <h3>No tasks found</h3>
            )}
            <Modal show={taskEditModal} onHide={toggleModalEditTask}>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <FormControl
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                type="text"
                                placeholder="Enter new board name"
                                required
                            />
                            <FormControl
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                type="text"
                                placeholder="Enter new board description"
                                required
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModalEditTask}>Cancel</Button>
                    <Button variant="secondary" onClick={handelEditTask}>Edit Task!</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={statusChangeModal} onHide={toggleModalChange}>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <FormCheck
                                type="radio"
                                label="To Do"
                                value="to_do"
                                checked={status === 'to_do'}
                                onChange={handleStatusChange}
                            />
                            <FormCheck
                                type="radio"
                                label="In Progress"
                                value="in_Progress"
                                checked={status === 'in_Progress'}
                                onChange={handleStatusChange}
                            />
                            <FormCheck
                                type="radio"
                                label="Completed"
                                value="completed"
                                checked={status === 'completed'}
                                onChange={handleStatusChange}
                            />
                        </FormGroup>
                    </Form>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={submitCheckBox}>Change status task!</Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
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
                            <FormControl
                                onChange={(e) => setTaskDescription(e.target.value)}
                                type="text"
                                placeholder="Enter board description"
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
