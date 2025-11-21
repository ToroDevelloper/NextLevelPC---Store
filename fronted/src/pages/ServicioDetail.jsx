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
    const [relatedServices, setRelatedServices] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [galleryImages, setGalleryImages] = useState([]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitModal = async (formData) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para agendar una cita de servicio.');
            return { success: false };
        }
        try {
            const response = await fetch(`${API_BASE}/api/citas-servicios`, {
                method: 'POST',
                credentials: 'include',
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
                return { success: true, data: result.data };
            } else {
                throw new Error(result.message || 'No se pudo agendar la cita.');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert(`Error: ${error.message}`);
            return { success: false };
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

                    // Process gallery images from servicio_imagenes table
                    if (json.data.galeria_imagenes && Array.isArray(json.data.galeria_imagenes)) {
                        const urls = json.data.galeria_imagenes.map(img => img.url);
                        setGalleryImages(urls.length > 0 ? urls : ['https://placehold.co/600x400/EEE/31343C?text=Servicio']);
                    } else if (json.data.imagen_url) {
                        // Fallback to imagen_url if no gallery images
                        setGalleryImages([json.data.imagen_url]);
                    } else {
                        setGalleryImages(['https://placehold.co/600x400/EEE/31343C?text=Servicio']);
                    }
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

    // Fetch related services
    useEffect(() => {
        const fetchRelatedServices = async () => {
            if (!servicio?.tipo) return;

            try {
                const res = await fetch(`${API_BASE}/api/servicios/tipo/${encodeURIComponent(servicio.tipo)}`);
                if (!res.ok) return;

                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    // Filter out current service and limit to 3
                    const filtered = json.data
                        .filter(s => s.id !== servicio.id)
                        .slice(0, 3);
                    setRelatedServices(filtered);
                }
            } catch (err) {
                console.error('Error fetching related services:', err);
            }
        };

        fetchRelatedServices();
    }, [servicio]);

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
            {/* Breadcrumbs */}
            <nav className="breadcrumbs" aria-label="Breadcrumb">
                <ol className="breadcrumb-list">
                    <li className="breadcrumb-item">
                        <a href="/">Inicio</a>
                    </li>
                    <li className="breadcrumb-separator">/</li>
                    <li className="breadcrumb-item">
                        <a href="/servicios">Servicios</a>
                    </li>
                    <li className="breadcrumb-separator">/</li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {servicio.nombre}
                    </li>
                </ol>
            </nav>

            <div className="servicio-detail-main">
                {/* Image Gallery */}
                <div className="servicio-detail-gallery">
                    <div className="gallery-main-image">
                        <img
                            src={galleryImages[selectedImage]}
                            alt={`${servicio.nombre} - Imagen ${selectedImage + 1}`}
                            className="servicio-detail-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Servicio';
                            }}
                        />
                    </div>

                    {galleryImages.length > 1 && (
                        <div className="gallery-thumbnails">
                            {galleryImages.map((img, index) => (
                                <button
                                    key={index}
                                    className={`gallery-thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                    type="button"
                                >
                                    <img
                                        src={img}
                                        alt={`${servicio.nombre} - Miniatura ${index + 1}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/100x100/EEE/31343C?text=Img';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
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
                            <p className="cta-microcopy">Sin compromiso • Respuesta inmediata</p>

                            <a
                                href={`https://wa.me/5215512345678?text=Hola,%20me%20interesa%20el%20servicio:%20${encodeURIComponent(servicio.nombre)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="servicio-whatsapp-btn"
                            >
                                <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Consultar por WhatsApp
                            </a>
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

            {/* Related Services */}
            {relatedServices.length > 0 && (
                <div className="related-services">
                    <h2 className="related-services-title">También te puede interesar</h2>
                    <div className="related-services-grid">
                        {relatedServices.map(service => (
                            <a
                                key={service.id}
                                href={`/servicios/${service.id}`}
                                className="related-service-card"
                            >
                                <div className="related-service-image-wrapper">
                                    <img
                                        src={service.imagen_url || 'https://placehold.co/300x200/EEE/31343C?text=Servicio'}
                                        alt={service.nombre}
                                        className="related-service-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/300x200/EEE/31343C?text=Servicio';
                                        }}
                                    />
                                </div>
                                <div className="related-service-info">
                                    <h3 className="related-service-name">{service.nombre}</h3>
                                    {service.tipo && <p className="related-service-type">{service.tipo}</p>}
                                    <p className="related-service-price">${Number(service.precio || 0).toFixed(2)}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
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
