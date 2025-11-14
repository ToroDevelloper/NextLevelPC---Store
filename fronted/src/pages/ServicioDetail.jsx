import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ServicioDetail.css';
import AgendarServicioModal from '../components/AgendarServicioModal'; // Importar el modal

const API_BASE = 'http://localhost:8080';

const ServicioDetail = () => {
    const { id } = useParams();
    const [servicio, setServicio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitModal = async (formData) => {
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

    return (
        <>
            <div className="servicio-detail-page">
                <div className="servicio-detail-card">
                    {servicio.imagen_url && (
                        <div className="servicio-detail-image-container">
                            <img src={servicio.imagen_url} alt={servicio.nombre} className="servicio-detail-image" />
                        </div>
                    )}
                    <div className="servicio-detail-content">
                        <div className="servicio-detail-header">
                            <h1>{servicio.nombre}</h1>
                            <p className="servicio-tipo">{servicio.tipo}</p>
                        </div>
                        <div className="servicio-detail-body">
                            <p className="servicio-descripcion">{servicio.descripcion}</p>
                            <p className="servicio-precio">Precio: ${servicio.precio}</p>
                        </div>
                        <div className="servicio-detail-footer">
                            <button className="btn-contratar" onClick={handleOpenModal}>Contratar Servicio</button>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <AgendarServicioModal
                    servicio={servicio}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitModal}
                />
            )}
        </>
    );
};

export default ServicioDetail;
