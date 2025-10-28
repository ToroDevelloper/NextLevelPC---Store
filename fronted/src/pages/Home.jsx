import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const API_BASE = 'http://localhost:8080';

const Home = () => {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);


    useEffect(() => {
        try {
            const saved = localStorage.getItem('nlpc_cart');
            if (saved) setCartItems(JSON.parse(saved));
        } catch (e) {
            console.error('Error cargando carrito:', e);
        }
    }, []);


    useEffect(() => {
        try {
            localStorage.setItem('nlpc_cart', JSON.stringify(cartItems));
        } catch (e) {
            console.error('Error guardando carrito:', e);
        }
    }, [cartItems]);


    useEffect(() => {
        const fetchProductosDestacados = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/api/productos/destacados?limite=10`);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    setProductosDestacados(data.data);
                } else {
                    setError('No se pudieron cargar los productos');
                }
            } catch (err) {
                console.error('Error cargando productos destacados:', err);
                setError('Error al cargar productos destacados');
            } finally {
                setLoading(false);
            }
        };

        fetchProductosDestacados();
    }, []);


    const addToCart = (product) => {
        const item = {
            id: product.id,
            title: product.nombre,
            price: parseFloat(product.precio_actual),
            image: product.imagen_principal || '/placeholder.png'
        };

        setCartItems(prev => {
            const exists = prev.find(p => p.id === item.id);
            if (exists) {
                return prev.map(p =>
                    p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(p => p.id !== productId));
    };

    const changeQuantity = (productId, delta) => {
        setCartItems(prev =>
            prev
                .map(p =>
                    p.id === productId
                        ? { ...p, quantity: Math.max(0, p.quantity + delta) }
                        : p
                )
                .filter(p => p.quantity > 0)
        );
    };

    const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
    const cartTotal = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);

    return (
        <div className="principal">
            <div className="home-container">
                {/* Header */}
                <header className="home-header">
                    <div className="home-header-container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Link to="/home" style={{ textDecoration: 'none' }}>
                                <h1 className="home-logo">NextLevelPc</h1>
                            </Link>
                            <nav className="home-nav">
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
                                        color: '#fff',
                                        borderRadius: '999px',
                                        padding: '2px 6px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>{cartCount}</span>
                                )}
                            </button>

                            {/* Dropdown del carrito */}
                            {cartOpen && (
                                <div className="home-cart-dropdown" style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 'calc(100% + 8px)',
                                    width: 320,
                                    background: '#fff',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    borderRadius: 8,
                                    padding: 12,
                                    zIndex: 60
                                }}>
                                    <h4 style={{ margin: '0 0 8px 0', color: '#000' }}>Carrito</h4>
                                    {cartItems.length === 0 ? (
                                        <p style={{ margin: 0, color: '#000' }}>Tu carrito está vacío</p>
                                    ) : (
                                        <>
                                            <ul style={{
                                                listStyle: 'none',
                                                padding: 0,
                                                margin: 0,
                                                maxHeight: 220,
                                                overflowY: 'auto'
                                            }}>
                                                {cartItems.map(item => (
                                                    <li key={item.id} style={{
                                                        display: 'flex',
                                                        gap: 8,
                                                        alignItems: 'center',
                                                        marginBottom: 8
                                                    }}>
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            style={{
                                                                width: 56,
                                                                height: 40,
                                                                objectFit: 'cover',
                                                                borderRadius: 6
                                                            }}
                                                        />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: 14, color: '#000' }}>
                                                                {item.title}
                                                            </div>
                                                            <div style={{ fontSize: 13, color: '#646262ff' }}>
                                                                ${(item.price * item.quantity).toFixed(2)} ({item.quantity})
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                            <button
                                                                onClick={() => changeQuantity(item.id, 1)}
                                                                aria-label="Aumentar"
                                                                style={{ padding: '4px 6px' }}
                                                            >
                                                                +
                                                            </button>
                                                            <button
                                                                onClick={() => changeQuantity(item.id, -1)}
                                                                aria-label="Disminuir"
                                                                style={{ padding: '4px 6px' }}
                                                            >
                                                                −
                                                            </button>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                aria-label="Eliminar"
                                                                style={{ padding: '4px 6px', color: '#a00' }}
                                                            >
                                                                x
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginTop: 8,
                                                color: '#000'
                                            }}>
                                                <strong>Total:</strong>
                                                <strong>${cartTotal.toFixed(2)}</strong>
                                            </div>
                                            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                                                <button
                                                    onClick={() => setCartOpen(false)}
                                                    style={{ flex: 1 }}
                                                >
                                                    Checkout
                                                </button>
                                                <button
                                                    onClick={() => setCartItems([])}
                                                    style={{ background: '#eee' }}
                                                >
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

                {}
                <main className="home-main">
                    <h2 className="home-title">Productos Destacados</h2>

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            Cargando productos destacados...
                        </div>
                    )}

                    {error && (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: '#e11',
                            background: '#fee',
                            borderRadius: 8,
                            margin: '1rem 0'
                        }}>
                            {error}
                        </div>
                    )}

                    {!loading && !error && productosDestacados.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            No hay productos destacados disponibles
                        </div>
                    )}

                    <div className="home-products-grid">
                        {productosDestacados.map(product => (
                            <div key={product.id} className="home-product-card">
                                <img
                                    src={product.imagen_principal || '/placeholder.png'}
                                    alt={product.nombre || 'Producto'}
                                    className="home-product-image"
                                    onError={(e) => {
                                        e.target.src = '/placeholder.png';
                                    }}
                                />
                                <div className="home-product-content">
                                    <h3 style={{ color: '#000', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                        {product.nombre}
                                    </h3>
                                    <p style={{
                                        color: '#2563eb',
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        marginBottom: '0.5rem'
                                    }}>
                                        ${Number(product.precio_actual).toFixed(2)}
                                    </p>
                                    <p style={{
                                        color: product.stock > 10 ? '#10b981' : '#f59e0b',
                                        fontSize: '0.9rem',
                                        marginBottom: '0.8rem'
                                    }}>
                                        Stock: {product.stock} unidades
                                    </p>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            className="home-add-cart-button"
                                            onClick={() => addToCart(product)}
                                            aria-label={`Añadir ${product.nombre} al carrito`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                style={{ marginRight: 6 }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13"
                                                />
                                            </svg>
                                            Añadir
                                        </button>
                                        <Link
                                            to={`/productos/${product.id}`}
                                            style={{
                                                padding: '8px 12px',
                                                background: '#6b7280',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                textDecoration: 'none',
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            Ver
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!loading && !error && productosDestacados.length > 0 && (
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <Link
                                to="/productos"
                                style={{
                                    display: 'inline-block',
                                    padding: '0.75rem 2rem',
                                    background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                                    color: '#fff',
                                    borderRadius: '0.5rem',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Ver Todos los Productos →
                            </Link>
                        </div>
                    )}
                </main>

                {}
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

export default Home;