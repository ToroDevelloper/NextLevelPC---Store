import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';

// Ícono para cerrar el modal
const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '', 
    correo: '',
    hash_password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!formData.nombre || !formData.correo || !formData.hash_password) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    if (formData.hash_password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          hash_password: formData.hash_password
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
        setError(data.mensaje || data.message || `Error ${res.status}`);
        setLoading(false);
        return;
      }

      setLoading(false);
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/');
      
    } catch (err) {
      console.error('Error en registro:', err);
      setError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  }

  const handleClose = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  // --- LOGO REBOTANDO ---
  useEffect(() => {
    const logo = document.querySelector(".logo-rebote");
    if (!logo) return;

let x = Math.random() * (window.innerWidth - 260);
let y = Math.random() * (window.innerHeight - 260);

    let dx = (Math.random() * 1.2) + 0.4; // velocidad suave
    let dy = (Math.random() * 1.2) + 0.4;

    function mover() {
      x += dx;
      y += dy;

    if (x <= 0 || x + 260 >= window.innerWidth) dx = -dx;
if (y <= 0 || y + 260 >= window.innerHeight) dy = -dy;

      logo.style.left = x + "px";
      logo.style.top = y + "px";
      logo.style.transform = `rotate(${x + y}deg)`; // giro suave

      requestAnimationFrame(mover);
    }

    mover();
  }, []);

  return (
    <div className="registro-page">
      
      {/* Logo rebotando en el fondo */}
      <div className="logo-rebote">
        <img src="/logo.png" alt="NextLevelPC" />
      </div>

      {/* Overlay borroso */}
      <div 
        className="login-modal-overlay" 
        onClick={handleClose}
      ></div>

      {/* Modal de Registro */}
      <div className="login-modal-content" style={{ maxWidth: '480px' }}>
        <button 
          className="login-modal-close"
          onClick={handleClose}
          aria-label="Cerrar"
        >
          <IconX />
        </button>
        
        <h2>Crear cuenta</h2>
        <p className="modal-subtitle">Únete a nuestra comunidad</p>

        <form className="login-modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="registro-nombre">Nombre *</label>
            <input
              type="text"
              id="registro-nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="registro-apellido">Apellido</label>
            <input
              type="text"
              id="registro-apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Tu apellido"
            />
          </div>

          <div className="form-group">
            <label htmlFor="registro-correo">Correo electrónico *</label>
            <input
              type="email"
              id="registro-correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              placeholder="tu@correo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="registro-password">Contraseña *</label>
            <input
              type="password"
              id="registro-password"
              name="hash_password"
              value={formData.hash_password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="registro-confirmPassword">Confirmar contraseña *</label>
            <input
              type="password"
              id="registro-confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="login-modal-error">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-login-submit"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="login-modal-footer">
          <p>¿Ya tienes cuenta?</p>
          <Link 
            to="/" 
            className="btn-login-register"
            onClick={handleClose}
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}
