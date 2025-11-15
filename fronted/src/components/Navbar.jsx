import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { useCart } from '../utils/CartContext';
import { useAuth } from '../utils/AuthContext';

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

const Navbar = ({ onLoginClick }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
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

  const handleUserClick = () => {
    if (user) {
      navigate('/perfil');
    } else {
      onLoginClick();
    }
  };

  const cartCount = cartItems.reduce((s, i) => s + (i.quantity || 0), 0);
  const cartTotal = cartItems.reduce((s, i) => {
    const unitPrice = Number(i.price ?? i.precio ?? 0);
    const qty = Number(i.quantity ?? 0);
    return s + unitPrice * qty;
  }, 0);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/home" className="navbar-logo">
          <img src="/logo.png" alt="NextLevelPC" className="navbar-logo-img" />
        </Link>

        {/* Navegación */}
        <nav className="navbar-nav">
          {/* Navegación de tienda solo para clientes o usuarios sin rol aún */}
          {(!user || user.rol === 'cliente') && (
            <>
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
                to="/servicios"
                className={`navbar-nav-link ${isActive('/servicios') ? 'active' : ''}`}
              >
                Servicios
              </Link>
            </>
          )}

          {/* Navegación de vistas y dashboard solo para admin / empleado */}
          {(user?.rol === 'admin' || user?.rol === 'empleado') && (
            <>
              <a
                href="http://localhost:8080/productos"
                className="navbar-nav-link"
                target="_blank"
                rel="noreferrer"
              >
                Vista Productos
              </a>
              <a
                href="http://localhost:8080/ordenes"
                className="navbar-nav-link"
                target="_blank"
                rel="noreferrer"
              >
                Vista Órdenes
              </a>
              <Link
                to="/dashboard"
                className={`navbar-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
            </>
          )}
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
          {/* Contenedor del Perfil de Usuario */}
          <div className="navbar-profile-container">
            <button
              className="navbar-icon-btn"
              aria-label="Perfil de usuario"
              onClick={handleUserClick}
            >
              <IconUser />
            </button>
          </div>

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
                      {cartItems.map(item => {
                        const unitPrice = Number(item.price ?? item.precio ?? 0);
                        const lineTotal = unitPrice * (item.quantity ?? 0);

                        const imgSrc = item.image || item.imagen_url || 'https://placehold.co/600x400/EEE/31343C?text=Item';

                        return (
                          <li key={`${item.type}-${item.id}`} className="navbar-cart-item">
                            <img
                              src={imgSrc}
                              alt={item.nombre || 'Item del carrito'}
                              className="navbar-cart-image"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Item';
                              }}
                            />
                            <div className="navbar-cart-info">
                              <div className="navbar-cart-title">{item.nombre}</div>
                              <div className="navbar-cart-price">
                                ${lineTotal.toFixed(2)} (x{item.quantity})
                              </div>
                            </div>
                            <div className="navbar-cart-controls">
                              <button onClick={() => updateQuantity(item.id, item.type, (item.quantity || 0) + 1)} aria-label="Aumentar">+</button>
                              <button onClick={() => updateQuantity(item.id, item.type, (item.quantity || 0) - 1)} aria-label="Disminuir">−</button>
                              <button onClick={() => removeFromCart(item.id, item.type)} aria-label="Eliminar" className="btn-remove">x</button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="navbar-cart-total">
                      <strong>Total:</strong>
                      <strong>${cartTotal.toFixed(2)}</strong>
                    </div>
                    <div className="navbar-cart-actions">
                      <button className="btn-checkout" onClick={() => setCartOpen(false)}>
                        Checkout
                      </button>
                      <button className="btn-clear-cart" onClick={clearCart}>
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