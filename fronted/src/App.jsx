import { useEffect, Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Productos from './pages/productos';
import Servicios from './pages/Servicios';
import { useAuth } from './utils/AuthContext';
import "./styles/App.css";
import "./styles/Global.css";

// Asegúrate de que este import apunte al archivo .jsx
// que te proporcioné (el que usa 'animandoSalida')
import TransicionBienvenida from './pages/TransicionBienvenida'; 
import './styles/TransicionBienvenida.css';

function App() {
    const { isAuthenticated } = useAuth();

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
        if (!isAuthenticated) {
            return <Navigate to="/" replace />;
        }
        return Element;
    };

    return (
        <Fragment>
            <TransicionBienvenida />
            
            <Routes>
                {/* --- Rutas Públicas --- */}
                <Route path="/" element={<Home />} />
                <Route path="/registro" element={<Registro />} />
                
                {/* 👇 CORRECCIÓN AQUÍ 👇
                   Las rutas de productos ahora son públicas.
                   Cualquiera puede ver, buscar y ver detalles de productos.
                */}
                <Route path="/productos" element={<Productos />} />
                <Route path="/productos/buscar" element={<Productos />} />
                <Route path="/productos/:id" element={<Productos />} />

                
                {/* --- Rutas Protegidas --- */}
                {/* Servicios sigue siendo un ejemplo de ruta protegida */}
                <Route path="/servicios" element={<ProtectedRoute element={<Servicios />} />} />

                
                {/* Ruta de fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Fragment>
    );
}

export default App;