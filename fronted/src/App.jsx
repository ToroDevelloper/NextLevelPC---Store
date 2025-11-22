import { useEffect, Fragment } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Registro from './pages/Registro';
import Productos from './pages/productos';
import Servicios from './pages/Servicios';
import ServicioDetail from './pages/ServicioDetail';
import Perfil from './pages/Perfil';
import Checkout from './pages/Checkout';
import Factura from './pages/Factura';

import Layout from './components/Layout';
import TransicionBienvenida from './pages/TransicionBienvenida';

import { useAuth } from './utils/AuthContext';
import { StripeProvider } from './utils/StripeContext.jsx';
import { stripePromise } from "./utils/stripePromise";

import { Elements } from '@stripe/react-stripe-js';
import { useCart } from "./utils/CartContext";

import './styles/Global.css';
import './styles/TransicionBienvenida.css';

function App() {
    const { cartItems } = useCart();
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        fetch('/api/health')
            .then(res => res.json())
            .then(data => {
                console.log('Backend OK:', data.message);
            })
            .catch(err => console.error('Error backend:', err.message));
    }, []);

    const ProtectedRoute = ({ element, roles }) => {
        if (!user) return <Navigate to="/" replace />;
        if (roles && !roles.includes(user.rol)) {
            return <Navigate to="/unauthorized" replace />;
        }
        return element;
    };

    return (
        <Fragment>
            <TransicionBienvenida />

            <StripeProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />

                        <Route path="/registro" element={<Registro />} />

                        {/* Productos */}
                        <Route path="/productos" element={<Productos />} />
                        <Route path="/productos/:id" element={<Productos />} />

                        {/* Servicios */}
                        <Route path="/servicios" element={<Servicios />} />
                        <Route path="/servicios/:id" element={<ServicioDetail />} />

                        <Route path="/perfil" element={<Perfil />} />

                        {/* CHECKOUT CORREGIDO */}
                        <Route
                            path="/checkout"
                            element={
                                <Elements stripe={stripePromise}>
                                    <Checkout cart={cartItems} />
                                </Elements>
                            }
                        />

                        <Route path="/factura/:id" element={<Factura />} />

                        <Route path="/unauthorized" element={<div>No tienes permiso</div>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Layout>
            </StripeProvider>
        </Fragment>
    );
}

export default App;
