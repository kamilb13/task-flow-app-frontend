import axiosInstance from "./axiosInstance.ts";

export const getUsers = async () => {
    try {
        const token = localStorage.getItem("token");
        return await axiosInstance.get("/users", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
    } catch (e) {
        console.error("Błąd podczas pobierania boards:", e);
    }
}