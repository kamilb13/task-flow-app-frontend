import axiosInstance from "./axiosInstance.ts";

interface User {
    id: number;
    username: string;
    token: number;
}

export const fetchBoards = async (user: User) => {
    try {
        const res = await axiosInstance.get("/get-boards", {
            params: { userId: user.id },
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        });
        return res.data;
    } catch (e) {
        console.error("Błąd podczas pobierania boards:", e);
    }
}

export const createBoard = async (newBoard: {
    name: string;
    boardCreatorId: string | null;
    estimatedEndDate: string | undefined
}) => {
    try {
        return await axiosInstance.post('/create-board', newBoard);
    } catch (error) {
        console.error('Error creating board:', error);
    }
}

export const deleteBoard = async (boardId: number, user: User) => {
    try {
        return await axiosInstance.delete(`/delete-board`, {
            data: {
                id: boardId
            },
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        });
    } catch (error) {
        console.error('Error deleting board:', error);
    }
}

export const editBoard = async (boardToEditId: number, boardName: string, user: User) => {
    try {
        return await axiosInstance.put(`/edit-board?boardId=${boardToEditId}`,
            {
                name: boardName
            },
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

export const addUserToBoard = async (boardId: any, userId: number, user: User) => {
    return await axiosInstance.put(`/add-user-to-board?userId=${userId}&boardId=${boardId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        }
    );
}