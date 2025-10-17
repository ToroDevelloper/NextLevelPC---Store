import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-md py-4 px-6">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <h1 className="text-3xl font-bold text-blue-700 tracking-tight">NextLevelPc</h1>
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/repuestos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                Repuestos
                            </Link>
                            <Link to="/accesorios" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                Accesorios
                            </Link>
                            <Link to="/servicios" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                Servicios
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-700 hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                        <button className="text-gray-700 hover:text-blue-600 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                            </svg>
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Tu tienda de tecnología de confianza
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Encuentra los mejores componentes, accesorios y servicios para tu PC.
                </p>
            </div>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Producto 1: Teclado */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
                        <img
                            src="https://images.unsplash.com/photo-1587829741301-7e96661f95b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                            alt="Teclado mecánico"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Teclado Mecánico RGB</h3>
                            <p className="text-gray-600 mb-4">Perfecto para gaming y oficina.</p>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md">
                                Añadir al carrito
                            </button>
                        </div>
                    </div>

                    {/* Producto 2: Mouse */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
                        <img
                            src="https://images.unsplash.com/photo-1591558888770-675162785672?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                            alt="Mouse gamer"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mouse Gamer Inalámbrico</h3>
                            <p className="text-gray-600 mb-4">Diseño ergonómico y alta precisión.</p>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md">
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-semibold">Soporte</h3>
                            <p className="text-gray-400">NextLevelPC@gmail.com</p>
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a>
                        </div>
                    </div>
                    <div className="mt-6 text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} NextLevelPc. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;