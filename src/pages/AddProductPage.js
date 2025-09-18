import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('nuevo');
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (user && !user.hasActiveSubscription) {
      alert("Necesitas una suscripción para publicar productos.");
      navigate('/subscribe');
    }
  }, [user, navigate]);

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', description);
      formData.append('price', parseFloat(price));
      formData.append('seller_id', user.uid);
      formData.append('condition', condition);
      formData.append('currency', 'MXN');

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('https://detodounpoco.onrender.com/api/products/add', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al agregar producto');
      }

      setMessage('¡Producto agregado con éxito! 🎉');
      setProductName('');
      setDescription('');
      setPrice('');
      setImageFiles([]);
      
      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      console.error("Error adding product:", err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 pt-20 md:pt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Sube tu Producto
      </h2>
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Nombre del Producto</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 h-32"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Precio (MXN)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Condición</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
              <option value="reacondicionado">Reacondicionado</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Imágenes</label>
            <input
              type="file"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              accept="image/*"
              multiple
              required
            />
          </div>
          {message && (
            <div className={`mb-4 p-3 rounded-xl text-center font-semibold ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
          <motion.button
            type="submit"
            className="w-full mt-6 px-6 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center font-semibold text-lg disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'Subiendo...' : 'Publicar Producto'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddProductPage;