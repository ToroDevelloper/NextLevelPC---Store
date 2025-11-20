import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useCart } from '../utils/CartContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';

// --- CONSTANTES ---
const API_BASE = 'http://localhost:8080';

// Icono de cerrar 
const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const Layout = ({ children }) => {
    const { login, user } = useAuth();
    const { clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // 1. ESTADOS PARA EL MODAL DE LOGIN (usando el que ya funcionaba)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const modalOpenRef = useRef(false);
    const [loginCorreo, setLoginCorreo] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [loginLoading, setLoginLoading] = useState(false);
    
    // 2. ESTADO CLAVE PARA LA REDIRECCIÓN POST-CHECKOUT
    const [redirectTo, setRedirectTo] = useState(null); 

    // --- FUNCIONES DEL MODAL DE LOGIN ---

    /**
     * Abre el modal de login y establece una URL de destino
     */
   // Debug effect
    useEffect(() => {
        console.log('🔍 DEBUG - Estado modal:', isLoginModalOpen, 'Ref:', modalOpenRef.current);
    }, [isLoginModalOpen]);

const openLoginModal = (targetPath = null) => {
    if (user) {
        navigate(targetPath || "/");
        return;
    }

    modalOpenRef.current = true;
    setRedirectTo(targetPath);
    setLoginError(null);
    setLoginLoading(false);
    setIsLoginModalOpen(true);
};

const closeLoginModal = () => {
    modalOpenRef.current = false;
    setIsLoginModalOpen(false);
    setLoginCorreo('');
    setLoginPassword('');
    setLoginError(null);
    setLoginLoading(false);
    setRedirectTo(null);
};


    
    /**
     * Maneja el envío del formulario de login.
     */
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);
        setLoginLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify({ 
                    correo: loginCorreo, 
                    hash_password: loginPassword 
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                const errorMessage = errorData.mensaje || 'Credenciales inválidas o error de servidor.';
                setLoginError(errorMessage);
                setLoginLoading(false);
                return;
            }

            const data = await res.json();
            const token = data.access_token;
            
            // LLAMAR A LOGIN y obtener el usuario
            let loggedInUser = null;
            try {
                loggedInUser = login(token); 
            } catch (error) {
                setLoginError("Error al procesar la sesión. Intente de nuevo.");
                setLoginLoading(false);
                return;
            }

            // LIMPIAR Y CERRAR
            closeLoginModal();

            // REDIRECCIÓN CONDICIONAL
            if (redirectTo === '/checkout') {
                console.log("Login exitoso. Redirigiendo a:", redirectTo);
                navigate(redirectTo);
            } else if (loggedInUser && (loggedInUser.rol === 'admin' || loggedInUser.rol === 'empleado')) {
                window.location.href = 'http://localhost:8080/ordenes';
            } else {
                navigate('/home'); 
            }

        } catch (error) {
            console.error('Error durante el proceso de login:', error);
            setLoginError('No se pudo conectar con el servidor.');
            setLoginLoading(false);
        }
    };

    return (
        <div className="layout">
            {/* ------------------------------------------- */}
            {/* Componente Navbar: Pasa la función openLoginModal */}
            {/* ------------------------------------------- */}
            <Navbar 
                onLoginClick={openLoginModal} 
            />
            
            {/* ------------------------------------------- */}
            {/* Contenido Principal de la Aplicación */}
            {/* ------------------------------------------- */}
            <main className="layout-main">
                {children}
            </main>

            {/* ------------------------------------------- */}
            {/* Componente Footer */}
            {/* ------------------------------------------- */}
            <Footer />

            {/* ------------------------------------------- */}
            {/* Modal de Login */}
            {/* ------------------------------------------- */}
{isLoginModalOpen && (
    <>
        {console.log('🎯 MODAL RENDERIZANDO - isLoginModalOpen:', isLoginModalOpen)}
        <div 
            onClick={closeLoginModal}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 10000,
                display: 'block'
            }}
        ></div>
        <div 
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                zIndex: 10001,
                minWidth: '400px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}
        >
            <button 
                onClick={closeLoginModal}
                aria-label="Cerrar"
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    padding: '0.5rem'
                }}
            >
                <IconX />
            </button>
            
            <h2 style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>Iniciar Sesión</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem', textAlign: 'center' }}>Tu información está protegida.</p>

            <form onSubmit={handleLoginSubmit} style={{ margin: '1.5rem 0' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="login-correo" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                    <input 
                        type="email" 
                        id="login-correo"
                        value={loginCorreo}
                        onChange={(e) => setLoginCorreo(e.target.value)}
                        placeholder="Email"
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="login-password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contraseña</label>
                    <input 
                        type="password" 
                        id="login-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                
                {loginError && (
                    <div style={{
                        background: '#f8d7da',
                        color: '#721c24',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        margin: '1rem 0',
                        border: '1px solid #f5c6cb'
                    }}>
                        {loginError}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loginLoading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: loginLoading ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        cursor: loginLoading ? 'not-allowed' : 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    {loginLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                <p>¿No tienes cuenta?</p>
                <Link 
                    to="/registro" 
                    onClick={closeLoginModal}
                    style={{
                        display: 'inline-block',
                        marginTop: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px'
                    }}
                >
                    Registrarse
                </Link>
            </div>
        </div>
    </>
)}
</div>
    );
};

export default Layout;