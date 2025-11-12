import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import InicioSesion from './pages/inicioSesion';
import Registro from './pages/Registro';
import Productos from './pages/productos';
import Servicios from './pages/Servicios';
import { useAuth } from './utils/AuthContext';
import "./styles/App.css";
import "./styles/Global.css";

function App() {
    const { isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Intentando conectar con backend...');
        fetch('http://localhost:8080/api/health')
            .then(res => res.json())
            .then(data => {
                console.log('BACKEND CONECTADO - Mensaje:', data.message);
                console.log('BACKEND CONECTADO - Base de datos:', data.database);
            })
            .catch(err => {
                console.error('ERROR DE CONEXIÓN:', err.message);
            });
    }, []);

    const ProtectedRoute = ({ element: Element }) => {
        const navigate = useNavigate();
        
        useEffect(() => {
            if (!isAuthenticated) {
                navigate('/', { replace: true });
            }
        }, [isAuthenticated, navigate]);

        if (!isAuthenticated) {
            return null;
        }
        
        return Element;
    };

    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<InicioSesion />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* Rutas Protegidas */}
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/productos" element={<ProtectedRoute element={<Productos />} />} />
            <Route path="/servicios" element={<ProtectedRoute element={<Servicios />} />} />
            <Route path="/productos/buscar" element={<ProtectedRoute element={<Productos />} />} />
            <Route path="/productos/:id" element={<ProtectedRoute element={<Productos />} />} />
        </Routes>
    );
}

export default App;