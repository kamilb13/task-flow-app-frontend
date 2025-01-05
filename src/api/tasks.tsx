import axiosInstance from "./axiosInstance.tsx";

export const createTask = async (newTask) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userid");
    console.log(newTask);
    try {
        return await axiosInstance.post('/create-task', newTask, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
    } catch (error) {
        console.error('Error creating board:', error);
    }
}

export const fetchTasks = async (boardId: number) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userid");

    try {
        return await axiosInstance.get(`/get-tasks?boardId=${boardId}`);
    } catch (e) {
        console.error("Błąd podczas pobierania boards:", e);
    }
}

export const changeTaskStatus = async (taskId, newStatus) => {
    const token = localStorage.getItem("token");
    console.log(newStatus.toUpperCase());
    try {
        return await axiosInstance.post(
            `/change-status?taskId=${taskId}&newStatus=${newStatus.toUpperCase()}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (e) {
        console.error("Błąd podczas zmieniania statusu taska:", e);
    }
}

export const deleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    console.log(taskId);
    try {
        return await axiosInstance.delete(`/delete-task?taskId=${taskId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        console.error("Błąd podczas usuwania zadania:", e);
    }
}

export const editTasks = async (taskToEditId, taskName, taskDescription, boardId) => {
    const token = localStorage.getItem("token");
    const editTask = {
        id: taskToEditId,
        title: taskName,
        description: taskDescription,
        userId: localStorage.getItem("userid"),
        board: {
            id: boardId
        }
    }
    console.log("----------------------");
    console.log(editTask);
    console.log(token);
    console.log(taskToEditId);
    console.log("----------------------");
    try {
        return await axiosInstance.put(`/edit-task`,
            editTask,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        //return response;
    } catch (error) {
        console.error('Error deleting board:', error);
    }
}