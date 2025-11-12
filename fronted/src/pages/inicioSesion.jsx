import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setAuthToken } from '../utils/authorizedFetch';
import { useAuth } from '../utils/AuthContext';

export default function InicioSesion() {
    const [correo, setCorreo] = useState('');
    const [hash_password, setHashPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const NEXTLEVEL_BLUE = 'rgba(154,235,247,0.32)';
    const NEXTLEVEL_GREEN = 'rgba(81,200,148,0.88)';
    const NEXTLEVEL_CYAN = '#9aebf7';
    const BACKGROUND_DARK = '#ffffff';
    const INPUT_BACKGROUND = 'rgba(198,198,198,0.82)';
    const LOGO_PATH = "/logo.png";
    // -----------------------------------------------------------------

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
            console.log('Respuesta completa del servidor:', text);

            let data = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch (err) {
                console.warn('Respuesta no JSON:', text);
            }

            console.log('Datos parseados:', data);

            if (!res.ok) {
                setError(data.mensaje || data.message || `Error ${res.status}`);
                setLoading(false);
                return;
            }

            const token = data.access_token || data.data?.token || data.token || data.accessToken;
            console.log('Access Token extraído:', token);

            if (!token) {
                console.error('No se encontró token en:', data);
                setError('No se recibió Access Token del servidor.');
                setLoading(false);
                return;
            }

            try {
                setAuthToken(token);
                login({
                    email: correo,
                    token: token
                });
                console.log('Login exitoso, redirigiendo a Home...');
                
                setTimeout(() => {
                    navigate('/home');
                }, 100);
                
            } catch (storageErr) {
                console.error('Error estableciendo token:', storageErr);
                setError('No se pudo inicializar el token de sesión.');
                setLoading(false);
                return;
            }

        } catch (err) {
            console.error('Error en login:', err);
            setError('No se pudo conectar con el servidor.');
            setLoading(false);
        }
    }


    const handleRegisterClick = () => {
        navigate('/registro');
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: BACKGROUND_DARK,
            fontFamily: 'Bold italic, sans-serif'
        }}>

            <div style={{
                flex: '0 0 35%',
                backgroundColor: NEXTLEVEL_BLUE,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem'
            }}>

                <div style={{  textAlign: 'center',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '1rem'}}>
                    <p style={{
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        color: '#000000',
                        margin: '0 0 1rem 0'
                    }}>
                        Bienvenido a
                    </p>

                    <img
                        src={LOGO_PATH}
                        alt="NextLevelPC Logo"
                        style={{
                            display: 'block',
                            width: '100%',
                            maxWidth: '500px',
                            height: 'auto',
                            margin: '0 auto 1rem auto',
                            borderRadius: '12px',
                        }}
                    />


                    <p style={{
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        color: '#000000',
                        marginTop: '1rem',
                        fontFamily: 'Bold italic, sans-serif',
                        letterSpacing: '0.5px'
                    }}>
                        Despierta tu poder digital.
                    </p>
                </div>
            </div>

            <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '800px',
                    backgroundColor: 'transparent',
                    padding: '3rem 0'
                }}>
                    <h2 style={{
                        textAlign: 'left',
                        color: '#000000',
                        marginBottom: '3rem',
                        fontSize: '1.8rem'
                    }}>
                        Iniciar sesión
                    </h2>

                    <form onSubmit={handleSubmit}>


                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '1000',
                                color: '#000000'
                            }}>
                                Correo:
                            </label>
                            <input
                                type="email"
                                value={correo}
                                onChange={e => setCorreo(e.target.value)}
                                required
                                style={{
                                    width: '50%',
                                    padding: '0.5rem',
                                    border: 'none',
                                    backgroundColor: INPUT_BACKGROUND,
                                    color: 'rgb(0,0,0)',
                                    borderRadius: '80px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                                placeholder=""
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '800',
                                color: '#000000'
                            }}>
                                Contraseña:
                            </label>
                            <input
                                type="password"
                                value={hash_password}
                                onChange={e => setHashPassword(e.target.value)}
                                required
                                style={{
                                    width: '50%',
                                    padding: '0.5rem',
                                    border: 'none',
                                    backgroundColor: INPUT_BACKGROUND,
                                    color: '#a8a8a8',
                                    borderRadius: '80px',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                                placeholder=""
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


                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '3rem'
                        }}>

                            <button
                                type="button"
                                onClick={handleRegisterClick}
                                style={{
                                    flex: 'none',
                                    width: '150px',
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: NEXTLEVEL_GREEN,
                                    color: 'rgba(33,89,56,0.7)',
                                    border: '2px solid transparent',
                                    borderRadius: '50px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                }}
                            >
                                Registrarse
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 'none',
                                    width: '150px',
                                    marginRight: '350px',
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: loading ? '#ccc' : NEXTLEVEL_CYAN,
                                    color: 'rgba(16,69,67,0.87)',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {loading ? 'Ingresando...' : 'Iniciar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div style={{
                position: 'fixed',
                bottom: '0',
                left: '0',
                width: '100%',
                backgroundColor: '#060347',
                color: '#ffffff',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #100C25'
            }}>
                <p style={{ margin: 0 }}>
                    © 2025 NextLevelPc. Todos los derechos reservados.
                </p>
                <p style={{ margin: 0 }}>
                    Soporte: <a href="mailto:NextLevel@gmail.com" style={{ color: NEXTLEVEL_CYAN, textDecoration: 'none' }}>NextLevel@gmail.com</a>
                </p>
            </div>

            {/* Título de la Sesión Fijo (Superior Izquierda) */}
            <div style={{
                position: 'fixed',
                top: '0',
                left: '0',
                color: '#1a1a1a',
                padding: '0.5rem',
                fontSize: '1rem',
                backgroundColor: NEXTLEVEL_BLUE
            }}>
                Inicio de sesion
            </div>

        </div>
    );
}