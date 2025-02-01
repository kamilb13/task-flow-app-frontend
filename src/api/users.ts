import axiosInstance from "./axiosInstance.ts";

interface User {
    id: number;
    username: string;
    token: number;
    avatarUrl: string;
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

export const getAvatar = async (user: User) => {
    try {
        return axiosInstance.get(`/get-avatar/${user.id}`, { responseType: "blob" });
    } catch (e) {
        console.error("Błąd pobierania avatara:", e)
    }
}
export const changeAvatar = async (user: User, formData: any) => {
    try {
        return await axiosInstance.post(`/${user.id}/avatar`, formData, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
    } catch (e) {
        console.error("Błąd przesyłania avatara:", e);
    }
}