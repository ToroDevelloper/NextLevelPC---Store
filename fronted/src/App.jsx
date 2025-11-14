import { useEffect, Fragment } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Productos from './pages/productos';
import Servicios from './pages/Servicios';
import ServicioDetail from './pages/ServicioDetail'; // Importar el nuevo componente
import { useAuth } from './utils/AuthContext';
import Layout from './components/Layout';
import TransicionBienvenida from './pages/TransicionBienvenida'; 
import './styles/Global.css';
import './styles/TransicionBienvenida.css';

function App() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

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

    // Verificar si estamos en la ruta de registro para aplicar estilos especiales
    const isRegistroRoute = location.pathname === '/registro';

    return (
        <Fragment>
            <TransicionBienvenida />
            
            {/* Si estamos en registro, no mostrar el Layout normal */}
            {isRegistroRoute ? (
                <Registro />
            ) : (
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/registro" element={<Registro />} />
                        <Route path="/productos" element={<Productos />} />
                        <Route path="/productos/buscar" element={<Productos />} />
                        <Route path="/productos/:id" element={<Productos />} />
                        <Route path="/repuestos" element={<Productos />} />
                        <Route path="/accesorios" element={<Productos />} />
                        <Route path="/servicios" element={<Servicios />} />
                        <Route path="/servicios/:id" element={<ServicioDetail />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Layout>
            )}
        </Fragment>
    );
}

export default App;