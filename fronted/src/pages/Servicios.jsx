import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Servicios.css';

const API_BASE = 'http://localhost:8080';

const Servicios = () => {
    const [servicios, setServicios] = useState([]);
    const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
    const [filtroActivo, setFiltroActivo] = useState('todos');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTodosLosServicios();
    }, []);

    const fetchTodosLosServicios = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/servicios`);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const json = await res.json();
            const serviciosData = json.success ? json.data : json;
            const serviciosArray = Array.isArray(serviciosData) ? serviciosData : [];
            setServicios(serviciosArray);
            setServiciosFiltrados(serviciosArray);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error cargando servicios');
        } finally {
            setLoading(false);
        }
    };

    const filtrarPorTipo = async (tipo) => {
        setFiltroActivo(tipo);
        setLoading(true);
        setError(null);

        try {
            let url = `${API_BASE}/api/servicios`;

            if (tipo !== 'todos') {
                url = `${API_BASE}/api/servicios/tipo/${tipo}`;
            }

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const json = await res.json();
            const serviciosData = json.success ? json.data : json;
            setServiciosFiltrados(Array.isArray(serviciosData) ? serviciosData : []);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error cargando servicios');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="servicios-page">
            <h2 className="servicios-title">Nuestros Servicios Técnicos</h2>

            {/* Tarjetas de filtro - MANTENIENDO EL ESTILO ORIGINAL */}
            <div className="servicios-filtros">
                {/* Servicio Básico */}
                <div
                    className={`filtro-card ${filtroActivo === 'basico' ? 'active' : ''}`}
                    onClick={() => filtrarPorTipo('basico')}
                >
                    <img
                        src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop"
                        alt="Servicio Básico"
                    />
                    <div className="filtro-overlay">
                        <h3>BÁSICO</h3>
                        <p>Mantenimiento y reparaciones estándar</p>
                    </div>
                </div>

                {/* Servicio Avanzado */}
                <div
                    className={`filtro-card ${filtroActivo === 'avanzado' ? 'active' : ''}`}
                    onClick={() => filtrarPorTipo('avanzado')}
                >
                    <img
                        src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=600&fit=crop"
                        alt="Servicio Avanzado"
                    />
                    <div className="filtro-overlay">
                        <h3>AVANZADO</h3>
                        <p>Reparaciones especializadas y upgrades</p>
                    </div>
                </div>
            </div>

            {/* Botón para mostrar todos */}
            {filtroActivo !== 'todos' && (
                <button
                    className="btn-mostrar-todos"
                    onClick={() => filtrarPorTipo('todos')}
                >
                    Mostrar Todos los Servicios
                </button>
            )}

            {/* Lista de servicios - MANTENIENDO EL ESTILO ORIGINAL */}
            <div className="servicios-content">
                <h3 className="servicios-subtitle">
                    {filtroActivo === 'todos' ? 'Todos los Servicios' :
                        filtroActivo === 'basico' ? 'Servicios Básicos' : 'Servicios Avanzados'}
                </h3>

                {loading && <p className="loading-message">Cargando servicios...</p>}
                {error && (
                    <div className="error-message">
                        No hay servicios para mostrar
                    </div>
                )}
                {!loading && !error && serviciosFiltrados.length === 0 && (
                    <div className="error-message">
                        No hay servicios disponibles en esta categoría.
                    </div>
                )}

                <div className="servicios-grid">
                    {serviciosFiltrados.map(servicio => (
                        <div key={servicio.id} className="servicio-card">
                            <div className="servicio-icon">
                                {servicio.tipo === 'basico' ? '🔧' : '⚙️'}
                            </div>
                            <div className="servicio-info">
                                <h3>{servicio.nombre}</h3>
                                {servicio.descripcion && (
                                    <p className="servicio-descripcion">
                                        {servicio.descripcion}
                                    </p>
                                )}
                                <p className="servicio-precio">
                                    ${Number(servicio.precio).toFixed(2)}
                                </p>
                                <button className="servicio-add-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
                                    </svg>
                                    Contratar Servicio
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Servicios;