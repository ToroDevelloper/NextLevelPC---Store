import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/Productos.css";

const API_BASE = 'http://localhost:8080';

const Productos = () => {
    const location = useLocation();
    const navigate = useNavigate();

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
        } else if (raw.imagenes === null && raw.url_imagen) {
            imagenes = [{ url: raw.url_imagen, es_principal: raw.es_principal === 1 }];
        }

        // imagen por defecto
        const DEFAULT_IMAGE = '/default-product.png';

        let firstImg = DEFAULT_IMAGE;
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
        <div className="products-grid">
            {products.map(product => (
                <div
                    key={product.id}
                    className="product-card"
                    onClick={() => navigate(`/productos/${product.id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src={product.image || 'https://placehold.co/600x400/EEE/31343C?text=Producto'}
                        alt={product.nombre || 'Producto'}
                        className="product-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Producto';
                        }}
                    />

                    <div className="product-content">
                        <h3 className="product-name">{product.nombre}</h3>
                        <p className="product-price">${Number(product.price).toFixed(2)}</p>
                        <p className="product-stock">Stock: {product.stock}</p>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderProductDetail = () => {
        const product = products[0];
        if (!product) return null;

        return (
            <div className="product-detail">
                <div className="product-detail-main">
                    <div className="product-detail-image-wrapper">
                        <img
                            src={product.image || 'https://placehold.co/600x400/EEE/31343C?text=Producto'}
                            alt={product.nombre || 'Producto'}
                            className="product-detail-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Producto';
                            }}
                        />
                    </div>
                    <div className="product-detail-info">
                        <h1 className="product-detail-name">{product.nombre}</h1>
                        <p className="product-detail-price">${Number(product.price).toFixed(2)}</p>
                        <p className="product-detail-stock">Stock: {product.stock}</p>
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
