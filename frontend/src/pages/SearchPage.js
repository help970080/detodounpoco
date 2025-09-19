import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { Search, Tag, DollarSign, Filter, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const SearchPage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`${API_URL}/api/brands`);
        if (response.ok) {
          const data = await response.json();
          setBrands(data);
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };
    fetchBrands();

    const query = new URLSearchParams(location.search);
    const nameParam = query.get('name') || '';
    setSearchTerm(nameParam);
    if (nameParam) {
      handleSearch({ preventDefault: () => {} }, nameParam);
    }
  }, [location.search, API_URL]);

  const handleSearch = async (e, initialSearchTerm = searchTerm) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (initialSearchTerm) params.append('name', initialSearchTerm);
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const response = await fetch(`${API_URL}/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Hubo un problema al buscar');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Hubo un problema al buscar. ¡Intenta de nuevo!");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    handleSearch({ preventDefault: () => {} });
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 pt-20 md:pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
        Encuentra lo que buscas en <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">DE TODO UN POCO</span>
      </h2>

      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <motion.button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-5 h-5 mr-2" /> Buscar
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-xl shadow-md hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-5 h-5 mr-2" /> {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden"
            >
              <div>
                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Categoría:</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="brand" className="block text-gray-700 font-medium mb-2">Marca:</label>
                <select
                  id="brand"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="">Todas las marcas</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="minPrice" className="block text-gray-700 font-medium mb-2">Precio Mínimo:</label>
                <input
                  type="number"
                  id="minPrice"
                  placeholder="Ej: 50"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-gray-700 font-medium mb-2">Precio Máximo:</label>
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="Ej: 500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <motion.button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-3 bg-red-100 text-red-700 rounded-xl shadow-md hover:bg-red-200 transition-colors duration-200 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 mr-2" /> Limpiar Filtros
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Search className="w-12 h-12 text-blue-500" />
          </motion.div>
          <p className="ml-4 text-lg text-gray-600">Buscando... ¡No te duermas!</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <p className="text-red-500 text-xl">{error}</p>
          <p className="text-gray-500 mt-2">A veces el internet es un poco caprichoso.</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-600 text-xl">¡Ups! No encontramos nada con esos criterios.</p>
          <p className="text-gray-500 mt-2">Intenta con otra búsqueda o ajusta los filtros.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SearchPage;