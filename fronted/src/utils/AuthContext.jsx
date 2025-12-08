import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; 

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    
    // Función para obtener el accessToken de la Cookie
    const getAccessTokenFromCookie = () => {
        return Cookies.get('accessToken'); 
    };

    useEffect(() => {
        const token = getAccessTokenFromCookie();

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
            Cookies.remove('accessToken', { path: '/' }); 
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        if (decoded.exp * 1000 <= Date.now()) {
            Cookies.remove('accessToken', { path: '/' });
            setIsAuthenticated(false);
            setUser(null);
            return;
        }
        
        // Si es admin o empleado, no lo autenticamos en la SPA pública
        if (decoded.rol === 'admin' || decoded.rol === 'empleado') {
            setIsAuthenticated(false);
            setUser(null);
            // Opcional: Eliminar la cookie si queremos forzar logout completo en SPA
            // Cookies.remove('accessToken', { path: '/' });
        } else {
            setUser(decoded);
            setIsAuthenticated(true);
        }
        
    }, []);

    const login = (accessToken) => {
        try {
            const decodedUser = jwtDecode(accessToken);

            // Si es admin o empleado, no actualizamos el estado global de la SPA
            if (decodedUser.rol === 'admin' || decodedUser.rol === 'empleado') {
                return decodedUser; // Retornamos el usuario para que LoginModal pueda redirigir
            }

            setUser(decodedUser);
            setIsAuthenticated(true);
            return decodedUser;
            
        } catch (error) {
            console.error("Error al procesar el login:", error);
            Cookies.remove('accessToken', { path: '/' });
            setIsAuthenticated(false);
            setUser(null);
            throw new Error('Token de acceso inválido recibido.');
        }
    };

    const logout = (shouldRedirect = true) => {
        Cookies.remove('accessToken', { path: '/' });
        
        fetch('/api/usuarios/logout', {
            method: 'POST', 
            credentials: 'include' 
        }).catch(err => console.error('Error al llamar a logout:', err));

        setIsAuthenticated(false);
        setUser(null);

        if (shouldRedirect && typeof window !== 'undefined') {
            window.location.href = '/home';
        }
    };

    console.log('AuthContext re-render - isAuthenticated:', isAuthenticated, 'user:', user);

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};