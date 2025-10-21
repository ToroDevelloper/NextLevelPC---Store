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
    const [cartItems, setCartItems] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);

    // Cargar carrito desde localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('nlpc_cart');
            if (saved) setCartItems(JSON.parse(saved));
        } catch (e) {
            console.error('Error cargando carrito:', e);
        }
    }, []);

    // Guardar carrito en localStorage
    useEffect(() => {
        try {
            localStorage.setItem('nlpc_cart', JSON.stringify(cartItems));
        } catch (e) {
            console.error('Error guardando carrito:', e);
        }
    }, [cartItems]);

    // Obtener servicios desde el backend
    useEffect(() => {
        const fetchServicios = async () => {
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

        fetchServicios();
    }, []);

    // Función para filtrar servicios
    const filtrarServicios = (tipo) => {
        setFiltroActivo(tipo);
        if (tipo === 'todos') {
            setServiciosFiltrados(servicios);
        } else if (tipo === 'basico') {
            // Filtrar servicios básicos (precio menor a 50000)
            setServiciosFiltrados(servicios.filter(s => Number(s.precio) < 50000));
        } else if (tipo === 'avanzado') {
            // Filtrar servicios avanzados (precio mayor o igual a 50000)
            setServiciosFiltrados(servicios.filter(s => Number(s.precio) >= 50000));
        }
    };

    const addToCart = (servicio) => {
        const item = {
            id: servicio.id,
            title: servicio.nombre,
            price: Number(servicio.precio),
            image: '/placeholder-servicio.png',
            tipo: 'servicio'
        };

        setCartItems(prev => {
            const exists = prev.find(p => p.id === item.id && p.tipo === 'servicio');
            if (exists) {
                return prev.map(p =>
                    (p.id === item.id && p.tipo === 'servicio')
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (servicioId) =>
        setCartItems(prev => prev.filter(p => !(p.id === servicioId && p.tipo === 'servicio')));

    const changeQuantity = (servicioId, delta) =>
        setCartItems(prev =>
            prev
                .map(p =>
                    (p.id === servicioId && p.tipo === 'servicio')
                        ? { ...p, quantity: Math.max(0, p.quantity + delta) }
                        : p
                )
                .filter(p => p.quantity > 0)
        );

    const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
    const cartTotal = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);

    return (
        <div className="servicios-container">
            {/* Header */}
            <header className="servicios-header">
                <div className="servicios-header-content">
                    <h1 className="servicios-logo">NextLevelPc</h1>
                    <nav className="servicios-nav">
                        <Link to="/home" className="servicios-nav-link">Home</Link>
                        <Link to="/productos" className="servicios-nav-link">Productos</Link>
                        <Link to="/repuestos" className="servicios-nav-link">Repuestos</Link>
                        <Link to="/accesorios" className="servicios-nav-link">Accesorios</Link>
                        <Link to="/servicios" className="servicios-nav-link active">Servicios</Link>
                    </nav>
                    <div className="servicios-user-section">
                        <span className="servicios-user-name">Usuario</span>
                        <button
                            className="servicios-cart-button"
                            onClick={() => setCartOpen(o => !o)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="servicios-cart-badge">{cartCount}</span>
                            )}
                        </button>

                        {cartOpen && (
                            <div className="servicios-cart-dropdown">
                                <h4>Carrito</h4>
                                {cartItems.length === 0 ? (
                                    <p className="cart-empty">Tu carrito está vacío</p>
                                ) : (
                                    <>
                                        <ul className="cart-items">
                                            {cartItems.map(item => (
                                                <li key={`${item.tipo}-${item.id}`} className="cart-item">
                                                    <div className="cart-item-info">
                                                        <div className="cart-item-title">{item.title}</div>
                                                        <div className="cart-item-price">
                                                            ${(item.price * item.quantity).toFixed(2)} ({item.quantity})
                                                        </div>
                                                    </div>
                                                    <div className="cart-item-actions">
                                                        <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                                                        <button onClick={() => changeQuantity(item.id, -1)}>−</button>
                                                        <button onClick={() => removeFromCart(item.id)} className="remove">×</button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="cart-total">
                                            <strong>Total:</strong>
                                            <strong>${cartTotal.toFixed(2)}</strong>
                                        </div>
                                        <div className="cart-buttons">
                                            <button className="checkout-btn" onClick={() => setCartOpen(false)}>Checkout</button>
                                            <button className="clear-btn" onClick={() => setCartItems([])}>Vaciar</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="servicios-main">
                <h2 className="servicios-title">Nuestros Servicios</h2>

                {/* Filtros con cards grandes */}
                <div className="servicios-filtros">
                    <div
                        className={`filtro-card ${filtroActivo === 'basico' ? 'active' : ''}`}
                        onClick={() => filtrarServicios('basico')}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&h=600&fit=crop"
                            alt="Servicio Básico"
                        />
                        <div className="filtro-overlay">
                            <h3>BÁSICO</h3>
                            <p>Mantenimiento y limpieza</p>
                        </div>
                    </div>

                    <div
                        className={`filtro-card ${filtroActivo === 'avanzado' ? 'active' : ''}`}
                        onClick={() => filtrarServicios('avanzado')}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&h=600&fit=crop"
                            alt="Servicio Avanzado"
                        />
                        <div className="filtro-overlay">
                            <h3>AVANZADO</h3>
                            <p>Reparación y actualización</p>
                        </div>
                    </div>
                </div>

                {/* Botón para mostrar todos */}
                {filtroActivo !== 'todos' && (
                    <button className="btn-mostrar-todos" onClick={() => filtrarServicios('todos')}>
                        Mostrar todos los servicios
                    </button>
                )}

                {/* Lista de servicios */}
                <div className="servicios-content">
                    {loading && <p className="loading-message">Cargando servicios...</p>}
                    {error && <p className="error-message">Error: {error}</p>}
                    {!loading && !error && serviciosFiltrados.length === 0 && (
                        <p className="empty-message">No hay servicios en esta categoría.</p>
                    )}

                    <div className="servicios-grid">
                        {serviciosFiltrados.map(servicio => (
                            <div key={servicio.id} className="servicio-card">
                                <div className="servicio-icon">
                                    🛠️
                                </div>
                                <div className="servicio-info">
                                    <h3>{servicio.nombre}</h3>
                                    {servicio.descripcion && (
                                        <p className="servicio-descripcion">{servicio.descripcion}</p>
                                    )}
                                    <p className="servicio-precio">${Number(servicio.precio).toFixed(2)}</p>
                                    <button
                                        className="servicio-add-btn"
                                        onClick={() => addToCart(servicio)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
                                        </svg>
                                        Añadir al Carrito
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="servicios-footer">
                <div className="servicios-footer-content">
                    <h3>Soporte</h3>
                    <p>NextLevelPC@gmail.com</p>
                    <p>© {new Date().getFullYear()} NextLevelPc. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Servicios;