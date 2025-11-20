import React, { useState } from 'react';
import '../styles/AgendarServicioModal.css';

const AgendarServicioModal = ({ servicio, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        fecha: '',
        descripcion: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Agendar Visita para: {servicio.nombre}</h2>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre Completo</label>
                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="direccion">Dirección Completa</label>
                        <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha">Fecha y Hora Preferida</label>
                        <input type="datetime-local" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción del Problema</label>
                        <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3"></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-submit">Confirmar Cita</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgendarServicioModal;

