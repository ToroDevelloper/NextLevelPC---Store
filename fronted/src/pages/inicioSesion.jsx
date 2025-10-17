import React, { useState } from 'react';

export default function InicioSesion() {
  const [correo, setCorreo] = useState('');
  const [hash_password, setHashPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch (err) {
        console.warn('Respuesta no JSON:', text);
      }

      if (!res.ok) {
        setError(data.mensaje || data.message || `Error ${res.status}`);
        setLoading(false);
        return;
      }

      const token = data.access_token || data.token || data.accessToken;
      if (!token) {
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
      window.location.href = '/';
    } catch (err) {
      console.error('Error en login:', err);
      setError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Correo</label><br />
          <input
            type="email"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Contraseña</label><br />
          <input
            type="password"
            value={hash_password}
            onChange={e => setHashPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
