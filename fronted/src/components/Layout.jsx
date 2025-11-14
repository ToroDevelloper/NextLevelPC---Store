import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../utils/AuthContext';
import { setAuthToken } from '../utils/authorizedFetch';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:8080';

const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const Layout = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginCorreo, setLoginCorreo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  
  const { login } = useAuth();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nlpc_cart');
      if (saved) setCartItems(JSON.parse(saved));
    } catch (e) {
      console.error('Error cargando carrito:', e);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('nlpc_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error guardando carrito:', e);
    }
  }, [cartItems]);

  // Lógica de Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginCorreo || !loginPassword) {
      setLoginError('Completa correo y contraseña.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          correo: loginCorreo, 
          hash_password: loginPassword
        }),
      });

      const text = await res.text();
      let data = {};
      try { 
        data = text ? JSON.parse(text) : {}; 
      } catch (err) { 
        console.warn('Respuesta no JSON:', text); 
      }

      if (!res.ok) {
        setLoginError(data.mensaje || data.message || `Error ${res.status}`);
        setLoginLoading(false);
        return;
      }

      const token = data.access_token || data.data?.token || data.token || data.accessToken;

      if (!token) {
        setLoginError('No se recibió Access Token del servidor.');
        setLoginLoading(false);
        return;
      }

      setAuthToken(token);
      login({
        email: loginCorreo,
        token: token
      });

      console.log('Login exitoso desde el modal.');
      setLoginLoading(false);
      setIsLoginModalOpen(false);
      setLoginCorreo('');
      setLoginPassword('');

    } catch (err) {
      console.error('Error en login modal:', err);
      setLoginError('No se pudo conectar con el servidor.');
      setLoginLoading(false);
    }
  };

  return (
    <div className="layout">
      <Navbar 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        cartItems={cartItems}
        onCartUpdate={setCartItems}
      />
      
      <main className="layout-main">
        {children}
      </main>
      
      <Footer />

      {/* ===== MODAL DE LOGIN EN LAYOUT (disponible en todas las páginas) ===== */}
      {isLoginModalOpen && (
        <>
          <div 
            className="login-modal-overlay" 
            onClick={() => setIsLoginModalOpen(false)}
          ></div>
          <div className="login-modal-content">
            <button 
              className="login-modal-close"
              onClick={() => setIsLoginModalOpen(false)}
              aria-label="Cerrar"
            >
              <IconX />
            </button>
            
            <h2>Regístrate/Inicia sesión</h2>
            <p className="modal-subtitle">Tu información está protegida.</p>

            <form className="login-modal-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="login-correo">Email</label>
                <input 
                  type="email" 
                  id="login-correo"
                  value={loginCorreo}
                  onChange={(e) => setLoginCorreo(e.target.value)}
                  placeholder="Email o número de teléfono"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Contraseña</label>
                <input 
                  type="password" 
                  id="login-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
              </div>
              
              {loginError && (
                <div className="login-modal-error">
                  {loginError}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-login-submit"
                disabled={loginLoading}
              >
                {loginLoading ? 'Ingresando...' : 'Continuar'}
              </button>
            </form>

            <div className="login-modal-footer">
              <p>¿No tienes cuenta?</p>
              <Link 
                to="/registro" 
                className="btn-login-register"
                onClick={() => setIsLoginModalOpen(false)}
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