import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = `${process.env.API_URL}api` || "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_URL,
});

// Attach access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Auto refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh");

            if (!refreshToken) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(
                    `${API_URL}/auth/token/refresh/`,
                    { refresh: refreshToken }
                );

                const newAccess = res.data.access;

                localStorage.setItem("access", newAccess);

                originalRequest.headers.Authorization =
                    `Bearer ${newAccess}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;