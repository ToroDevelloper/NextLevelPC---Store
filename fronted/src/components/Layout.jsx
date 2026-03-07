import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const location = useLocation();
    
    // Solo ocultar navbar en la página de perfil
    const isPerfilPage = location.pathname === '/perfil';
    
    return (
        <div className="layout">
            {!isPerfilPage && <Navbar />}
            
            <main className="layout-main">
                {children}
            </main>

            {/* Siempre mostrar footer, incluso en perfil */}
            <Footer />
        </div>
    );
};

export default Layout;