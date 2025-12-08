import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { useCart } from '../utils/CartContext';
import { useAuth } from '../utils/AuthContext';
import { useAuthModal } from '../contexts/AuthContext';

// --- TUS ÍCONOS SVG (Mantenlos igual) ---
const IconCart = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.1 6M7 13l-2 7h13" /></svg>);
const IconSearch = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const IconUser = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const IconFilter = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/></svg>);
const IconMenu = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const IconClose = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

const Navbar = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { openLogin } = useAuthModal();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs
  const categoryButtonRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categorias/producto');
        if (!response.ok) throw new Error("Error");
        const data = await response.json();
        const cats = Array.isArray(data) ? data : (data.data || []);
        setCategories(cats);
      } catch (error) {
        setCategories([
          { id: '1', nombre: 'Hardware' },
          { id: '2', nombre: 'Periféricos' },
          { id: '3', nombre: 'Software' },
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Carrito
      if (cartOpen && cartDropdownRef.current && !cartDropdownRef.current.contains(event.target) && !event.target.closest('.cart-btn')) {
        setCartOpen(false);
      }
      // Categorías
      if (isCategoryDropdownOpen && categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target) && categoryButtonRef.current && !categoryButtonRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cartOpen, isCategoryDropdownOpen]);

  // Funciones Helpers
  const formatCurrency = (amount) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  const isActive = (path) => (path === '/home' ? (location.pathname === '/' || location.pathname === '/home') : location.pathname.startsWith(path));

  // Handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleUserClick = () => {
    if (user) navigate('/perfil');
    else openLogin();
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(categoryId === '0' ? '/productos' : `/productos?categoria_id=${categoryId}`);
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) openLogin();
    else navigate('/checkout');
    setCartOpen(false);
  };

  // Cálculos Carrito
  const cartCount = cartItems.reduce((s, i) => s + (i.quantity || 0), 0);
  const cartTotal = cartItems.reduce((s, i) => s + Number(i.price ?? i.precio ?? 0) * (i.quantity ?? 0), 0);
  const hasLowPriceService = cartItems.some(item => item.type === 'servicio' && Number(item.price ?? item.precio ?? 0) < 2000);

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/home" className="navbar-logo">
            <img src="./logo.png" className="navbar-logo-img" alt="Logo" />
          </Link>

          {/* Nav Desktop */}
          <nav className="navbar-nav">
            <Link to="/home" className={`navbar-nav-link ${isActive('/home') ? 'active' : ''}`}>Inicio</Link>
            <Link to="/productos" className={`navbar-nav-link ${isActive('/productos') ? 'active' : ''}`}>Productos</Link>
            <Link to="/servicios" className={`navbar-nav-link ${isActive('/servicios') ? 'active' : ''}`}>Servicios</Link>
          </nav>

          {/* Buscador y Filtro Desktop */}
          <div className="navbar-search-category-container">
            <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
              <input type="text" className="navbar-search-input" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type="submit" className="navbar-search-btn"><IconSearch /></button>
            </form>
            <div className="category-dropdown-container">
              <button ref={categoryButtonRef} className="navbar-category-btn" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                <IconFilter /><span className="category-btn-text">Categorías</span>
              </button>
              {isCategoryDropdownOpen && (
                <ul ref={categoryDropdownRef} className="category-dropdown-menu">
                  <li onClick={() => handleCategoryClick('0')}>Todas</li>
                  {categories.map(cat => (
                    <li key={cat.id} onClick={() => handleCategoryClick(cat.id)}>{cat.nombre}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Acciones Derecha */}
          <div className="navbar-actions">
            <button className="navbar-icon-btn" onClick={handleUserClick}><IconUser /></button>
            
            <div className="navbar-cart-container">
              <button className="navbar-icon-btn cart-btn" onClick={() => setCartOpen(!cartOpen)}>
                <IconCart />
                {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
              </button>

              {cartOpen && (
                <div className="navbar-cart-dropdown" ref={cartDropdownRef}>
                  <h4>Carrito ({cartCount})</h4>
                  {cartItems.length === 0 ? <p>Tu carrito está vacío</p> : (
                    <>
                      <ul className="navbar-cart-list">
                        {cartItems.map(item => (
                          <li key={`${item.type}-${item.id}`} className="navbar-cart-item">
                            <img src={item.image || item.imagen_url || 'https://placehold.co/100'} alt="Item" className="navbar-cart-image" />
                            <div className="navbar-cart-info">
                              <div className="navbar-cart-title">{item.nombre}</div>
                              <div className="navbar-cart-price">{formatCurrency(Number(item.price ?? item.precio) * item.quantity)} (x{item.quantity})</div>
                            </div>
                            <div className="navbar-cart-controls">
                               <button onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}>-</button>
                               <button onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}>+</button>
                               <button onClick={() => removeFromCart(item.id, item.type)} className="btn-remove"><IconClose /></button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="navbar-cart-total"><strong>Total:</strong> <strong>{formatCurrency(cartTotal)}</strong></div>
                      {hasLowPriceService && <div style={{color:'orange', fontSize:'0.8rem', padding:'5px'}}>Servicios deben ser mayor a $2,000</div>}
                      <div className="navbar-cart-actions">
                        <button className="btn-checkout" onClick={handleCheckout} disabled={hasLowPriceService} style={{opacity: hasLowPriceService ? 0.5 : 1}}>Pagar</button>
                        <button className="btn-clear-cart" onClick={clearCart}>Vaciar</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <button className="navbar-mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* MENÚ MÓVIL Y OVERLAY */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'show' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <nav className={`navbar-mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-nav-content">
          <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
            <input type="text" className="mobile-search-input" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit" className="mobile-search-btn"><IconSearch /></button>
          </form>

          <div className="mobile-nav-links">
            <Link to="/home" className={`mobile-nav-link ${isActive('/home') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
            <Link to="/productos" className={`mobile-nav-link ${isActive('/productos') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Productos</Link>
            <Link to="/servicios" className={`mobile-nav-link ${isActive('/servicios') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Servicios</Link>
            
            <div className="mobile-categories">
              <span className="mobile-categories-title">Categorías</span>
              <div className="mobile-categories-list">
                 <button onClick={() => handleCategoryClick('0')} className="mobile-category-btn">Todas</button>
                 {categories.map(cat => (
                   <button key={cat.id} onClick={() => handleCategoryClick(cat.id)} className="mobile-category-btn">{cat.nombre}</button>
                 ))}
              </div>
            </div>

            <div className="mobile-auth-buttons">
              {isAuthenticated ? (
                <button className="btn-logout-mobile" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Cerrar Sesión</button>
              ) : (
                <button className="btn-login-mobile" onClick={() => { openLogin(); setIsMobileMenuOpen(false); }}>Iniciar Sesión</button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;