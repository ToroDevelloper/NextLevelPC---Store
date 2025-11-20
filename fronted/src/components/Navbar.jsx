import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { useCart } from '../utils/CartContext';
import { useAuth } from '../utils/AuthContext';

// --- Constante para la API ---
const API_BASE = 'http://localhost:8080';

// Íconos SVG (MANTENIDOS EXACTAMENTE IGUAL)
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

const IconFilter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filter" viewBox="0 0 16 16">
    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
  </svg>
);

// --- NUEVO: Iconos para el menú móvil ---
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Navbar = ({ onLoginClick }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth(); // ✅ AÑADIDO: isAuthenticated y logout
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  // --- Estado y Refs para el dropdown de categorías ---
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryButtonRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // --- NUEVO: Estado para menú móvil ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartDropdownRef = useRef(null);

  // --- useEffect para cargar categorías ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/categorias/producto`);
        if (!response.ok) {
          // Si falla la conexión, usamos datos de mock
          setCategories([
            { id: '1', nombre: 'Hardware' },
            { id: '2', nombre: 'Periféricos' },
            { id: '3', nombre: 'Software' },
          ]);
          return;
        }
        const data = await response.json();
        
        const cats = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : []);
        setCategories(cats.filter(cat => cat.id && cat.nombre));
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([
          { id: '1', nombre: 'Hardware' },
          { id: '2', nombre: 'Periféricos' },
          { id: '3', nombre: 'Software' },
        ]);
      }
    };
    fetchCategories();
  }, []);

  // --- NUEVO: Manejo del clic fuera para cerrar dropdowns ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 1. Carrito
      if (cartOpen && cartDropdownRef.current && !cartDropdownRef.current.contains(event.target) && !event.target.closest('.cart-btn')) {
        setCartOpen(false);
      }

      // 2. Categorías
      if (isCategoryDropdownOpen && categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target) && categoryButtonRef.current && !categoryButtonRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartOpen, isCategoryDropdownOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/productos/buscar?q=${encodeURIComponent(query)}`);
      setSearchQuery('');
    }
    setIsMobileMenuOpen(false); // ✅ AÑADIDO: Cierra menú móvil después de buscar
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
      onLoginClick(null); 
    }
    setIsMobileMenuOpen(false); // ✅ AÑADIDO: Cierra menú móvil
  };

  // --- NUEVO: Handler para navegación móvil ---
  const handleNavLinkClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const cartCount = cartItems.reduce((s, i) => s + (i.quantity || 0), 0);
  const cartTotal = cartItems.reduce((s, i) => {
    const unitPrice = Number(i.price ?? i.precio ?? 0);
    const qty = Number(i.quantity ?? 0);
    return s + unitPrice * qty;
  }, 0);

  // --- NUEVO: Función para formatear moneda ---
  const formatCurrency = (amount) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);

  // Handlers para el dropdown de categorías
  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(prev => !prev);
  };

  const handleCategoryClick = (categoryId) => {
    if (categoryId === '0') {
      navigate('/productos');
    } else {
      navigate(`/productos?categoria_id=${categoryId}`);
    }
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false); // ✅ AÑADIDO: Cierra menú móvil
  };

  // --- NUEVO: Handler para checkout con autenticación ---
const handleCheckout = () => {
    console.log('🛒 Iniciando checkout...');
    console.log('🔐 Usuario autenticado:', isAuthenticated);
    
    if (!isAuthenticated) {
        console.log('🔓 Usuario no autenticado, abriendo modal...');
        onLoginClick('/checkout');
        setCartOpen(false);
    } else {
        console.log('✅ Usuario autenticado, redirigiendo a checkout...');
        setCartOpen(false);
        navigate('/checkout');
    }
};

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/home" className="navbar-logo">
          <img 
            src="https://placehold.co/200x50/1F2937/FFFFFF?text=NextLevelPC" 
            alt="NextLevelPC" 
            className="navbar-logo-img" 
          />
        </Link>

        {/* Navegación Desktop */}
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

          {/* Navegación de vistas sólo para admin / empleado */}
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
            </>
          )}
        </nav>

        {/* Búsqueda y Categorías Desktop */}
        <div className="navbar-search-category-container">
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

          {/* Botón de Categorías */}
          <div className="category-dropdown-container">
            <button 
              ref={categoryButtonRef}
              className="navbar-category-btn"
              onClick={toggleCategoryDropdown}
              aria-label="Filtrar por categoría"
            >
              <IconFilter />
              <span className="category-btn-text">Categorías</span>
            </button>
            
            {isCategoryDropdownOpen && (
              <ul 
                ref={categoryDropdownRef}
                className="category-dropdown-menu"
              >
                <li onClick={() => handleCategoryClick('0')}>
                  Todas las categorías
                </li>
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <li key={cat.id} onClick={() => handleCategoryClick(cat.id)}>
                      {cat.nombre}
                    </li>
                  ))
                ) : (
                  <li className="category-dropdown-loading">Cargando...</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Usuario y Carrito */}
        <div className="navbar-actions">
          {/* Contenedor del Perfil de Usuario */}
          <div className="navbar-profile-container">
            {isAuthenticated}
            <button
              className="navbar-icon-btn"
              aria-label="Perfil de usuario"
              onClick={handleUserClick}
            >
              <IconUser />
            </button>
          </div>

          {/* Carrito */}
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
              <div className="navbar-cart-dropdown" ref={cartDropdownRef}>
                <h4>Carrito ({cartCount} items)</h4>
                {cartItems.length === 0 ? (
                  <p>Tu carrito está vacío</p>
                ) : (
                  <>
                    <ul className="navbar-cart-list">
                      {cartItems.map(item => {
                        const unitPrice = Number(item.price ?? item.precio ?? 0);
                        const lineTotal = unitPrice * (item.quantity ?? 0);
                        const imgSrc = item.image || item.imagen_url || 'https://placehold.co/100x100/EEE/31343C?text=Item';

                        return (
                          <li key={`${item.type}-${item.id}`} className="navbar-cart-item">
                            <img
                              src={imgSrc}
                              alt={item.nombre || 'Item del carrito'}
                              className="navbar-cart-image"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/100x100/EEE/31343C?text=Item';
                              }}
                            />
                            <div className="navbar-cart-info">
                              <div className="navbar-cart-title">{item.nombre}</div>
                              <div className="navbar-cart-price">
                                {formatCurrency(lineTotal)} (x{item.quantity})
                              </div>
                            </div>
                            <div className="navbar-cart-controls">
                              <button onClick={() => updateQuantity(item.id, item.type, (item.quantity || 0) - 1)} aria-label="Disminuir">−</button>
                              <button onClick={() => updateQuantity(item.id, item.type, (item.quantity || 0) + 1)} aria-label="Aumentar">+</button>
                              <button onClick={() => removeFromCart(item.id, item.type)} aria-label="Eliminar" className="btn-remove">
                                <IconClose />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="navbar-cart-total">
                      <strong>Total:</strong>
                      <strong>{formatCurrency(cartTotal)}</strong>
                    </div>
                    <div className="navbar-cart-actions">
                      {/* ✅ MODIFICADO: Ahora usa handleCheckout con autenticación */}
                      <button className="btn-checkout" onClick={handleCheckout}>
                        Proceder al Pago
                      </button>
                      <button className="btn-clear-cart" onClick={clearCart}>
                        Vaciar Carrito
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ✅ NUEVO: Botón de Menú Móvil */}
          <button 
            className="navbar-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(o => !o)}
            aria-label="Menú principal"
          >
            {isMobileMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* ✅ NUEVO: Menú Móvil */}
      <nav className={`navbar-mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-nav-content">
          {/* Búsqueda Móvil */}
          <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="mobile-search-input"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="mobile-search-btn" aria-label="Buscar">
              <IconSearch />
            </button>
          </form>

          {/* Navegación Móvil */}
          <div className="mobile-nav-links">
            {(!user || user.rol === 'cliente') && (
              <>
                <Link
                  to="/home"
                  className={`mobile-nav-link ${isActive('/home') ? 'active' : ''}`}
                  onClick={() => handleNavLinkClick('/home')}
                >
                  Inicio
                </Link>
                <Link
                  to="/productos"
                  className={`mobile-nav-link ${isActive('/productos') ? 'active' : ''}`}
                  onClick={() => handleNavLinkClick('/productos')}
                >
                  Productos
                </Link>
                <Link
                  to="/servicios"
                  className={`mobile-nav-link ${isActive('/servicios') ? 'active' : ''}`}
                  onClick={() => handleNavLinkClick('/servicios')}
                >
                  Servicios
                </Link>
              </>
            )}

            {/* Categorías Móvil */}
            <div className="mobile-categories">
              <span className="mobile-categories-title">Categorías:</span>
              <div className="mobile-categories-list">
                <button onClick={() => handleCategoryClick('0')} className="mobile-category-btn">
                  Todas las categorías
                </button>
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => handleCategoryClick(cat.id)} className="mobile-category-btn">
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Autenticación Móvil */}
            <div className="mobile-auth-buttons">
              {isAuthenticated ? (
                <button 
                  className="btn-logout-mobile" 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                >
                  Cerrar Sesión
                </button>
              ) : (
                <button 
                  className="btn-login-mobile" 
                  onClick={() => { onLoginClick(null); setIsMobileMenuOpen(false); }}
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;