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

    // Obtener todos los servicios al cargar
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
                            aria-label="Carrito"
                            onClick={() => setCartOpen(o => !o)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="servicios-cart-badge">{cartCount}</span>
                            )}
                        </button>

                        {/* Dropdown del carrito */}
                        {cartOpen && (
                            <div className="servicios-cart-dropdown">
                                <h4>Carrito de Servicios</h4>
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
                                                            ${(item.price * item.quantity).toFixed(2)} (x{item.quantity})
                                                        </div>
                                                    </div>
                                                    <div className="cart-item-actions">
                                                        <button onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar">+</button>
                                                        <button onClick={() => changeQuantity(item.id, -1)} aria-label="Disminuir">−</button>
                                                        <button className="remove" onClick={() => removeFromCart(item.id)} aria-label="Eliminar">×</button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="cart-total">
                                            <strong>Total:</strong>
                                            <strong>${cartTotal.toFixed(2)}</strong>
                                        </div>
                                        <div className="cart-buttons">
                                            <button className="checkout-btn" onClick={() => setCartOpen(false)}>
                                                Proceder al Pago
                                            </button>
                                            <button className="clear-btn" onClick={() => setCartItems([])}>
                                                Vaciar
                                            </button>
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
                <h2 className="servicios-title">Nuestros Servicios Técnicos</h2>

                {/* Tarjetas de filtro */}
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

                {/* Lista de servicios */}
                <div className="servicios-content">
                    <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.75rem' }}>
                        {filtroActivo === 'todos' ? 'Todos los Servicios' :
                            filtroActivo === 'basico' ? 'Servicios Básicos' : 'Servicios Avanzados'}
                    </h3>

                    {loading && <p className="loading-message">Cargando servicios...</p>}
                    {error && <p className="error-message">Error: {error}</p>}
                    {!loading && !error && serviciosFiltrados.length === 0 && (
                        <p className="empty-message">No hay servicios disponibles en esta categoría.</p>
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
                                    <button
                                        className="servicio-add-btn"
                                        onClick={() => addToCart(servicio)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
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
                    <h3>Soporte Técnico</h3>
                    <p>NextLevelPC@gmail.com</p>
                    <p>© {new Date().getFullYear()} NextLevelPc. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Servicios;