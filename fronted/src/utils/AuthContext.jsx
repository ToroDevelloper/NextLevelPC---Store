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
        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (error) {
            console.error("Error decodificando el token:", error);
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        // Si el token está expirado en el cliente, limpiar inmediatamente
        if (decoded.exp * 1000 <= Date.now()) {
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        // Verificar con el backend que la sesión sigue siendo válida (cookies no expiradas, etc.)
        const verifySession = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/usuarios/verify', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    // El backend dice que la sesión no es válida: limpiar todo
                    console.warn('Sesión inválida según backend, limpiando token del SPA');
                    localStorage.removeItem('accessToken');
                    setIsAuthenticated(false);
                    setUser(null);
                    return;
                }

                const data = await res.json();
                if (data && data.success && data.usuario) {
                    setUser(data.usuario);
                    setIsAuthenticated(true);
                } else {
                    // Respuesta inesperada -> tratar como sesión inválida
                    localStorage.removeItem('accessToken');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (err) {
                console.error('Error verificando sesión con backend:', err);
                // Ante error de verificación, ser conservador y limpiar sesión local
                localStorage.removeItem('accessToken');
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        verifySession();

    }, []);

    const login = (accessToken) => {
        try {
            const decodedUser = jwtDecode(accessToken);
            localStorage.setItem('accessToken', accessToken);
            setUser(decodedUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error al procesar el login:", error);
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const logout = (shouldRedirect = true) => {
        localStorage.removeItem('accessToken');

        fetch('http://localhost:8080/api/usuarios/logout', {
            method: 'POST', 
            credentials: 'include' 
        }).catch(err => console.error('Error al llamar a logout:', err));

        setIsAuthenticated(false);
        setUser(null);

        if (shouldRedirect && typeof window !== 'undefined') {
            window.location.href = '/home';
        }
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};