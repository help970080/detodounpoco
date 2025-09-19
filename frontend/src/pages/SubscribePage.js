import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { DollarSign, CheckCircle } from 'lucide-react';

const SubscribePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubscribe = () => {
        if (!user) {
            alert('Debes iniciar sesión para suscribirte.');
            navigate('/signin');
            return;
        }

        window.location.href = 'https://buy.stripe.com/eVq7sE3oEfVzdmG6G1frW01';
    };

    return (
        <motion.div
            className="container mx-auto px-4 py-8 pt-20 md:pt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
                ¡Conviértete en Vendedor!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
                Suscríbete por solo **$50.00 MXN al mes** para publicar tus productos.
            </p>

            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm mx-auto">
                <div className="flex flex-col items-center">
                    <DollarSign className="w-16 h-16 text-blue-600" />
                    <h3 className="text-3xl font-bold text-gray-900 mt-4">Plan Básico</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">$50.00 MXN / mes</p>
                    <ul className="text-left text-gray-700 mt-6 space-y-2">
                        <li className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            Publica productos ilimitados
                        </li>
                        <li className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            Gestiona tu inventario
                        </li>
                        <li className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            Interactúa con compradores
                        </li>
                    </ul>
                    <motion.button
                        onClick={handleSubscribe}
                        className="w-full mt-8 px-6 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center font-semibold text-lg disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Suscribirme'}
                    </motion.button>
                </div>
                {message && (
                    <div className={`mt-4 p-3 rounded-xl font-semibold ${
                        message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {message}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SubscribePage;