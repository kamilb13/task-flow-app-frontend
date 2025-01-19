import axiosInstance from "./axiosInstance.ts";

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

export const deleteBoard = async (boardId: number) => {
    const token = localStorage.getItem("token");
    try {
        return await axiosInstance.delete(`/delete-board`, {
            data: {
                id: boardId
            },
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        console.error('Error deleting board:', error);
    }
}

export const editBoard = async (boardToEditId: number, boardName: string) => {
    const token = localStorage.getItem("token");
    try {
        return await axiosInstance.put(`/edit-board?boardId=${boardToEditId}`,
            {
                name: boardName
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error('Error deleting board:', error);
    }
}

// export const addUserToBoard = async () => {
//
// }