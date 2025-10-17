
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-gray-200 p-4 shadow">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <h1 className="text-2xl font-bold text-gray-800">NextLevelPc</h1>
                        <nav className="flex space-x-6">
                            <Link to="/repuestos" className="hover:text-blue-600">Repuestos</Link>
                            <Link to="/accesorios" className="hover:text-blue-600">Accesorios</Link>
                            <Link to="/servicios" className="hover:text-blue-600">Servicios</Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Usuario</span>
                        <button className="text-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c2.667 0 5.297.667 7.335 1.85 2.038 1.183 3.54 2.86 4.25 4.806A23.737 23.737 0 0121 19.5a23.737 23.737 0 01-5.38 10.05C13.64 29.5 10.8 30 8 30H4.5A4.5 4.5 0 010 25.5v-12A4.5 4.5 0 014.5 9zm15.5 10a4.5 4.5 0 01-4.5 4.5h-4.5a4.5 4.5 0 01-4.5-4.5V9a4.5 4.5 0 014.5-4.5h4.5a4.5 4.5 0 014.5 4.5v10z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Producto 1: Teclado */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1587829741301-7e96661f95b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                            alt="Teclado mecánico"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium">
                                Add To Cart
                            </button>
                        </div>
                    </div>

                    {/* Producto 2: Mouse */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1591558888770-675162785672?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                            alt="Mouse gamer"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium">
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-200 p-6 mt-8">
                <div className="container mx-auto">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">soporte</h3>
                    <p className="text-gray-700">
                        NextLevelPC@gmail.com
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;