import axiosInstance from "./axiosInstance.tsx";

export const login = async (username, password) => {
    const response = await axiosInstance.post("/login", {
        username,
        password,
    });

    //TODO into user context or something else(redux?)
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userid", response.data.userId);

    return response;
}