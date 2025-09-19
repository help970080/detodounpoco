import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { Rocket, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://detodounpoco.onrender.com/api/products');
        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("No pudimos cargar los productos. ¡El internet nos odia!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?name=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Rocket className="w-12 h-12 text-blue-500" />
        </motion.div>
        <p className="ml-4 text-lg text-gray-600">Cargando productos... ¡Casi listo!</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-xl">{error}</p>
        <p className="text-gray-500 mt-2">Intenta recargar la página o revisa tu conexión.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8 md:pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleQuickSearch} className="mb-8">
        <div className="relative flex w-full max-w-lg mx-auto">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Busca cualquier producto..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <motion.button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SearchIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </form>

      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
        Lo más nuevo en <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">DE TODO UN POCO</span>
      </h2>

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-xl">¡Vaya, parece que no hay nada por aquí todavía!</p>
          <p className="text-gray-500 mt-2">Sé el primero en subir un producto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HomePage;