import React, {useState, useEffect} from 'react';
import {changeTaskStatus, createTask, deleteTask, editTasks, fetchTasks} from '../../api/tasks.tsx';
import {useLocation} from 'react-router-dom';
import {Button, Form, FormControl, FormGroup, Modal, ModalTitle} from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import './Tasks.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModalAddTask, setShowModalAddTask] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskEditModal, setTaskEditModal] = useState(false);
    const [taskToEditId, setTaskToEditId] = useState('');
    const [taskIdToDrag, setTaskIdToDrag] = useState();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const location = useLocation();
    const {boardId} = location.state || {};

    useEffect(() => {
        // console.log(windowHeight);
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [window.innerHeight]);

    const getAvailableHeight = () => windowHeight - 350; // !!!

    useEffect(() => {
        fetchTasksData().then(() => console.log('Tasks fetched successfully'));
    }, []);

    const fetchTasksData = async () => {
        if (!boardId) {
            console.error('boardId is not provided.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetchTasks(boardId);
            if (response?.status === 200 && response?.data?.length) {
                setTasks(response.data);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleModalAddTask = () => {
        setShowModalAddTask((prev) => !prev);
    };

    const handleFormSubmit = async () => {
        if (taskName === '' || taskDescription === '') {
            console.error('Fields cannot be empty');
            return;
        }

        const newTask = {
            title: taskName,
            description: taskDescription,
            userId: localStorage.getItem('userid'),
            board: {
                id: boardId,
            },
        };

        try {
            const response = await createTask(newTask);
            if (response?.status === 201) {
                console.log('Task added successfully:', response.data);
                toggleModalAddTask();
                setTaskName('');
                setTaskDescription('');
                fetchTasksData();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await deleteTask(taskId);
            if (response?.status === 200) {
                fetchTasksData();
            }
        } catch (e) {
            console.error('Error deleting task:', e.message);
        }
    };

    const handleEditTask = async (task) => {
        if (!taskName || !taskDescription) {
            console.error('Fields cannot be empty');
            return;
        }

        try {
            const response = await editTasks(task.id, taskName, taskDescription, boardId);
            if (response?.status === 200) {
                toggleModalEditTask();
                setTaskName('');
                setTaskDescription('');
                fetchTasksData();
            }
        } catch (e) {
            console.error('Error editing task:', e.message);
        }
    };

    const toggleModalEditTask = () => {
        setTaskEditModal((prev) => !prev);
    };

    const onDragStart = (start) => {
        setTaskIdToDrag(start.draggableId);
    };

    const onDragEnd = async (result) => {
        const {destination, source} = result;
        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        try {
            const response = await changeTaskStatus(taskIdToDrag, destination.droppableId);
            if (response?.status === 200) {
                fetchTasksData();
            }
        } catch (error) {
            console.error('Error changing task status:', error);
        }
    };

    const renderTask = (task, index) => (
        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="card shadow-sm mb-3"
                >
                    <div className="card-body bg-light">
                        <h5 className="card-title">{task.title}</h5>
                        <p className="card-text text-muted">{task.description}</p>
                        <div className="d-flex justify-content-between">
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={() => {
                                    setTaskName(task.title);
                                    setTaskDescription(task.description);
                                    setTaskToEditId(task.id);
                                    setTaskEditModal(true);
                                }}
                            >
                                Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );

    const renderColumn = (title, droppableId, status) => (
        <Droppable droppableId={droppableId} type="task" key={droppableId}>
            {(provided) => (
                <div className="col-md-4 mb-4">
                    <h4 className="text-center">{title}</h4>
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="p-2 rounded"
                        style={{minHeight: '300px'}}
                    >
                        {tasks
                            .filter((task) => task.status === status)
                            .map((task, index) => renderTask(task, index))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );

    if (loading) return <h2>Loading tasks...</h2>;

    return (
        <div className="tasks">
            <h1 className="mb-4">Tasks</h1>
            <Button variant="primary" onClick={toggleModalAddTask} className="mb-4"
                    size="lg"
                    style={{
                        position: 'fixed',
                        bottom: '150px',
                        right: '150px',
                        borderRadius: '10px',
                        width: '140px',
                        height: '60px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'lightblue';
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.transition = 'background-color 0.3s ease';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '';
                        e.target.style.transform = 'scale(1.00)';
                        e.target.style.transition = 'background-color 0.3s ease';
                    }}>
                Add Task
            </Button>
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="container"
                     style={{
                         maxHeight: getAvailableHeight(),
                         overflowY: 'auto',
                     }}>
                    <div className="row">
                        {renderColumn('TO DO', 'TO_DO', 'TO_DO')}
                        {renderColumn('IN PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS')}
                        {renderColumn('COMPLETED', 'COMPLETED', 'COMPLETED')}
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
                                placeholder="Enter new task name"
                                required
                            />
                            <FormControl
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                type="text"
                                placeholder="Enter new task description"
                                required
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModalEditTask}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => handleEditTask({
                        id: taskToEditId,
                        title: taskName,
                        description: taskDescription
                    })}>
                        Edit Task
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModalAddTask} onHide={toggleModalAddTask}>
                <Modal.Header>
                    <ModalTitle>Add Task</ModalTitle>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <FormControl
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                type="text"
                                placeholder="Enter task name"
                                required
                            />
                            <FormControl
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                type="text"
                                placeholder="Enter task description"
                                required
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModalAddTask}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleFormSubmit}>
                        Add Task
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Tasks;
