import { createContext, useContext, useState } from 'react';
import api from '../utils/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setUser({ "email":email,"id":data.userId,"name":data.name,"mobileNumber":data.mobileNumber });
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Referer-token': localStorage.getItem('refreshToken')
                }
            });
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);