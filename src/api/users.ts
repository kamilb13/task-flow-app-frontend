import axiosInstance from "./axiosInstance.ts";

interface User {
    id: number;
    username: string;
    token: number;
}

export const getUsers = async (user: User) => {
    try {
        return await axiosInstance.get("/users", {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        });
    } catch (e) {
        console.error("Błąd podczas pobierania boards:", e);
    }
}