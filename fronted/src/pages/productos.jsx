import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../styles/Productos.css";
//<Link to="/productos" className="home-nav-link">Productos</Link>
const API_BASE = 'http://localhost:8080';
const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const Productos = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // --- LÓGICA DE RUTA CORREGIDA ---
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');

    // Definir rutas de manera más precisa
    const isProductsRoute = location.pathname === '/productos';
    const isSearchRoute = location.pathname === '/productos/buscar';
    const isProductDetailRoute = /^\/productos\/[^/]+\/?$/.test(location.pathname) && !isSearchRoute;

    // Obtener ID del producto solo si es una ruta de detalle
    let productId = null;
    if (isProductDetailRoute) {
        const match = location.pathname.match(/^\/productos\/([^/]+)\/?$/);
        productId = match ? match[1] : null;
    }

    // --- DEBUG: Logs para verificar la lógica de rutas ---
    useEffect(() => {
        console.log('Ruta actual:', location.pathname);
        console.log('Parámetros de búsqueda:', location.search);
        console.log('Término de búsqueda:', searchQuery);
        console.log('Es ruta de productos:', isProductsRoute);
        console.log('Es ruta de búsqueda:', isSearchRoute);
        console.log('Es ruta de detalle:', isProductDetailRoute);
        console.log('ID del producto:', productId);
    }, [location.pathname, location.search, searchQuery, isProductsRoute, isSearchRoute, isProductDetailRoute, productId]);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState('');

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

    const parseImagenesField = field => {
        if (!field) return [];
        return String(field)
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map((url, idx) => ({ url, es_principal: idx === 0 }));
    };

    const normalizeProduct = raw => {
        const id = raw.id ?? raw.producto_id ?? raw.productoId;
        const nombre = raw.nombre ?? raw.title ?? raw.name ?? '';
        const precio_actual = raw.precio_actual ?? raw.precio ?? raw.price ?? 0;
        const stock = raw.stock ?? 0;
        const activo = raw.activo ?? 1;

        let imagenes = [];
        if (Array.isArray(raw.imagenes)) {
            imagenes = raw.imagenes;
        } else if (typeof raw.imagenes === 'string') {
            imagenes = parseImagenesField(raw.imagenes);
        } else if (raw.imagenes === null && raw.url_imagen) {
            imagenes = [{ url: raw.url_imagen, es_principal: raw.es_principal === 1 }];
        }

        let firstImg = '/placeholder.png';
        if (raw.imagen_principal) {
            firstImg = raw.imagen_principal;
        } else if (Array.isArray(imagenes) && imagenes.length > 0) {
            firstImg = imagenes[0].url ?? imagenes[0];
        }

        return {
            id,
            nombre,
            price: Number(precio_actual),
            stock,
            activo,
            image: firstImg,
            imagenes,
            raw
        };
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = localSearchQuery.trim();
        if (query) {
            navigate(`/products/buscar?q=${encodeURIComponent(query)}`);
            setLocalSearchQuery('');
        }
    };

    const getTitle = () => {
        if (productId) return 'Detalle del Producto';
        if (isSearchRoute) return `Resultados para: "${searchQuery}"`;
        if (isProductsRoute) return 'Todos los Productos';
        const pageName = location.pathname.replace('/', '');
        return pageName.charAt(0).toUpperCase() + pageName.slice(1);
    };

    const addToCart = product => {
        const item = {
            id: product.id,
            title: product.nombre,
            price: product.price,
            image: product.image
        };

        setCartItems(prev => {
            const exists = prev.find(p => p.id === item.id);
            if (exists) {
                return prev.map(p => (p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = productId => setCartItems(prev => prev.filter(p => p.id !== productId));
    const changeQuantity = (productId, delta) =>
        setCartItems(prev =>
            prev
                .map(p => (p.id === productId ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p))
                .filter(p => p.quantity > 0)
        );

    const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
    const cartTotal = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);

    // --- useEffect DE CARGA DE DATOS CORREGIDO ---
    useEffect(() => {
        console.log('Iniciando carga de datos...');

        // Decide qué endpoint de la API usar
        let endpoint = '';
        if (productId) {
            // 1. Caso: Viendo un solo producto
            endpoint = `${API_BASE}/api/productos/${encodeURIComponent(productId)}`;
            console.log('Cargando producto individual:', endpoint);
        } else if (isSearchRoute && searchQuery) {
            // 2. Caso: Viendo resultados de búsqueda
            endpoint = `${API_BASE}/api/productos/buscar?q=${encodeURIComponent(searchQuery)}`;
            console.log('Cargando resultados de búsqueda:', endpoint);
        } else if (isProductsRoute) {
            // 3. Caso: Viendo todos los productos
            endpoint = `${API_BASE}/api/productos/con-imagenes`;
            console.log('Cargando todos los productos:', endpoint);
        } else if (isSearchRoute && !searchQuery) {
            // Si es ruta de búsqueda pero no hay término, no hacer fetch
            console.log('Ruta de búsqueda sin término, limpiando productos');
            setLoading(false);
            setProducts([]);
            setError(null);
            return;
        } else {
            // Ruta no reconocida (ej: /repuestos, /accesorios)
            console.log(' Ruta no reconocida, limpiando productos');
            setProducts([]);
            setLoading(false);
            setError(null);
            return;
        }

        endpoint = endpoint.replace('//api', '/api');
        console.log('🔗 Endpoint final:', endpoint);

        const abortCtrl = new AbortController();
        const signal = abortCtrl.signal;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setProducts([]);

            try {
                console.log(' Haciendo fetch a:', endpoint);
                const res = await fetch(endpoint, { signal });

                if (!res.ok) {
                    const errorText = await res.text().catch(() => 'Sin detalles');
                    console.error(`Error HTTP ${res.status}:`, errorText);
                    throw new Error(`Error ${res.status}: No se pudieron cargar los productos`);
                }

                const json = await res.json();
                console.log('Respuesta de la API:', json);

                if (!json || !json.success) {
                    throw new Error('Respuesta inválida de la API');
                }

                const rawData = json.data;

                if (productId) {
                    // Carga de un solo producto
                    const item = Array.isArray(rawData) ? rawData[0] : rawData;
                    console.log(' Producto individual cargado:', item);
                    setProducts(item ? [normalizeProduct(item)] : []);
                } else {
                    // Carga de una lista (todos o búsqueda)
                    const list = Array.isArray(rawData) ? rawData.map(normalizeProduct) : [];
                    console.log(' Lista de productos cargada:', list.length, 'elementos');
                    setProducts(list);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error(' Error en fetch:', err);
                    console.error(' Endpoint intentado:', endpoint);
                    setError(err.message || 'Error cargando productos');

                    // Forzar un estado de no carga incluso en error
                    setLoading(false);
                    setProducts([]);
                }
            } finally {
                setLoading(false);
                console.log(' Carga completada');
            }
        };

        fetchData();

        return () => {
            console.log(' Limpiando fetch anterior');
            abortCtrl.abort();
        };

    }, [location.pathname, location.search, productId, isSearchRoute, isProductsRoute, searchQuery]);

    return (
        <div className="principal">
            <div className="home-container">
                <header className="home-header">
                    <div className="home-header-container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <h1 className="home-logo">NextLevelPc</h1>
                            <nav className="home-nav">
                                <Link to="/products" className="home-nav-link">Productos</Link>
                                <Link to="/repuestos" className="home-nav-link">Repuestos</Link>
                                <Link to="/accesorios" className="home-nav-link">Accesorios</Link>
                                <Link to="/servicios" className="home-nav-link">Servicios</Link>
                            </nav>
                        </div>

                        {/* Barra de búsqueda */}
                        <form className="header-search-form" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                className="header-search-input"
                                placeholder="Buscar productos..."
                                value={localSearchQuery}
                                onChange={(e) => setLocalSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="header-search-btn" aria-label="Buscar">
                                <IconSearch />
                            </button>
                        </form>

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
                                                    <li key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                                        <img src={item.image} alt={item.title} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: 14, color: '#000' }}>{item.title}</div>
                                                            <div style={{ fontSize: 13, color: '#646262ff' }}>${(item.price * item.quantity).toFixed(2)} ({item.quantity})</div>
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

                <main className="home-main">
                    {(isProductsRoute || isSearchRoute || productId) ? (
                        <>
                            <h2 className="home-title">{getTitle()}</h2>

                            {loading && <p>Cargando productos...</p>}
                            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                            {!loading && !error && products.length === 0 && (
                                <p>
                                    {isSearchRoute
                                        ? 'No se encontraron productos para tu búsqueda.'
                                        : 'No hay productos para mostrar.'
                                    }
                                </p>
                            )}

                            <div className="home-products-grid">
                                {products.map(product => (
                                    <div key={product.id} className="home-product-card">
                                        <img src={product.image} alt={product.nombre || 'Producto'} className="home-product-image" />
                                        <div className="home-product-content">
                                            <h3 style={{ color: '#000' }}>{product.nombre}</h3>
                                            <p style={{ color: '#000' }}>${Number(product.price).toFixed(2)}</p>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="home-add-cart-button" onClick={() => addToCart(product)} aria-label={`Añadir ${product.nombre} al carrito`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginRight: 6 }}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
                                                    </svg>
                                                    Añadir
                                                </button>
                                                <button onClick={() => { addToCart(product); addToCart(product); }} title="Añadir 2" style={{ padding: '8px 10px' }}>+2</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="home-title">{getTitle()}</h2>
                            <div className="home-products-grid">
                                <p>Contenido de {getTitle()} no disponible. Ve a <Link to="/productos">Productos</Link> para ver el catálogo.</p>
                            </div>
                        </>
                    )}
                </main>

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

export default Productos;