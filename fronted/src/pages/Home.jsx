import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const API_BASE = 'http://localhost:8080';

// --- SVGs para los íconos ---
const IconMenu = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const IconCart = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);
const IconEye = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
// --- Fin de SVGs ---

const Home = () => {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
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

    // Cargar productos destacados
    useEffect(() => {
        const fetchProductosDestacados = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/api/productos/destacados?limite=6`);

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

    // Funciones del carrito
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

    // Formateador para el total del carrito
    const formatCartTotal = (total) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(total);
    }

    const cartTotal = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);

    // Función para formatear el precio
    const formatPrice = (price) => {
        const number = Number(price);
        if (isNaN(number)) {
            return 'N/A';
        }
        return new Intl.NumberFormat('es-ES').format(number);
    };

    return (
        <div className="home-page-wrapper">

            {/* ===== Header ===== */}
            <header className="home-header">
                <div className="header-container">
                    <div className="header-container">
                        <div className="header-left">
                            <button className="header-icon-btn" aria-label="Menú">
                                <IconMenu />
                            </button>

                            <Link to="/home" className="home-logo">
                                <img
                                    src="/logo.png"
                                    alt="NextLevelPC"
                                    className="logo-img"
                                />
                            </Link>
                        </div>

                        <div className="header-right">
                            {/* 🔹 Aquí irían tus botones: Productos, Repuestos, etc. */}
                        </div>
                    </div>


                    <nav className="home-nav">
                        <Link to="/productos" className="home-nav-link">Productos</Link>
                        <Link to="/repuestos" className="home-nav-link">Repuestos</Link>
                        <Link to="/accesorios" className="home-nav-link">Accesorios</Link>
                        <Link to="/servicios" className="home-nav-link">Servicios</Link>
                    </nav>

                    <div className="header-right">
                        <button className="header-icon-btn" aria-label="Perfil de usuario">
                            <IconUser />
                        </button>
                        <div className="cart-widget-container">
                            <button
                                className="header-icon-btn cart-btn"
                                aria-label="Carrito"
                                onClick={() => setCartOpen(o => !o)}
                            >
                                <IconCart />
                                {cartCount > 0 && (
                                    <span className="home-cart-badge">{cartCount}</span>
                                )}
                            </button>

                            {/* Dropdown del carrito */}
                            {cartOpen && (
                                <div className="home-cart-dropdown">
                                    <h4>Carrito</h4>
                                    {cartItems.length === 0 ? (
                                        <p>Tu carrito está vacío</p>
                                    ) : (
                                        <>
                                            <ul className="cart-dropdown-list">
                                                {cartItems.map(item => (
                                                    <li key={item.id} className="cart-dropdown-item">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="cart-item-image"
                                                        />
                                                        <div className="cart-item-info">
                                                            <div className="cart-item-title">{item.title}</div>
                                                            <div className="cart-item-price">
                                                                {formatCartTotal(item.price * item.quantity)} ({item.quantity})
                                                            </div>
                                                        </div>
                                                        <div className="cart-item-controls">
                                                            <button onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar">+</button>
                                                            <button onClick={() => changeQuantity(item.id, -1)} aria-label="Disminuir" >−</button>
                                                            <button onClick={() => removeFromCart(item.id)} aria-label="Eliminar" className="btn-remove">x</button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="cart-dropdown-total">
                                                <strong>Total:</strong>
                                                <strong>{formatCartTotal(cartTotal)}</strong>
                                            </div>
                                            <div className="cart-dropdown-actions">
                                                <button className="btn-checkout">Checkout</button>
                                                <button className="btn-clear-cart" onClick={() => setCartItems([])}>Vaciar</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== Main Content ===== */}
            <main className="home-main">
                {/* Banner "Lo mas vendido" */}
                <div className="featured-title-banner">
                    <h2>Lo mas vendido:</h2>
                </div>

                {/* Estados de Carga y Error */}
                {loading && (
                    <div className="loading-message">
                        Cargando productos destacados...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading && !error && productosDestacados.length === 0 && (
                    <div className="empty-message">
                        No hay productos destacados disponibles
                    </div>
                )}

                {/* Contenedor de Scroll Horizontal */}
                {!loading && !error && productosDestacados.length > 0 && (
                    <div className="scroll-wrapper">
                        <div className="home-products-scroll-container">
                            {productosDestacados.map(product => (
                                <div key={product.id} className="home-product-card">
                                    <Link
                                        to={`/productos/${product.id}`}
                                        className="product-quick-view"
                                        aria-label={`Ver ${product.nombre}`}
                                    >
                                        <IconEye />
                                    </Link>

                                    <div className="product-image-container">
                                        <img
                                            src={product.imagen_principal || '/placeholder.png'}
                                            alt={product.nombre || 'Producto'}
                                            className="home-product-image"
                                            onError={(e) => {
                                                e.target.src = '/placeholder.png';
                                            }}
                                        />
                                    </div>

                                    <div className="home-product-content">
                                        <h3>{product.nombre}</h3>
                                        <p className="product-stock">
                                            Stock: {product.stock} unidades
                                        </p>
                                        <p className="product-price">
                                            ${formatPrice(product.precio_actual)}
                                        </p>
                                        <div className="product-actions">
                                            <button
                                                className="btn-add-cart"
                                                onClick={() => addToCart(product)}
                                                aria-label={`Añadir ${product.nombre} al carrito`}
                                            >
                                                Añadir al Carrito
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Flecha decorativa */}
                        <div className="scroll-arrow" aria-hidden="true">
                            &gt;
                        </div>
                    </div>
                )}

                {/* Botón "Ver Todos los Productos" */}
                {!loading && !error && productosDestacados.length > 0 && (
                    <div className="view-all-container">
                        <Link
                            to="/productos"
                            className="btn-view-all"
                        >
                            Ver Todos los Productos →
                        </Link>
                    </div>
                )}
            </main>

            {/* ===== Footer ===== */}
            <footer className="home-footer">
                <p>© 2025 NextLevelPc. Todos los derechos reservados.</p>
                <p>
                    Soporte: <a href="mailto:NextLevel@gmail.com">NextLevel@gmail.com</a>
                </p>
            </footer>
        </div>
    );
};

export default Home;