import { useEffect, Fragment } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Registro from './pages/Registro';
import Productos from './pages/productos';
import Servicios from './pages/Servicios';
import ServicioDetail from './pages/ServicioDetail';
import { useAuth } from './utils/AuthContext';
import Layout from './components/Layout';
import TransicionBienvenida from './pages/TransicionBienvenida';
import Perfil from './pages/Perfil';
import './styles/Global.css';
import './styles/TransicionBienvenida.css';

function App() {
    const { user } = useAuth();
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

    const ProtectedRoute = ({ element: Element, roles }) => {
        if (!user) {
            return <Navigate to="/" replace />;
        }
        if (roles && !roles.includes(user.rol)) {
            return <Navigate to="/unauthorized" replace />;
        }
        return Element;
    };

    const isRegistroRoute = location.pathname === '/registro';

    return (
        <Fragment>
            <TransicionBienvenida />

            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/productos/buscar" element={<Productos />} />
                    <Route path="/productos/:id" element={<Productos />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/servicios/:id" element={<ServicioDetail />} />

                    <Route path="/perfil" element={<Perfil />} />

                    <Route path="/unauthorized" element={<div>No tienes permiso para ver esta página.</div>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Fragment>
    );
}

export default App;