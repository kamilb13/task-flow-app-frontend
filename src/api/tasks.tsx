import axiosInstance from "./axiosInstance.tsx";

// export const createTask = async (newTask) => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userid");
//
//     try {
//         return await axiosInstance.post('/create-task', newTask);
//     } catch (error) {
//         console.error('Error creating board:', error);
//     }
// }

export const fetchTasks = async (boardId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userid");

    try {
        const response = await axiosInstance.get(`/get-tasks?boardId=${boardId}`)
        //setTasks(response.data);
        return response;
    } catch (e) {
        console.error("Błąd podczas pobierania boards:", e);
    }
}