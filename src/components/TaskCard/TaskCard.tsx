import React from 'react';
import {Card, Dropdown} from "react-bootstrap";
import './TaskCard.css';

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
    position: number;
}

interface TaskCardProps {
    task: Task;
    toggleModalEditTask: () => void;
    setTaskToEditId: (taskToEditId: number) => void;
    setTaskName: (name: string) => void;
    setTaskDescription: (description: string) => void;
    handleDeleteTask: (itemId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
                                               task,
                                               toggleModalEditTask,
                                               setTaskToEditId,
                                               setTaskName,
                                               setTaskDescription,
                                               handleDeleteTask
                                           }) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title
                    style={{display: 'flex', justifyContent: 'space-between'}}
                >
                    {task.title}
                    <Dropdown>
                        <Dropdown.Toggle
                            id="dropdown-basic"
                            className="dropdown-toggle"
                            style={{color: '#bababa', borderColor: '#bababa'}}
                        >
                            ...
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleModalEditTask();
                                    setTaskToEditId(task.id);
                                    setTaskName(task.title);
                                    setTaskDescription(task.description);
                                }}
                            >
                                Edit task
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDeleteTask(task.id)}>Delete task</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Card.Title>
                <Card.Text>
                    {task.description}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default TaskCard;