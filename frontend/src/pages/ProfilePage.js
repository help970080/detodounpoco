import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { User, Mail, Package, Archive, CheckCircle, Edit, Trash2, AlertCircle, Loader, DollarSign } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('disponibles');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await fetch(`https://detodounpoco.onrender.com/api/users/${user.uid}`);
        const userData = await userResponse.json();
        if (userResponse.ok) {
          setProfile(userData);
        }

        const productsResponse = await fetch(`https://detodounpoco.onrender.com/api/products/by-user/${user.uid}`);
        const productsData = await productsResponse.json();
        if (productsResponse.ok) {
          setProducts(productsData);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No pudimos cargar tus datos. Intenta de nuevo.");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleMarkAsSold = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres marcar este producto como vendido?')) {
        try {
            const response = await fetch(`https://detodounpoco.onrender.com/api/products/sold/${productId}`, {
                method: 'PUT'
            });
            if (response.ok) {
                alert('Producto marcado como vendido con éxito.');
                setProducts(prevProducts =>
                    prevProducts.map(p =>
                        p._id === productId ? { ...p, status: 'vendido' } : p
                    )
                );
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (err) {
            console.error("Error marking as sold:", err);
            alert("No se pudo marcar el producto como vendido. Intenta de nuevo.");
        }
    }
  };

  const handleEditProduct = (productId) => {
      alert(`Función para editar el producto con ID: ${productId}. (No implementada aún)`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
        try {
            const response = await fetch(`https://detodounpoco.onrender.com/api/products/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Producto eliminado con éxito.');
                setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("No se pudo eliminar el producto. Intenta de nuevo.");
        }
    }
  };

  const availableProducts = products.filter(p => p.status !== 'vendido');
  const soldProducts = products.filter(p => p.status === 'vendido');

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-blue-500" />
        </motion.div>
        <p className="ml-4 text-lg text-gray-600">Cargando tu perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 text-xl font-semibold">{error}</p>
        <p className="text-gray-500 mt-2">No te preocupes, no es tu culpa.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8 pt-20 md:pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Mi Perfil
      </h2>
      
      {profile && (
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-lg mx-auto mb-8">
            <div className="flex items-center gap-6 mb-4">
              <div className="flex-shrink-0">
                <User className="w-16 h-16 text-gray-500" />
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-900">{profile.username}</h3>
                <div className="flex items-center text-gray-600 mt-2">
                  <Mail className="w-4 h-4 mr-2" />
                  <p>{profile.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-xl font-semibold text-gray-800">Estado de la suscripción</h4>
                {profile.hasActiveSubscription ? (
                    <div className="flex items-center mt-2 text-green-600 font-medium">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Suscripción activa
                    </div>
                ) : (
                    <div className="mt-2">
                        <p className="text-gray-600">No tienes una suscripción activa.</p>
                        <motion.button
                            onClick={() => navigate('/subscribe')}
                            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <DollarSign className="w-5 h-5 mr-2" /> Suscribirme ahora
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-center border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-lg transition-colors duration-200 ${
              activeTab === 'disponibles'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('disponibles')}
          >
            Productos Disponibles ({availableProducts.length})
          </button>
          <button
            className={`px-4 py-2 font-medium text-lg transition-colors duration-200 ${
              activeTab === 'vendidos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('vendidos')}
          >
            Productos Vendidos ({soldProducts.length})
          </button>
        </div>
      </div>

      {activeTab === 'disponibles' && (
        availableProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableProducts.map((product) => (
              <div key={product._id} className="relative">
                <ProductCard product={product} />
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <motion.button
                        onClick={() => handleMarkAsSold(product._id)}
                        className="p-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Marcar como vendido"
                    >
                        <CheckCircle className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        onClick={() => handleEditProduct(product._id)}
                        className="p-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-yellow-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Editar producto"
                    >
                        <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Eliminar producto"
                    >
                        <Trash2 className="w-5 h-5" />
                    </motion.button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xl">Aún no tienes productos disponibles.</p>
            <p className="text-gray-500 mt-2">¿Qué esperas para publicar algo?</p>
            <motion.button
              onClick={() => navigate('/add-product')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Package className="w-5 h-5 mr-2" /> Subir Producto
            </motion.button>
          </div>
        )
      )}

      {activeTab === 'vendidos' && (
        soldProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {soldProducts.map((product) => (
              <div key={product._id} className="relative opacity-60">
                <ProductCard product={product} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                  <span className="text-white text-xl font-bold">VENDIDO</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xl">No has vendido ningún producto todavía.</p>
            <p className="text-gray-500 mt-2">¡Sigue vendiendo!</p>
          </div>
        )
      )}
    </motion.div>
  );
};

export default ProfilePage;