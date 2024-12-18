import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from './Api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from './Constant';
import {jwtDecode} from 'jwt-decode'; 

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await auth();
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post('api/token/refresh/', { refresh: refreshToken });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthenticated(false);
            return;
        }
        const decode = jwtDecode(token);
        const tokenExpiration = decode.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthenticated(true);
        }
    };

    
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    
    return isAuthenticated ? children : <Navigate to='/signin' />;
};

export default ProtectedRoute;
