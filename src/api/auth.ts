import axiosInstance from "./axiosInstance.ts";

export const login = async (username: string, password: string) => {
    return await axiosInstance.post("/login", {
        username,
        password,
    });
}

export const register = async (username: string, password: string, email: string) => {
    console.log(username, password, email);
    return await axiosInstance.post("/register", {
        username,
        password,
        email,
    });
}