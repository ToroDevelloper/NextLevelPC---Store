import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../utils/CartContext';
import "../styles/Productos.css";

const API_BASE = 'http://localhost:8080';

const Productos = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    // pestaña activa en detalle: 'descripcion' o 'especificaciones'
    const [activeTab, setActiveTab] = useState('descripcion');

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');

    const isProductsRoute = location.pathname === '/productos';
    const isSearchRoute = location.pathname === '/productos/buscar';
    const isProductDetailRoute = /^\/productos\/[^/]+\/?$/.test(location.pathname) && !isSearchRoute;

    let productId = null;
    if (isProductDetailRoute) {
        const match = location.pathname.match(/^\/productos\/([^/]+)\/?$/);
        productId = match ? match[1] : null;
    }

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        } else if (raw.imagenes === null && (raw.url_imagen || raw.url)) {
            // compatibilidad con distintos nombres de campo en joins
            const url = raw.url_imagen || raw.url;
            imagenes = [{ url, es_principal: raw.es_principal === 1 }];
        }

        const DEFAULT_IMAGE = 'https://placehold.co/600x400/EEE/31343C?text=Producto';

        let firstImg = DEFAULT_IMAGE;
        if (raw.imagen_principal) {
            firstImg = raw.imagen_principal;
        } else if (Array.isArray(imagenes) && imagenes.length > 0) {
            const primera = imagenes[0];
            firstImg = typeof primera === 'string' ? primera : (primera.url || DEFAULT_IMAGE);
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

    const getTitle = () => {
        if (productId) return 'Detalle del Producto';
        if (isSearchRoute) return `Resultados para: "${searchQuery}"`;
        if (isProductsRoute) return 'Todos los Productos';
        const pageName = location.pathname.replace('/', '');
        return pageName.charAt(0).toUpperCase() + pageName.slice(1);
    };

    useEffect(() => {
        console.log('Iniciando carga de datos...');

        let endpoint = '';
        if (productId) {
            endpoint = `${API_BASE}/api/productos/${encodeURIComponent(productId)}`;
            console.log('Cargando producto individual:', endpoint);
        } else if (isSearchRoute && searchQuery) {
            endpoint = `${API_BASE}/api/productos/buscar?q=${encodeURIComponent(searchQuery)}`;
            console.log('Cargando resultados de búsqueda:', endpoint);
        } else if (isProductsRoute) {
            endpoint = `${API_BASE}/api/productos/con-imagenes`;
            console.log('Cargando todos los productos:', endpoint);
        } else if (isSearchRoute && !searchQuery) {
            console.log('Ruta de búsqueda sin término, limpiando productos');
            setLoading(false);
            setProducts([]);
            setError(null);
            return;
        } else {
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
                    const item = Array.isArray(rawData) ? rawData[0] : rawData;
                    console.log(' Producto individual cargado:', item);
                    setProducts(item ? [normalizeProduct(item)] : []);
                } else {
                    const list = Array.isArray(rawData) ? rawData.map(normalizeProduct) : [];
                    console.log(' Lista de productos cargada:', list.length, 'elementos');
                    setProducts(list);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error(' Error en fetch:', err);
                    console.error(' Endpoint intentado:', endpoint);
                    setError(err.message || 'Error cargando productos');
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

    const renderProductList = () => (
        <div className="products-grid servicios-grid">
            {products.map(product => (
                <div
                    key={product.id}
                    className="servicio-card-link"
                    onClick={() => navigate(`/productos/${product.id}`)}
                >
                    <div className="servicio-card">
                        <img
                            src={product.image || 'https://placehold.co/600x400/EEE/31343C?text=Producto'}
                            alt={product.nombre || 'Producto'}
                            className="servicio-card-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Producto';
                            }}
                        />
                        <div className="servicio-info">
                            <h3>{product.nombre}</h3>
                            <p className="servicio-descripcion">
                                {product.raw?.descripcion_corta || product.raw?.descripcion || 'Producto disponible en NextLevelPC.'}
                            </p>
                            <p className="servicio-precio">
                                ${Number(product.price).toFixed(2)}
                            </p>
                            <button
                                className="servicio-add-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addToCart({
                                        id: product.id,
                                        nombre: product.nombre,
                                        price: product.price,
                                        stock: product.stock,
                                        image: product.image,
                                        type: 'producto',
                                        quantity: 1,
                                    });
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
                                </svg>
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderProductDetail = () => {
        const product = products[0];
        if (!product) return null;

        const { nombre, price, stock, image, raw } = product;
        const descripcion = raw.descripcion_detallada || raw.descripcion || 'Sin descripción disponible.';

        let specs = [];
        if (raw.especificaciones) {
            try {
                const parsed = JSON.parse(raw.especificaciones);
                if (Array.isArray(parsed)) {
                    specs = parsed;
                }
            } catch (e) {
                console.warn('No se pudo parsear `especificaciones` como JSON, se usará layout por defecto.', e);
            }
        }

        if (specs.length === 0) {
            specs = [
                { label: 'Categoría', value: raw.categoria_nombre || raw.categoria || 'No especificada' },
                { label: 'Stock', value: `${stock} unidades` },
                { label: 'Estado', value: raw.activo === 0 ? 'No disponible' : 'Disponible' }
            ];
        }

        const handleAddToCart = () => {
            const qty = Number(document.getElementById('product-detail-qty')?.value || 1);
            const safeQty = isNaN(qty) || qty <= 0 ? 1 : qty;

            addToCart({
                id: product.id,
                nombre,
                price,
                stock,
                image,
                type: 'producto',
                quantity: safeQty,
            });
        };

        return (
            <div className="product-detail">
                <div className="product-detail-main">
                    {/* Columna izquierda: imagen grande */}
                    <div className="product-detail-image-wrapper">
                        <img
                            src={image || 'https://placehold.co/600x400/EEE/31343C?text=Producto'}
                            alt={nombre || 'Producto'}
                            className="product-detail-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Producto';
                            }}
                        />
                    </div>

                    {/* Columna derecha: info principal */}
                    <div className="product-detail-info">
                        <h1 className="product-detail-name">{nombre}</h1>
                        <div className="product-detail-price-box">
                            <span className="product-detail-price">${price.toFixed(2)}</span>
                        </div>
                        <p className="product-detail-stock">
                            Stock: {stock > 0 ? `${stock} unidades disponibles` : 'Sin stock'}
                        </p>

                        {/* Cantidad + botón de carrito, encima de Envío/Devolución */}
                        <div className="product-detail-actions">
                            <input
                                id="product-detail-qty"
                                type="number"
                                min="1"
                                defaultValue="1"
                                className="product-detail-quantity"
                            />
                            <button
                                className="product-detail-buy-btn"
                                type="button"
                                onClick={handleAddToCart}
                            >
                                Añadir al carrito
                            </button>
                        </div>

                        {/* Envío y devolución debajo del botón */}
                        <div className="product-detail-extra">
                            <p>Envío: {raw.envioDescripcion || 'Envío estándar disponible.'}</p>
                            <p>Devolución: {raw.politicaDevolucion || 'Devoluciones dentro de 30 días.'}</p>
                        </div>
                    </div>
                </div>

                {/* Sección inferior: descripción y especificaciones */}
                <div className="product-detail-tabs">
                    <div className="product-detail-tab-headers">
                        <button
                            className={`tab-header ${activeTab === 'descripcion' ? 'active' : ''}`}
                            type="button"
                            onClick={() => setActiveTab('descripcion')}
                        >
                            Descripción
                        </button>
                        <button
                            className={`tab-header ${activeTab === 'especificaciones' ? 'active' : ''}`}
                            type="button"
                            onClick={() => setActiveTab('especificaciones')}
                        >
                            Especificaciones
                        </button>
                    </div>
                    <div className="product-detail-tab-body">
                        <div className={`tab-panel ${activeTab === 'descripcion' ? 'active' : ''}`}>
                            <p className="product-detail-description">{descripcion}</p>
                        </div>
                        <div className={`tab-panel ${activeTab === 'especificaciones' ? 'active' : ''}`}>
                            <table className="product-specs-table">
                                <tbody>
                                    {specs.map(spec => (
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
            </div>
        );
    };

    return (
        <div className="productos-page">
            <h2 className="productos-title">{getTitle()}</h2>

            {loading && <p className="loading-message">Cargando productos...</p>}
            {error && (
                <div className="error-message">
                    Error al cargar productos -- {error}
                </div>
            )}

            {!loading && !error && products.length === 0 && (
                <div className="error-message">
                    {isSearchRoute
                        ? 'No se encontraron productos para tu búsqueda.'
                        : 'No hay productos para mostrar.'
                    }
                </div>
            )}

            {!loading && !error && products.length > 0 && (
                productId ? renderProductDetail() : renderProductList()
            )}
        </div>
    );
};

export default Productos;
