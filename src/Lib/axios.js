import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
    }
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
});

export default api;