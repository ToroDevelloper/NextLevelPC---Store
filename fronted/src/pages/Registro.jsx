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

  useEffect(() => {
    const imgs = document.querySelectorAll(".floating-img");

    const objects = [];

    imgs.forEach(img => {
     
      const rect = img.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Centro
      let x = window.innerWidth / 2 - w / 2;
      let y = window.innerHeight / 2 - h / 2;

      let vX = (Math.random() * 4 - 2);
      let vY = (Math.random() * 4 - 2);

 
      if (Math.abs(vX) < 1) vX *= 2;
      if (Math.abs(vY) < 1) vY *= 2;

      objects.push({ img, x, y, vX, vY, w, h });
    });

    function animate() {
      const W = window.innerWidth;
      const H = window.innerHeight;

      const marginTop = 20;     
      const marginLeft = 10;    
      const marginRight = 100;  
      const marginBottom = 100; 

      objects.forEach(o => {
        o.x += o.vX;
        o.y += o.vY;


        if (o.x <= -marginLeft || o.x + o.w >= W + marginRight) {
          o.vX *= -1;
        }
        if (o.y <= -marginTop || o.y + o.h >= H + marginBottom) {
          o.vY *= -1;
        }

        o.img.style.left = o.x + "px";
        o.img.style.top = o.y + "px";
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);


  return (
    <div className="registro-page">
      <div className="login-container">
        <img src="/logo.png" className="floating-img" />
        <img src="/logo.png" className="floating-img" />
        <img src="/logo.png" className="floating-img" />
        <img src="/icono.png" className="floating-img" />
        <img src="/icono.png" className="floating-img" />
        <img src="/icono.png" className="floating-img" />
        <img src="/logo.png" className="floating-img" />
        <img src="/logo.png" className="floating-img" />
        <img src="/logo.png" className="floating-img" />
        <img src="/logo.png" className="floating-img" />
        <img src="/icono.png" className="floating-img" />
        <img src="/icono.png" className="floating-img" />

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
