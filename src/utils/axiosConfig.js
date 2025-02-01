import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8080/",
});

api.interceptors.request.use((config) => {
    if (config.url.includes('/auth/login') || config.url.includes('/auth/signup')) {
        return config;
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            const { data } = await api.post('/auth/refresh', { refreshToken });
            localStorage.setItem('accessToken', data.accessToken);
            return api(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default api;