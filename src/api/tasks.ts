import axiosInstance from "./axiosInstance.ts";

interface User {
    id: number;
    username: string;
    token: number;
}

export const createTask = async (newTask: {
    title: string;
    description: string;
    userId: string | null;
    board: { id: any }
}, user: User) => {
    try {
        return await axiosInstance.post('/create-task', newTask, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        });
    } catch (error) {
        console.error('Error creating board:', error);
    }
}

export const fetchTasks = async (boardId: number) => {
    try {
        return await axiosInstance.get(`/get-tasks?boardId=${boardId}`);
    } catch (e) {
        console.error("Błąd podczas pobierania boards:", e);
    }
}

export const changeTaskStatus = async (taskId: number | null, newStatus: string, user: User) => {
    try {
        return await axiosInstance.post(
            `/change-status?taskId=${taskId}&newStatus=${newStatus.toUpperCase()}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        );
    } catch (e) {
        console.error("Błąd podczas zmieniania statusu taska:", e);
    }
}

export const deleteTask = async (taskId: number, user: User) => {
    try {
        return await axiosInstance.delete(`/delete-task?taskId=${taskId}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
    } catch (e) {
        console.error("Błąd podczas usuwania zadania:", e);
    }
}

export const editTasks = async (taskToEditId: number | null, taskName: string, taskDescription: string, boardId: number, user: User) => {
    const editTask = {
        id: taskToEditId,
        title: taskName,
        description: taskDescription,
        userId: localStorage.getItem("userid"),
        board: {
            id: boardId
        }
    }
    try {
        return await axiosInstance.put(`/edit-task`,
            editTask,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );
    } catch (error) {
        console.error('Error deleting board:', error);
    }
}

export const updateTaskPositions = async (task: any, user: User) => {
    try {
        return await axiosInstance.post('/change-position', task, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
    } catch (error) {
        console.error("Error updating task position:", error);
        throw error;
    }
};