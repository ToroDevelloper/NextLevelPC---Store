import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="home-header-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <h1 className="home-logo">NextLevelPc</h1>
                        <nav className="home-nav">
                            <Link to="/productos" className="home-nav-link">Productos</Link>
                            <Link to="/repuestos" className="home-nav-link">Repuestos</Link>
                            <Link to="/accesorios" className="home-nav-link">Accesorios</Link>
                            <Link to="/servicios" className="home-nav-link">Servicios</Link>
                        </nav>
                    </div>
                    <div className="home-user-section">
                        <span className="home-user-name">Usuario</span>
                        <button className="home-cart-button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c2.667 0 5.297.667 7.335 1.85 2.038 1.183 3.54 2.86 4.25 4.806A23.737 23.737 0 0121 19.5a23.737 23.737 0 01-5.38 10.05C13.64 29.5 10.8 30 8 30H4.5A4.5 4.5 0 010 25.5v-12A4.5 4.5 0 014.5 9zm15.5 10a4.5 4.5 0 01-4.5 4.5h-4.5a4.5 4.5 0 01-4.5-4.5V9a4.5 4.5 0 014.5-4.5h4.5a4.5 4.5 0 014.5 4.5v10z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="home-main">
                <h2 className="home-title">Productos Destacados</h2>
                <div className="home-products-grid">
                    {/* Producto 1: Teclado */}
                    <div className="home-product-card">
                        <img
                            src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=400&fit=crop"
                            alt="Teclado mecánico RGB para gaming"
                            className="home-product-image home-product-keyboard"
                        />
                        <div className="home-product-content">
                            <button className="home-add-cart-button">Add To Cart</button>
                        </div>
                    </div>

                    {/* Producto 2: Mouse */}
                    <div className="home-product-card">
                        <img
                            src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop"
                            alt="Mouse gamer ergonómico"
                            className="home-product-image home-product-mouse"
                        />
                        <div className="home-product-content">
                            <button className="home-add-cart-button">Add To Cart</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="home-footer">
                <div className="home-footer-container">
                    <h3 className="home-footer-title">Soporte</h3>
                    <p className="home-footer-email">NextLevelPC@gmail.com</p>
                    <p className="home-footer-copyright">© {new Date().getFullYear()} NextLevelPc. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
