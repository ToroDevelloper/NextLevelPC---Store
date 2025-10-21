import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const API_BASE = 'http://localhost:8080';

const Servicios = () => {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    // 👇 Nuevo estado para el filtro
    const [filtroCategoria, setFiltroCategoria] = useState('');

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
                setServicios(Array.isArray(serviciosData) ? serviciosData : []);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error cargando servicios');
            } finally {
                setLoading(false);
            }
        };

        fetchServicios();
    }, []);

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

    // 👇 Función para limpiar el filtro
    const limpiarFiltro = () => setFiltroCategoria('');

    return (
        <div className="principal">
            <div className="home-container">
                {/* Header */}
                <header className="home-header">
                    <div className="home-header-container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <h1 className="home-logo">NextLevelPc</h1>
                            <nav className="home-nav">
                                <Link to="/home" className="home-nav-link">Home</Link>
                                <Link to="/productos" className="home-nav-link">Productos</Link>
                                <Link to="/repuestos" className="home-nav-link">Repuestos</Link>
                                <Link to="/accesorios" className="home-nav-link">Accesorios</Link>
                                <Link to="/servicios" className="home-nav-link">Servicios</Link>
                            </nav>
                        </div>

                        <div className="home-user-section" style={{ position: 'relative' }}>
                            <span className="home-user-name">Usuario</span>
                            <button
                                className="home-cart-button"
                                aria-label="Carrito"
                                onClick={() => setCartOpen(o => !o)}
                                style={{ position: 'relative' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="home-cart-badge" style={{
                                        position: 'absolute',
                                        top: -6,
                                        right: -6,
                                        background: '#e11',
                                        color: '#030303ff',
                                        borderRadius: '999px',
                                        padding: '2px 6px',
                                        fontSize: '12px'
                                    }}>{cartCount}</span>
                                )}
                            </button>

                            {/* Dropdown del carrito */}
                            {cartOpen && (
                                <div className="home-cart-dropdown" style={{
                                    position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 320,
                                    background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: 8, padding: 12, zIndex: 60
                                }}>
                                    <h4 style={{ margin: '0 0 8px 0', color: '#000' }}>Carrito</h4>
                                    {cartItems.length === 0 ? <p style={{ margin: 0, color: '#000' }}>Tu carrito está vacío</p> : (
                                        <>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: 220, overflowY: 'auto' }}>
                                                {cartItems.map(item => (
                                                    <li key={`${item.tipo}-${item.id}`} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: 14, color: '#000' }}>{item.title}</div>
                                                            <div style={{ fontSize: 13, color: '#646262ff' }}>
                                                                ${(item.price * item.quantity).toFixed(2)} ({item.quantity})
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                            <button onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar" style={{ padding: '4px 6px' }}>+</button>
                                                            <button onClick={() => changeQuantity(item.id, -1)} aria-label="Disminuir" style={{ padding: '4px 6px' }}>−</button>
                                                            <button onClick={() => removeFromCart(item.id)} aria-label="Eliminar" style={{ padding: '4px 6px', color: '#a00' }}>x</button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, color: '#000' }}>
                                                <strong>Total:</strong><strong>${cartTotal.toFixed(2)}</strong>
                                            </div>
                                            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                                                <button onClick={() => setCartOpen(false)} style={{ flex: 1 }}>Checkout</button>
                                                <button onClick={() => setCartItems([])} style={{ background: '#eee' }}>Vaciar</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="home-main">
                    <h2 className="home-title">Nuestros Servicios</h2>

                    {/* Servicios destacados - Cards grandes */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        {/* Servicio Básico */}
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                height: '300px',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onClick={() => setFiltroCategoria('basico')}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop"
                                alt="Servicio Básico"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                display: 'flex',
                                alignItems: 'flex-end',
                                padding: '2rem'
                            }}>
                                <h3 style={{
                                    color: 'white',
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    margin: 0,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                }}>BÁSICO</h3>
                            </div>
                        </div>

                        {/* Servicio Avanzado */}
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                height: '300px',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onClick={() => setFiltroCategoria('avanzado')}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=600&fit=crop"
                                alt="Servicio Avanzado"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                display: 'flex',
                                alignItems: 'flex-end',
                                padding: '2rem'
                            }}>
                                <h3 style={{
                                    color: 'white',
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    margin: 0,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                }}>AVANZADO</h3>
                            </div>
                        </div>
                    </div>

                    {/* Botón para limpiar el filtro */}
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <button
                            onClick={limpiarFiltro}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#f0f0f0',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Mostrar Todos
                        </button>
                    </div>

                    {/* Lista de servicios disponibles */}
                    <h3 style={{ marginTop: '1rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Todos los Servicios</h3>

                    {loading && <p>Cargando servicios...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    {!loading && !error && servicios.length === 0 && <p>No hay servicios disponibles.</p>}

                    {/* 👇 Filtrado de servicios */}
                    {!loading && !error && (
                        <div className="home-products-grid">
                            {servicios
                                .filter(servicio => {
                                    if (filtroCategoria === '') return true;
                                    const texto = `${servicio.nombre} ${servicio.descripcion || ''}`.toLowerCase();
                                    if (filtroCategoria === 'basico') return texto.includes('basico');
                                    if (filtroCategoria === 'avanzado') return texto.includes('avanzado');
                                    return true;
                                })
                                .map(servicio => (
                                    <div key={servicio.id} className="home-product-card">
                                        <div style={{
                                            height: '200px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '3rem',
                                            fontWeight: 'bold'
                                        }}>
                                            🛠️
                                        </div>
                                        <div className="home-product-content">
                                            <h3 style={{ color: '#000' }}>{servicio.nombre}</h3>
                                            {servicio.descripcion && (
                                                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                                                    {servicio.descripcion}
                                                </p>
                                            )}
                                            <p style={{ color: '#000', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                                ${Number(servicio.precio).toFixed(2)}
                                            </p>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    className="home-add-cart-button"
                                                    onClick={() => addToCart(servicio)}
                                                    aria-label={`Añadir ${servicio.nombre} al carrito`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginRight: 6 }}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
                                                    </svg>
                                                    Añadir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="home-footer">
                    <div className="home-footer-container">
                        <h3 className="home-footer-title">Soporte</h3>
                        <p className="home-footer-email">NextLevelPC@gmail.com</p>
                        <p>© {new Date().getFullYear()} NextLevelPc. Todos los derechos reservados.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Servicios;