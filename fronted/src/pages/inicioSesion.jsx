// inicioSesion.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import '../styles/login.css';

export default function InicioSesion() {
  const [correo, setCorreo] = useState('');
  const [hash_password, setHashPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

 // inicioSesion.jsx - modifica la parte donde extraes el token
async function handleSubmit(e) {
  e.preventDefault();
  setError(null);

  if (!correo || !hash_password) {
    setError('Completa correo y contraseña.');
    return;
  }

  setLoading(true);
  try {
    const res = await fetch('http://localhost:8080/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, hash_password }),
    });

    const text = await res.text();
    console.log('Respuesta completa del servidor:', text); // Agrega este log
    
    let data = {};
    try { 
      data = text ? JSON.parse(text) : {}; 
    } catch (err) {
      console.warn('Respuesta no JSON:', text);
    }

    console.log('Datos parseados:', data); // Agrega este log

    if (!res.ok) {
      setError(data.mensaje || data.message || `Error ${res.status}`);
      setLoading(false);
      return;
    }

    // CORREGIDO: El token está en data.data.token según tu controlador
    const token = data.data?.token || data.token || data.access_token || data.accessToken;
    console.log('Token extraído:', token); // Agrega este log

    if (!token) {
      console.error('No se encontró token en:', data);
      setError('No se recibió token del servidor.');
      setLoading(false);
      return;
    }

    try {
      localStorage.setItem('token', token);
      console.log('Token guardado en localStorage');
    } catch (storageErr) {
      console.error('Error guardando token:', storageErr);
      setError('No se pudo guardar el token en el navegador.');
      setLoading(false);
      return;
    }

    setLoading(false);
    console.log('Login exitoso, redirigiendo a Home...');
    navigate('/home');
      
  } catch (err) {
    console.error('Error en login:', err);
    setError('No se pudo conectar con el servidor.');
    setLoading(false);
  }
}

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Iniciar sesión
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
            Correo electrónico
          </label>
          <input
            type="email"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="tu@correo.com"
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
            Contraseña
          </label>
          <input
            type="password"
            value={hash_password}
            onChange={e => setHashPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '1rem', 
            padding: '0.75rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#ccc' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '1.5rem'
          }}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        {/* Sección de registro */}
        <div style={{ 
          textAlign: 'center', 
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          marginTop: '1.5rem'
        }}>
          <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>
            ¿No tienes una cuenta?
          </p>
          <Link 
            to="/registro" 
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#2563eb',
              border: '2px solid #2563eb',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#2563eb';
            }}
          >
            Registrarse
          </Link>
        </div>
      </form>
    </div>
  );
}
