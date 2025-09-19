import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg p-4 md:px-8 flex items-center justify-between"
        >
            <Link to="/" className="flex items-center gap-2">
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">DE TODO UN POCO</span>
            </Link>

            <nav className="flex items-center gap-4">
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    Inicio
                </Link>
                <Link to="/search" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                    <Search className="w-5 h-5 mr-1" /> Buscar
                </Link>
                
                {user ? (
                    <>
                        <Link to="/add-product" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                            <Plus className="w-5 h-5 mr-1" /> Vender
                        </Link>
                        <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                            <User className="w-5 h-5 mr-1" /> Perfil
                        </Link>
                        <motion.button
                            onClick={handleSignOut}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <LogOut className="w-5 h-5 mr-1" /> Salir
                        </motion.button>
                    </>
                ) : (
                    <Link to="/signin" className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center">
                        <LogIn className="w-5 h-5 mr-2" /> Ingresar
                    </Link>
                )}
            </nav>
        </motion.header>
    );
};

export default Navbar;