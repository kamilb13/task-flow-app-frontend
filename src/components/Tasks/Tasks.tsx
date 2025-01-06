import React, {useState, useEffect} from 'react';
import {changeTaskStatus, createTask, deleteTask, editTasks, fetchTasks} from "../../api/tasks.tsx";
import {useLocation} from "react-router-dom";
import {Button, Form, FormCheck, FormControl, FormGroup, Modal, ModalTitle} from "react-bootstrap";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

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

            console.log("Add task!" + JSON.stringify(response.data));
            toggleModalAddTask();
            setTaskName('');
            setTaskDescription('');
            fetchTasksData();
        }
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
            if(response?.status === 200) {
                toggleModalEditTask();
                setTaskName('');
                setTaskDescription('');
                fetchTasksData();
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(source.index, 1);
        movedTask.status = destination.droppableId;

        updatedTasks.splice(destination.index, 0, movedTask);
        // setTasks(updatedTasks);

        console.log(movedTask.id, movedTask.status)
        changeTaskStatus(movedTask.id, movedTask.status);
    };

    return (
        <div>
            <h1 className="mb-4">Tasks</h1>
            <Button variant="primary" onClick={toggleModalAddTask} className="mb-4">Add Task</Button>

            {/*<div className="container">*/}
            {/*    <div className="row">*/}
            {/*        /!* TO_DO Section *!/*/}
            {/*        <div className="col-md-4">*/}
            {/*            {tasks.filter(task => task.status === 'TO_DO').length > 0 ? (*/}
            {/*                <div className="card mb-4">*/}
            {/*                    <div className="card-body">*/}
            {/*                        <h2 className="card-title text-center">TODO</h2>*/}
            {/*                        <ul className="list-group">*/}
            {/*                            {tasks.filter(task => task.status === 'TO_DO').map(task => (*/}
            {/*                                <li key={task.id}*/}
            {/*                                    className="list-group-item d-flex justify-content-between align-items-center">*/}
            {/*                                    <div>*/}
            {/*                                        <strong>{task.title}</strong>*/}
            {/*                                        <p>{task.description}</p>*/}
            {/*                                    </div>*/}
            {/*                                    <div>*/}
            {/*                                        <Button variant="danger" size="sm"*/}
            {/*                                                onClick={() => handelDeleteTask(task.id)}*/}
            {/*                                                className="mr-2">Delete</Button>*/}
            {/*                                        <Button variant="warning" size="sm" onClick={() => {*/}
            {/*                                            toggleModalEditTask();*/}
            {/*                                            setTaskName(task.title);*/}
            {/*                                            setTaskDescription(task.description);*/}
            {/*                                            setTaskToEditId(task.id);*/}
            {/*                                        }} className="mr-2">Edit</Button>*/}
            {/*                                        <Button variant="info" size="sm" onClick={() => {*/}
            {/*                                            toggleModalChange();*/}
            {/*                                            setTaskIdToChangeStatus(task.id);*/}
            {/*                                        }}>Change Status</Button>*/}
            {/*                                    </div>*/}
            {/*                                </li>*/}
            {/*                            ))}*/}
            {/*                        </ul>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ) : (*/}
            {/*                <h3>No TODO tasks found</h3>*/}
            {/*            )}*/}
            {/*        </div>*/}

            {/*        /!* IN_PROGRESS Section *!/*/}
            {/*        <div className="col-md-4">*/}
            {/*            {tasks.filter(task => task.status === 'IN_PROGRESS').length > 0 ? (*/}
            {/*                <div className="card mb-4">*/}
            {/*                    <div className="card-body">*/}
            {/*                        <h2 className="card-title text-center">IN PROGRESS</h2>*/}
            {/*                        <ul className="list-group">*/}
            {/*                            {tasks.filter(task => task.status === 'IN_PROGRESS').map(task => (*/}
            {/*                                <li key={task.id}*/}
            {/*                                    className="list-group-item d-flex justify-content-between align-items-center">*/}
            {/*                                    <div>*/}
            {/*                                        <strong>{task.title}</strong>*/}
            {/*                                        <p>{task.description}</p>*/}
            {/*                                    </div>*/}
            {/*                                    <div>*/}
            {/*                                        <Button variant="danger" size="sm"*/}
            {/*                                                onClick={() => handelDeleteTask(task.id)}*/}
            {/*                                                className="mr-2">Delete</Button>*/}
            {/*                                        <Button variant="warning" size="sm" onClick={() => {*/}
            {/*                                            toggleModalEditTask();*/}
            {/*                                            setTaskName(task.title);*/}
            {/*                                            setTaskDescription(task.description);*/}
            {/*                                            setTaskToEditId(task.id);*/}
            {/*                                        }} className="mr-2">Edit</Button>*/}
            {/*                                        <Button variant="info" size="sm" onClick={() => {*/}
            {/*                                            toggleModalChange();*/}
            {/*                                            setTaskIdToChangeStatus(task.id);*/}
            {/*                                        }}>Change Status</Button>*/}
            {/*                                    </div>*/}
            {/*                                </li>*/}
            {/*                            ))}*/}
            {/*                        </ul>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ) : (*/}
            {/*                <h3>No IN PROGRESS tasks found</h3>*/}
            {/*            )}*/}
            {/*        </div>*/}

            {/*        /!* COMPLETED Section *!/*/}
            {/*        <div className="col-md-4">*/}
            {/*            {tasks.filter(task => task.status === 'COMPLETED').length > 0 ? (*/}
            {/*                <div className="card mb-4">*/}
            {/*                    <div className="card-body">*/}
            {/*                        <h2 className="card-title text-center">COMPLETED</h2>*/}
            {/*                        <ul className="list-group">*/}
            {/*                            {tasks.filter(task => task.status === 'COMPLETED').map(task => (*/}
            {/*                                <li key={task.id}*/}
            {/*                                    className="list-group-item d-flex justify-content-between align-items-center">*/}
            {/*                                    <div>*/}
            {/*                                        <strong>{task.title}</strong>*/}
            {/*                                        <p>{task.description}</p>*/}
            {/*                                    </div>*/}
            {/*                                    <div>*/}
            {/*                                        <Button variant="danger" size="sm"*/}
            {/*                                                onClick={() => handelDeleteTask(task.id)}*/}
            {/*                                                className="mr-2">Delete</Button>*/}
            {/*                                        <Button variant="warning" size="sm" onClick={() => {*/}
            {/*                                            toggleModalEditTask();*/}
            {/*                                            setTaskName(task.title);*/}
            {/*                                            setTaskDescription(task.description);*/}
            {/*                                            setTaskToEditId(task.id);*/}
            {/*                                        }} className="mr-2">Edit</Button>*/}
            {/*                                        <Button variant="info" size="sm" onClick={() => {*/}
            {/*                                            toggleModalChange();*/}
            {/*                                            setTaskIdToChangeStatus(task.id);*/}
            {/*                                        }}>Change Status</Button>*/}
            {/*                                    </div>*/}
            {/*                                </li>*/}
            {/*                            ))}*/}
            {/*                        </ul>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ) : (*/}
            {/*                <h3>No COMPLETED tasks found</h3>*/}
            {/*            )}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="container">
                    <div className="row">
                        {/* TO_DO Section */}
                        <Droppable droppableId="TO_DO" type="task">
                            {(provided) => (
                                <div className="col-md-4" ref={provided.innerRef} {...provided.droppableProps}>
                                    <h2 className="text-center">TO DO</h2>
                                    {tasks.filter(task => task.status === 'TO_DO').map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided) => {
                                                console.log("Draggable task.id:", task);
                                                console.log("Draggable task.id:", task.id);
                                                return (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="card mb-4"
                                                    >
                                                        <div className="card-body">
                                                            <strong>{task.title}</strong>
                                                            <p>{task.id}</p>
                                                            <Button variant="danger" size="sm" onClick={() => handelDeleteTask(task.id)} className="mr-2">Delete</Button>
                                                            <Button variant="warning" size="sm" onClick={() => {
                                                                setTaskName(task.title);
                                                                setTaskDescription(task.description);
                                                                setTaskToEditId(task.id);
                                                                setTaskEditModal(true);
                                                            }} className="mr-2">Edit</Button>
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        </Draggable>

                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        {/* IN_PROGRESS Section */}
                        <Droppable droppableId="IN_PROGRESS" type="task">
                            {(provided) => (
                                <div className="col-md-4" ref={provided.innerRef} {...provided.droppableProps}>
                                    <h2 className="text-center">IN PROGRESS</h2>
                                    {tasks.filter(task => task.status === 'IN_PROGRESS').map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="card mb-4"
                                                >
                                                    <div className="card-body">
                                                        <strong>{task.title}</strong>
                                                        <p>{task.description}</p>
                                                        <Button variant="danger" size="sm" onClick={() => handelDeleteTask(task.id)} className="mr-2">Delete</Button>
                                                        <Button variant="warning" size="sm" onClick={() => {
                                                            setTaskName(task.title);
                                                            setTaskDescription(task.description);
                                                            setTaskToEditId(task.id);
                                                            setTaskEditModal(true);
                                                        }} className="mr-2">Edit</Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        {/* COMPLETED Section */}
                        <Droppable droppableId="COMPLETED" type="task">
                            {(provided) => (
                                <div className="col-md-4" ref={provided.innerRef} {...provided.droppableProps}>
                                    <h2 className="text-center">COMPLETED</h2>
                                    {tasks.filter(task => task.status === 'COMPLETED').map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="card mb-4"
                                                >
                                                    <div className="card-body">
                                                        <strong>{task.title}</strong>
                                                        <p>{task.description}</p>
                                                        <Button variant="danger" size="sm" onClick={() => handelDeleteTask(task.id)} className="mr-2">Delete</Button>
                                                        <Button variant="warning" size="sm" onClick={() => {
                                                            setTaskName(task.title);
                                                            setTaskDescription(task.description);
                                                            setTaskToEditId(task.id);
                                                            setTaskEditModal(true);
                                                        }} className="mr-2">Edit</Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            </DragDropContext>
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