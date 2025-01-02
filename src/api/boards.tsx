import axiosInstance from "./axiosInstance.tsx";
import axios from "axios";

export const fetchBoards = async () => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userid");
        const res = await axiosInstance.get("/get-boards", {
            params: {userId},
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return res.data;
    } catch (e) {
        console.error("Błąd podczas pobierania boards:", e);
    }
}

export const createBoard = async (newBoard) => {
    try {
        return await axios.post('http://localhost:8080/create-board', newBoard);
    } catch (error) {
        console.error('Error creating board:', error);
    }
}

export const deleteBoard = async (boardId) => {
    const token = localStorage.getItem("token");
    try {
        const res = await axiosInstance.delete(`/delete-board`, {
            data: {
                id: boardId
            },
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return res;
    } catch (error) {
        console.error('Error deleting board:', error);
    }
}

export const editBoard = async (boardToEditId, boardName) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axiosInstance.put(`/edit-board?boardId=${boardToEditId}`,
            {
                name: boardName
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        console.error('Error deleting board:', error);
    }
}