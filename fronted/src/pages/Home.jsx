import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Productos.css';
import { useCart } from '../utils/CartContext';

const API_BASE = 'http://localhost:8080';

const Home = () => {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [productosRecomendados, setProductosRecomendados] = useState([]);
    const [servicios, setServicios] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const trackRef = useRef(null);
    const containerRef = useRef(null);
    const [slideWidth, setSlideWidth] = useState(0);
    const [visibleItems, setVisibleItems] = useState(3);
    const totalItems = productosDestacados.length;
    
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const calculateMetrics = () => {
            if (trackRef.current && trackRef.current.children.length > 0) {
                const track = trackRef.current;
                const firstItem = track.children[0];
                const trackStyle = window.getComputedStyle(track);
                const itemWidth = firstItem.offsetWidth;
                const itemGap = parseFloat(trackStyle.gap) || 0;

                setSlideWidth(itemWidth + itemGap);

                if (containerRef.current) {
                    const containerWidth = containerRef.current.offsetWidth;
                    const newVisibleItems = Math.floor(containerWidth / (itemWidth + itemGap));
                    setVisibleItems(Math.max(1, newVisibleItems));
                }
            }
        };

        calculateMetrics();
        window.addEventListener('resize', calculateMetrics);
        return () => window.removeEventListener('resize', calculateMetrics);
    }, [productosDestacados, loading]);

    useEffect(() => {
        if (trackRef.current && slideWidth > 0) {
            const offset = -currentIndex * slideWidth;
            trackRef.current.style.transform = `translateX(${offset}px)`;
        }
    }, [currentIndex, slideWidth]);

    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => (prev >= totalItems - visibleItems ? 0 : prev + 1));
    }, [totalItems, visibleItems]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(prev => (prev <= 0 ? Math.max(0, totalItems - visibleItems) : prev - 1));
    }, [totalItems, visibleItems]);

    const goToSlide = (index) => {
        setCurrentIndex(Math.max(0, Math.min(index, totalItems - visibleItems)));
    };

    useEffect(() => {
        if (!isAutoPlaying || totalItems <= visibleItems) return;
        const autoPlay = setInterval(nextSlide, 4000);
        return () => clearInterval(autoPlay);
    }, [nextSlide, totalItems, visibleItems, isAutoPlaying]);

    const handleInteraction = () => {
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                
                const [destacadosRes, recomendadosRes, serviciosRes] = await Promise.all([
                    fetch(`${API_BASE}/api/productos/destacados?limite=6`),
                    fetch(`${API_BASE}/api/productos/con-imagenes?limite=4`),
                    fetch(`${API_BASE}/api/servicios`)
                ]);

                const destacadosData = await destacadosRes.json();
                const recomendadosData = await recomendadosRes.json();
                const serviciosData = await serviciosRes.json();

                if (destacadosData.success) setProductosDestacados(destacadosData.data);
                if (recomendadosData.success) setProductosRecomendados(recomendadosData.data.slice(0, 4));
                
                const servArray = serviciosData.success ? serviciosData.data : serviciosData;
                if (Array.isArray(servArray)) setServicios(servArray.slice(0, 3));

            } catch (err) {
                console.error('Error cargando datos del Home:', err);
                setError('Hubo un problema al cargar el contenido. Por favor, recarga la página.');
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const formatPrice = (price) => {
        const number = Number(price);
        return isNaN(number) ? 'N/A' : new Intl.NumberFormat('es-ES').format(number);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart({
            id: product.id,
            nombre: product.nombre,
            price: Number(product.precio_actual || product.precio),
            stock: product.stock,
            image: product.imagen_principal || product.image,
            type: 'producto',
            quantity: 1,
        });
    };

    if (loading) return <div className="loading-message">Cargando tu experiencia NextLevel...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="home-page">
            <div className="featured-title-banner">
                <h2>Lo mas vendido:</h2>
            </div>

            {productosDestacados.length > 0 ? (
                <>
                    <div
                        className="scroll-wrapper"
                        ref={containerRef}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <div
                            className="home-products-scroll-container"
                            ref={trackRef}
                        >
                            {productosDestacados.map(product => (
                                <div
                                    key={`dest-${product.id}`}
                                    className="home-product-card"
                                    onClick={() => navigate(`/productos/${product.id}`)}
                                >
                                    <div className="product-image-container">
                                        <img
                                            src={product.imagen_principal || 'https://placehold.co/600x400/EEE/31343C?text=Producto'}
                                            alt={product.nombre}
                                            className="home-product-image"
                                            onError={(e) => { e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Producto'; }}
                                        />
                                    </div>
                                    <div className="home-product-content">
                                        <h3>{product.nombre}</h3>
                                        <p className="product-stock">Stock: {product.stock} unds.</p>
                                        <p className="product-price">${formatPrice(product.precio_actual)}</p>
                                        <button
                                            className="producto-add-btn"
                                            type="button"
                                            onClick={(e) => handleAddToCart(e, product)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
                                            </svg>
                                            Añadir al carrito
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalItems > visibleItems && (
                            <>
                                <button
                                    className="carousel-btn prev"
                                    onClick={() => { prevSlide(); handleInteraction(); }}
                                    aria-label="Producto anterior"
                                    disabled={currentIndex === 0}
                                >
                                    &#10094;
                                </button>
                                <button
                                    className="carousel-btn next"
                                    onClick={() => { nextSlide(); handleInteraction(); }}
                                    aria-label="Producto siguiente"
                                    disabled={currentIndex >= totalItems - visibleItems}
                                >
                                    &#10095;
                                </button>
                            </>
                        )}
                    </div>

                    {totalItems > visibleItems && (
                        <div className="carousel-indicators">
                            {Array.from({ length: Math.ceil(totalItems / visibleItems) }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`carousel-indicator ${Math.floor(currentIndex / visibleItems) === index ? 'active' : ''}`}
                                    onClick={() => { goToSlide(index * visibleItems); handleInteraction(); }}
                                    aria-label={`Ir a slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="view-all-container">
                        <Link to="/productos" className="btn-view-all">
                            Ver Todos los Productos →
                        </Link>
                    </div>
                </>
            ) : (
                <div className="error-message">No hay productos destacados disponibles</div>
            )}

            {productosRecomendados.length > 0 && (
                <section className="home-section background-soft">
                    <div className="section-header">
                        <h2>⭐ Recomendados para ti</h2>
                    </div>
                    <div className="recommended-grid">
                        {productosRecomendados.map(product => (
                            <div
                                key={`rec-${product.id}`}
                                className="home-product-card"
                                onClick={() => navigate(`/productos/${product.id}`)}
                            >
                                <div className="product-image-container">
                                    <img
                                        src={product.image || product.imagen_principal || 'https://placehold.co/600x400/EEE/31343C?text=Recomendado'}
                                        alt={product.nombre}
                                        className="home-product-image"
                                        onError={(e) => { e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Producto'; }}
                                    />
                                </div>
                                <div className="home-product-content">
                                    <h3>{product.nombre}</h3>
                                    <p className="product-price">${formatPrice(product.precio_actual || product.precio)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {servicios.length > 0 && (
                <section className="home-section">
                    <div className="section-header">
                        <h2>🛠️ Nuestros Servicios</h2>
                        <Link to="/servicios" className="link-view-more">Ver catálogo de servicios →</Link>
                    </div>
                    <div className="services-preview-grid">
                        {servicios.map(servicio => (
                            <div
                                key={`serv-${servicio.id}`}
                                className="service-preview-card"
                                onClick={() => navigate(`/servicios/${servicio.id}`)}
                            >
                                <div className="service-preview-image">
                                    <img
                                        src={servicio.imagen_url || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=600&fit=crop'}
                                        alt={servicio.nombre}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop'; }}
                                    />
                                </div>
                                <div className="service-preview-info">
                                    <h3>{servicio.nombre}</h3>
                                    <p className="service-price">Desde ${Number(servicio.precio).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;