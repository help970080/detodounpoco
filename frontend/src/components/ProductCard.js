import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tag, DollarSign, Image } from 'lucide-react';

const ProductCard = ({ product }) => {
  const getOptimizedImageUrl = (url) => {
    return url || 'https://via.placeholder.com/100x100?text=Sin+Imagen';
  };

  const imageUrl = product.images && product.images.length > 0
    ? getOptimizedImageUrl(product.images[0])
    : 'https://via.placeholder.com/100x100?text=Sin+Imagen';

  return (
    <Link to={`/product/${product._id}`}>
      <motion.div
        className="bg-white rounded-lg shadow-sm overflow-hidden flex items-start p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100x100?text=Error'; }}
          />
          {product.images && product.images.length > 1 && (
            <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded-full flex items-center">
              <Image className="w-3 h-3" /> {product.images.length}
            </div>
          )}
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-1 mt-1">{product.description}</p>
          <div className="flex items-center mt-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-lg font-bold text-blue-600 ml-1">
              {parseFloat(product.price).toFixed(2)} {product.currency}
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-xs mt-1">
            <Tag className="w-3 h-3" />
            <span className="ml-1">{product.category_name || 'Sin Categoría'}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;