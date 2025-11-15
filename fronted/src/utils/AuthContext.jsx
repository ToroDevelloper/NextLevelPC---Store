import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Comprobar si el token ha expirado
                if (decoded.exp * 1000 > Date.now()) {
                    login(token);
                } else {
                    // Si el token ha expirado, lo eliminamos
                    logout();
                }
            } catch (error) {
                console.error("Error decodificando el token:", error);
                logout();
            }
        }
    }, []);

    const login = (accessToken) => {
        try {
            const decodedUser = jwtDecode(accessToken);
            localStorage.setItem('accessToken', accessToken);
            setUser(decodedUser); // Guardar el usuario decodificado (incluye id, rol, etc.)
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error al procesar el login:", error);
            logout(); // Si hay un error, cerramos sesión por seguridad
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
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