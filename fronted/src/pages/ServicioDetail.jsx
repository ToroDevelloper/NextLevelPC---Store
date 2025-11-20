import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ServicioDetail.css';
import AgendarServicioModal from '../components/AgendarServicioModal'; // Importar el modal
import { useAuth } from '../utils/AuthContext';

const API_BASE = 'http://localhost:8080';

const ServicioDetail = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [servicio, setServicio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('descripcion');

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitModal = async (formData) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para agendar una cita de servicio.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE}/api/citas-servicios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    servicio_id: servicio.id,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('¡Cita agendada con éxito! Nos pondremos en contacto contigo pronto.');
                setIsModalOpen(false);
            } else {
                throw new Error(result.message || 'No se pudo agendar la cita.');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        const fetchServicio = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_BASE}/api/servicios/${id}`);
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                const json = await res.json();
                if (json.success) {
                    setServicio(json.data);
                } else {
                    throw new Error(json.message || 'Error al cargar el servicio');
                }
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error cargando el servicio');
            } finally {
                setLoading(false);
            }
        };

        fetchServicio();
    }, [id]);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!servicio) {
        return <div className="not-found">Servicio no encontrado.</div>;
    }

    // Descripción y especificaciones similares a detalle de producto
    const descripcion = servicio.descripcion_detallada || servicio.descripcion || 'Sin descripción disponible.';

    let specs = [];
    if (servicio.especificaciones) {
        try {
            const parsed = JSON.parse(servicio.especificaciones);
            if (Array.isArray(parsed)) {
                specs = parsed;
            }
        } catch (e) {
            console.warn('No se pudo parsear `especificaciones` de servicio como JSON, se usará layout por defecto.', e);
        }
    }

    if (specs.length === 0) {
        specs = [
            { label: 'Tipo', value: servicio.tipo || 'No especificado' },
            { label: 'Duración', value: servicio.duracion || 'Según requerimiento' },
            { label: 'Estado', value: servicio.activo === 0 ? 'No disponible' : 'Disponible' },
        ];
    }

    return (
        <div className="servicio-detail-page">
            <div className="servicio-detail-main">
                <div className="servicio-detail-image-wrapper servicio-detail-image-container">
                    <img
                        src={servicio.imagen_url || 'https://placehold.co/600x400/EEE/31343C?text=Servicio'}
                        alt={servicio.nombre}
                        className="servicio-detail-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Servicio';
                        }}
                    />
                </div>
                <div className="servicio-detail-info servicio-detail-content">
                    <section className="servicio-detail-top">
                        <div>
                            <h1 className="servicio-detail-name">{servicio.nombre}</h1>
                            {servicio.tipo && <p className="servicio-tipo">{servicio.tipo}</p>}
                        </div>
                        <div className="servicio-detail-summary">
                            <div className="servicio-detail-price-box">
                                <span className="servicio-detail-price">
                                    ${Number(servicio.precio || 0).toFixed(2)}
                                </span>
                            </div>
                            <span className="servicio-detail-stock">
                                Estado: {servicio.activo === 0 ? 'No disponible' : 'Disponible'}
                            </span>
                            <div className="servicio-detail-extra-info">
                                <p><strong>Modalidad:</strong> {servicio.modalidad || 'Presencial / Remoto'}</p>
                                <p><strong>Garantía:</strong> {servicio.garantia || 'Garantía estándar'}</p>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="trust-badges">
                            <div className="trust-badge">
                                <svg className="trust-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Servicio Verificado</span>
                            </div>
                            <div className="trust-badge">
                                <svg className="trust-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Respuesta en 24h</span>
                            </div>
                            <div className="trust-badge">
                                <svg className="trust-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Garantía Incluida</span>
                            </div>
                            <div className="trust-badge">
                                <svg className="trust-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span>+500 Clientes</span>
                            </div>
                        </div>

                        <div className="servicio-detail-actions servicio-detail-footer">
                            <button
                                className="servicio-detail-buy-btn btn-contratar"
                                type="button"
                                onClick={handleOpenModal}
                            >
                                Contratar Servicio
                            </button>
                        </div>
                    </section>
                    <section className="servicio-detail-meta-grid">

                        <div className="servicio-detail-tabs">
                            <div className="servicio-detail-tab-headers">
                                <button
                                    className={`servicio-tab-header ${activeTab === 'descripcion' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => setActiveTab('descripcion')}
                                >
                                    Descripción
                                </button>
                                <button
                                    className={`servicio-tab-header ${activeTab === 'especificaciones' ? 'active' : ''}`}
                                    type="button"
                                    onClick={() => setActiveTab('especificaciones')}
                                >
                                    Especificaciones
                                </button>
                            </div>
                            <div className="servicio-detail-tab-body">
                                <div className={`servicio-tab-panel ${activeTab === 'descripcion' ? 'active' : ''}`}>
                                    <p className="servicio-detail-description servicio-descripcion">
                                        {descripcion}
                                    </p>
                                </div>
                                <div className={`servicio-tab-panel ${activeTab === 'especificaciones' ? 'active' : ''}`}>
                                    <table className="servicio-specs-table">
                                        <tbody>
                                            {specs.map((spec) => (
                                                <tr key={spec.label}>
                                                    <th>{spec.label}</th>
                                                    <td>{spec.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            {isModalOpen && (
                <AgendarServicioModal
                    servicio={servicio}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitModal}
                />
            )}
        </div>
    );
};

export default ServicioDetail;
