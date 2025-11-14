import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const API_BASE = 'http://localhost:8080';

// Íconos SVG
const IconCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" />
  </svg>
);

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Navbar = ({ onLoginClick, cartItems = [], onCartUpdate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/productos/buscar?q=${encodeURIComponent(query)}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => {
    if (path === '/home') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  };

  const removeFromCart = (productId) => {
    if (onCartUpdate) {
      onCartUpdate(prev => prev.filter(p => p.id !== productId));
    }
  };

  const changeQuantity = (productId, delta) => {
    if (onCartUpdate) {
      onCartUpdate(prev =>
        prev
          .map(p => p.id === productId ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)
          .filter(p => p.quantity > 0)
      );
    }
  };

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/home" className="navbar-logo">
          <img src="/logo.png" alt="NextLevelPC" className="navbar-logo-img" />
        </Link>

        {/* Navegación */}
        <nav className="navbar-nav">
          <Link 
            to="/home" 
            className={`navbar-nav-link ${isActive('/home') ? 'active' : ''}`}
          >
            Inicio
          </Link>
          <Link 
            to="/productos" 
            className={`navbar-nav-link ${isActive('/productos') ? 'active' : ''}`}
          >
            Productos
          </Link>
          <Link 
            to="/repuestos" 
            className={`navbar-nav-link ${isActive('/repuestos') ? 'active' : ''}`}
          >
            Repuestos
          </Link>
          <Link 
            to="/accesorios" 
            className={`navbar-nav-link ${isActive('/accesorios') ? 'active' : ''}`}
          >
            Accesorios
          </Link>
          <Link 
            to="/servicios" 
            className={`navbar-nav-link ${isActive('/servicios') ? 'active' : ''}`}
          >
            Servicios
          </Link>
        </nav>

        {/* Búsqueda */}
        <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn" aria-label="Buscar">
            <IconSearch />
          </button>
        </form>

        {/* Usuario y Carrito */}
        <div className="navbar-actions">
          <button 
            className="navbar-icon-btn" 
            aria-label="Perfil de usuario"
            onClick={onLoginClick}
          >
            <IconUser />
          </button>
          
          <div className="navbar-cart-container">
            <button
              className="navbar-icon-btn cart-btn"
              aria-label="Carrito"
              onClick={() => setCartOpen(o => !o)}
            >
              <IconCart />
              {cartCount > 0 && (
                <span className="navbar-cart-badge">{cartCount}</span>
              )}
            </button>

            {/* Dropdown del carrito */}
            {cartOpen && (
              <div className="navbar-cart-dropdown">
                <h4>Carrito</h4>
                {cartItems.length === 0 ? (
                  <p>Tu carrito está vacío</p>
                ) : (
                  <>
                    <ul className="navbar-cart-list">
                      {cartItems.map(item => (
                        <li key={item.id} className="navbar-cart-item">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="navbar-cart-image"
                          />
                          <div className="navbar-cart-info">
                            <div className="navbar-cart-title">{item.title}</div>
                            <div className="navbar-cart-price">
                              ${(item.price * item.quantity).toFixed(2)} (x{item.quantity})
                            </div>
                          </div>
                          <div className="navbar-cart-controls">
                            <button onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar">+</button>
                            <button onClick={() => changeQuantity(item.id, -1)} aria-label="Disminuir">−</button>
                            <button onClick={() => removeFromCart(item.id)} aria-label="Eliminar" className="btn-remove">x</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="navbar-cart-total">
                      <strong>Total:</strong>
                      <strong>${cartTotal.toFixed(2)}</strong>
                    </div>
                    <div className="navbar-cart-actions">
                      <button className="btn-checkout" onClick={() => setCartOpen(false)}>
                        Checkout
                      </button>
                      <button className="btn-clear-cart" onClick={() => onCartUpdate && onCartUpdate([])}>
                        Vaciar
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;