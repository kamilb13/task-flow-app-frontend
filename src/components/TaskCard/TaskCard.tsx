import React from 'react';
import EditButton from "../EditButton/EditButton.tsx";
import DeleteButton from "../DeleteButton/DeleteButton.tsx";
import {Button, Card, Dropdown} from "react-bootstrap";

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
                <Card.Title>{task.title}</Card.Title>
                <Card.Text>
                    {task.description}
                </Card.Text>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        More options
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
            </Card.Body>
        </Card>
    )
}

export default TaskCard;