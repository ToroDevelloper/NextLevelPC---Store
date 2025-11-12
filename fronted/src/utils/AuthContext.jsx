import React, { createContext, useContext, useState } from 'react';
import { setAuthToken } from './authorizedFetch';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); 

    const login = (accessToken, userData) => {
        setAuthToken(accessToken);
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        setAuthToken(null);
        fetch('http://localhost:8080/api/usuarios/logout', { 
            method: 'POST', 
            credentials: 'include' 
        }).catch(err => console.error('Error al llamar a logout:', err));

        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};