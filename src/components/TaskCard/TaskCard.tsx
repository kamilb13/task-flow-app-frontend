import React from 'react';
import EditButton from "../EditButton/EditButton.tsx";
import DeleteButton from "../DeleteButton/DeleteButton.tsx";

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

const TaskCard: React.FC<TaskCardProps> = ({task, toggleModalEditTask, setTaskToEditId, setTaskName, setTaskDescription, handleDeleteTask}) => {
    return (
        <div className="card-body bg-light">
            <h5 className="card-title">{task.title}</h5>
            <p>{task.position}</p>
            <p className="card-text text-muted">{task.description}</p>
            <div className="d-flex justify-content-between">
                <EditButton
                    toggleModalEditItem={toggleModalEditTask}
                    setItemToEditId={setTaskToEditId}
                    setItemName={setTaskName}
                    setItemDescription={setTaskDescription}
                    itemId={task.id}
                    itemName={task.title}
                    itemDescription={task.description}
                />
                <DeleteButton onClick={handleDeleteTask} itemId={task.id}/>
            </div>
        </div>
    )
}

export default TaskCard;