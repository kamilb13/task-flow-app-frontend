import React, {useState, useEffect} from 'react';
import {
    changeTaskStatus,
    createTask,
    deleteTask,
    editTasks,
    fetchTasks,
    updateTaskPositions
} from '../../api/tasks.tsx';
import {useLocation} from 'react-router-dom';
import {Button, Form, FormControl, FormGroup, Modal, ModalTitle} from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable, DropResult, DragStart} from 'react-beautiful-dnd';
import './Tasks.css';
import NavBar from "../NavBar/NavBar.tsx";
import DeleteButton from "../DeleteButton/DeleteButton.tsx";
import EditButton from "../EditButton/EditButton.tsx";
import TaskCard from "../TaskCard/TaskCard.tsx";

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
    position: number;
}

const StrictModeDroppable = ({children, ...props}) => {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));

        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    if (!enabled) {
        return null;
    }

    return <Droppable {...props}>{children}</Droppable>;
};

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModalAddTask, setShowModalAddTask] = useState<boolean>(false);
    const [taskName, setTaskName] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [taskEditModal, setTaskEditModal] = useState<boolean>(false);
    const [taskToEditId, setTaskToEditId] = useState<number | null>(null);
    // const [taskIdToDrag, setTaskIdToDrag] = useState<number | null>(null);
    const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

    const location = useLocation();
    const {boardId} = location.state || {};

    useEffect(() => {
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
        const response = await fetchTasks(boardId);
        if (response?.status === 200 && response?.data?.length) {
            setTasks(response.data);
        } else {
            setTasks([]);
        }
        setLoading(false);
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

    const handleDeleteTask = async (taskId: number) => {
        const response = await deleteTask(taskId);
        if (response?.status === 200) {
            fetchTasksData();
        }
    };

    const handleEditTask = async (task: { id: number | null; title: string; description: string }) => {
        if (!taskName || !taskDescription) {
            console.error('Fields cannot be empty');
            return;
        }

        const response = await editTasks(task.id, taskName, taskDescription, boardId);
        if (response?.status === 200) {
            toggleModalEditTask();
            setTaskName('');
            setTaskDescription('');
            fetchTasksData();
        }
    };

    const toggleModalEditTask = () => {
        setTaskEditModal((prev) => !prev);
    };

    const onDragEnd = async (result: DropResult) => {
        const {destination, source} = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        const draggedTask = tasks.filter((task) => {
            return task.status === source.droppableId && task.position - 1 === source.index;
        });
        if (!draggedTask) return;
        if (destination.droppableId !== source.droppableId) {
            try {
                await changeTaskStatus(draggedTask[0].id, destination.droppableId);
                await fetchTasksData();
            } catch (error) {
                console.error("Error changing task status:", error);
                return;
            }
        }
        const positionDestination: number = destination.index + 1;
        const taskToUpdate = Array.isArray(draggedTask) ? draggedTask[0] : draggedTask;
        const response = await updateTaskPositions({
            ...taskToUpdate,
            position: positionDestination,
            board: { id: boardId }
        });
        if(response?.status === 200){
            //fetchTasksData();
        }
    };

    const renderTask = (task: Task, index: number) => (
        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="card shadow-sm mb-3"
                >
                    <TaskCard
                        task={task}
                        toggleModalEditTask={toggleModalEditTask}
                        setTaskToEditId={setTaskToEditId}
                        setTaskName={setTaskName}
                        setTaskDescription={setTaskDescription}
                        handleDeleteTask={handleDeleteTask}
                    />
                </div>
            )}
        </Draggable>
    );

    const renderColumn = (title: string, droppableId: any, status: string) => (
        <StrictModeDroppable droppableId={droppableId} key={droppableId}>
            {(provided) => (
                <div className="col-md-4 mb-4">
                    <h4 className="text-center">{title}</h4>
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="p-2 rounded"
                        style={{minHeight: "300px"}}
                    >
                        {tasks
                            .filter((task) => task.status === status)
                            .sort((a, b) => a.position - b.position)
                            .map((task, index) => renderTask(task, index))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </StrictModeDroppable>
    );

    if (loading) return <h2>Loading tasks...</h2>;

    return (
        <div className="tasks">
            <NavBar headerName={"Tasks"}/>
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
                        zIndex: '999'
                    }}
                    onMouseEnter={(e) => {
                        if (e.target instanceof HTMLElement) {
                            e.target.style.backgroundColor = 'lightblue';
                            e.target.style.transform = 'scale(1.02)';
                            e.target.style.transition = 'background-color 0.3s ease';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (e.target instanceof HTMLElement) {
                            e.target.style.backgroundColor = '';
                            e.target.style.transform = 'scale(1.00)';
                            e.target.style.transition = 'background-color 0.3s ease';
                        }
                    }}>
                Add Task
            </Button>
            <DragDropContext onDragEnd={onDragEnd}>
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