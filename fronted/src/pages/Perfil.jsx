import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Perfil.css';

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Tabs
  const [activeTab, setActiveTab] = useState('info');
  
  // Estado para información del usuario
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // Estado para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    correo: ''
  });
  
  // Estado para cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Estado para órdenes
  const [ordenes, setOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  
  // Estados de feedback
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  // Cargar datos del usuario
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    } else {
      setLoadingUser(false);
    }
  }, [user]);

  // Cargar órdenes cuando se activa la pestaña
  useEffect(() => {
    if (activeTab === 'ordenes' && user?.id && ordenes.length === 0) {
      fetchOrdenes();
    }
  }, [activeTab, user]);

  const fetchUserData = async () => {
    try {
      setLoadingUser(true);
      const response = await fetch(`/api/usuarios/${user.id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.usuario);
        setEditForm({
          nombre: data.usuario.nombre || '',
          apellido: data.usuario.apellido || '',
          correo: data.usuario.correo || ''
        });
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
      showMessage('error', 'Error al cargar los datos del usuario');
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchOrdenes = async () => {
    try {
      setLoadingOrdenes(true);
      const response = await fetch(`/api/ordenes/cliente/${user.id}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrdenes(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    } finally {
      setLoadingOrdenes(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editForm.nombre.trim() || !editForm.apellido.trim() || !editForm.correo.trim()) {
      showMessage('error', 'Todos los campos son requeridos');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/usuarios/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nombre: editForm.nombre.trim(),
          apellido: editForm.apellido.trim(),
          correo: editForm.correo.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.usuario);
        setIsEditing(false);
        showMessage('success', 'Perfil actualizado correctamente');
      } else {
        showMessage('error', data.mensaje || data.message || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      showMessage('error', 'Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showMessage('error', 'Todos los campos son requeridos');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/usuarios/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          hash_password: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showMessage('success', 'Contraseña actualizada correctamente');
      } else {
        showMessage('error', data.mensaje || data.message || 'Error al cambiar contraseña');
      }
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      showMessage('error', 'Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutClick = () => {
    logout(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoClass = (estado) => {
    const estados = {
      pendiente: 'estado-pendiente',
      procesando: 'estado-procesando',
      completada: 'estado-completada',
      cancelada: 'estado-cancelada',
      pagado: 'estado-pagado',
      reembolsado: 'estado-reembolsado'
    };
    return estados[estado] || 'estado-pendiente';
  };

  // Si no hay usuario
  if (!user) {
    return (
      <div className="perfil-page">
        <div className="perfil-no-user">
          <i className="fas fa-user-slash"></i>
          <h2>No has iniciado sesión</h2>
          <p>Inicia sesión para ver tu perfil</p>
          <button className="btn-shop" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left"></i> Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (loadingUser) {
    return (
      <div className="perfil-page">
        <div className="perfil-loading">
          <div className="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      {/* Botón para volver a la tienda */}
      <div className="perfil-back-nav">
        <Link to="/" className="btn-back-to-shop">
          <i className="fas fa-arrow-left"></i> Volver a la tienda
        </Link>
      </div>

      <div className="perfil-container">
        {/* Header del perfil CON EFECTOS DINÁMICOS */}
        <div className="perfil-header">
          {/* Líneas de lluvia animadas */}
          <div className="rain-line"></div>
          <div className="rain-line"></div>
          <div className="rain-line"></div>
          <div className="rain-line"></div>
          <div className="rain-line"></div>
          <div className="rain-line"></div>
          
          {/* Efecto de brillo en movimiento */}
          <div className="shine-effect"></div>
          
          {/* Contenido del header */}
          <div className="perfil-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="perfil-header-info">
            <h1>{userData?.nombre} {userData?.apellido}</h1>
            <p className="perfil-email">{userData?.correo}</p>
            <span className="perfil-rol">{user.rol}</span>
          </div>
        </div>

        {/* Mensaje de feedback */}
        {message.text && (
          <div className={`perfil-message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        {/* Tabs de navegación */}
        <div className="perfil-tabs">
          <button 
            className={`perfil-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <i className="fas fa-user"></i>
            Información Personal
          </button>
          <button 
            className={`perfil-tab ${activeTab === 'seguridad' ? 'active' : ''}`}
            onClick={() => setActiveTab('seguridad')}
          >
            <i className="fas fa-lock"></i>
            Seguridad
          </button>
          <button 
            className={`perfil-tab ${activeTab === 'ordenes' ? 'active' : ''}`}
            onClick={() => setActiveTab('ordenes')}
          >
            <i className="fas fa-shopping-bag"></i>
            Mis Pedidos
          </button>
        </div>

        {/* Contenido de tabs */}
        <div className="perfil-content">
          
          {/* Tab: Información Personal */}
          {activeTab === 'info' && (
            <div className="perfil-section">
              <div className="section-header">
                <h2>Información Personal</h2>
                {!isEditing && (
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>
                    <i className="fas fa-edit"></i> Editar Información
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="perfil-form">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      value={editForm.nombre}
                      onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido</label>
                    <input
                      type="text"
                      value={editForm.apellido}
                      onChange={(e) => setEditForm({...editForm, apellido: e.target.value})}
                      placeholder="Tu apellido"
                    />
                  </div>
                  <div className="form-group">
                    <label>Correo electrónico</label>
                    <input
                      type="email"
                      value={editForm.correo}
                      onChange={(e) => setEditForm({...editForm, correo: e.target.value})}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        nombre: userData?.nombre || '',
                        apellido: userData?.apellido || '',
                        correo: userData?.correo || ''
                      });
                    }}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-save" disabled={saving}>
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="perfil-info-grid">
                  <div className="info-item">
                    <span className="info-label">Nombre</span>
                    <span className="info-value">{userData?.nombre || 'No especificado'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Apellido</span>
                    <span className="info-value">{userData?.apellido || 'No especificado'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Correo electrónico</span>
                    <span className="info-value">{userData?.correo}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">ID de usuario</span>
                    <span className="info-value">#{user.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Rol</span>
                    <span className="info-value">{user.rol}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Miembro desde</span>
                    <span className="info-value">{formatDate(userData?.created_at)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Seguridad */}
          {activeTab === 'seguridad' && (
            <div className="perfil-section">
              <div className="section-header">
                <h2>Seguridad y Cuenta</h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="perfil-form password-form">
                <div className="form-group">
                  <label>Contraseña actual</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      className="toggle-password"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    >
                      <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Nueva contraseña</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      className="toggle-password"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    >
                      <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  <small className="form-hint">Mínimo 6 caracteres</small>
                </div>

                <div className="form-group">
                  <label>Confirmar nueva contraseña</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      className="toggle-password"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    >
                      <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving ? 'Actualizando...' : 'Cambiar contraseña'}
                  </button>
                </div>
              </form>

              <div className="security-section">
                <h3>Cerrar Sesión</h3>
                <p>Cierra tu sesión en este dispositivo</p>
                <button className="btn-logout" onClick={handleLogoutClick}>
                  <i className="fas fa-sign-out-alt"></i> Cerrar sesión
                </button>
              </div>
            </div>
          )}

          {/* Tab: Mis Pedidos */}
          {activeTab === 'ordenes' && (
            <div className="perfil-section">
              <div className="section-header">
                <h2>Historial de Pedidos</h2>
                <button className="btn-refresh" onClick={fetchOrdenes} disabled={loadingOrdenes}>
                  <i className={`fas fa-sync-alt ${loadingOrdenes ? 'fa-spin' : ''}`}></i>
                </button>
              </div>

              {loadingOrdenes ? (
                <div className="ordenes-loading">
                  <div className="spinner"></div>
                  <p>Cargando pedidos...</p>
                </div>
              ) : ordenes.length === 0 ? (
                <div className="ordenes-empty">
                  <i className="fas fa-shopping-bag"></i>
                  <h3>No tienes pedidos aún</h3>
                  <p>Cuando realices una compra, aparecerá aquí</p>
                  <button className="btn-shop" onClick={() => navigate('/productos')}>
                    Ir a comprar
                  </button>
                </div>
              ) : (
                <div className="ordenes-list">
                  {ordenes.map((orden) => (
                    <div key={orden.id} className="orden-card">
                      <div className="orden-header">
                        <div className="orden-numero">
                          <span className="label">Orden</span>
                          <span className="value">{orden.numero_orden}</span>
                        </div>
                        <div className="orden-fecha">
                          {formatDate(orden.created_at)}
                        </div>
                      </div>
                      
                      <div className="orden-body">
                        <div className="orden-info">
                          <div className="orden-tipo">
                            <i className={`fas ${orden.tipo === 'producto' ? 'fa-box' : orden.tipo === 'servicio' ? 'fa-tools' : 'fa-boxes'}`}></i>
                            <span>{orden.tipo}</span>
                          </div>
                          <div className="orden-total">
                            {formatCurrency(orden.total)}
                          </div>
                        </div>
                        
                        <div className="orden-estados">
                          <span className={`estado-badge ${getEstadoClass(orden.estado_orden)}`}>
                            {orden.estado_orden}
                          </span>
                          <span className={`estado-badge ${getEstadoClass(orden.estado_pago)}`}>
                            Pago: {orden.estado_pago}
                          </span>
                        </div>
                      </div>

                      <div className="orden-actions">
                        <button 
                          className="btn-ver-detalle"
                          onClick={() => navigate(`/factura/${orden.id}`)}
                        >
                          Ver detalle <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;