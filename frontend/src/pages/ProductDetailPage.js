import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Tag, User, Clock, Image, Video, AlertCircle, ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [replyToId, setReplyToId] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchProductAndMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Producto no encontrado. ¡Se esfumó!');
        }
        const data = await response.json();
        
        setProduct({
          ...data,
          category_name: data.category_name || 'Sin Categoría',
          seller_username: data.seller_username || 'Usuario Desconocido',
          seller_email: data.seller_email || ''
        });

        const messagesResponse = await fetch(`${API_URL}/api/messages/by-product/${id}`);
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("No pudimos cargar los detalles del producto. ¿Se lo comió un duende?");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndMessages();
  }, [id, API_URL]);

  const handleMarkAsSold = async () => {
    if (window.confirm('¿Estás seguro de que quieres marcar este producto como vendido?')) {
        try {
            const response = await fetch(`${API_URL}/api/products/sold/${id}`, {
                method: 'PUT'
            });
            if (response.ok) {
                alert('Producto marcado como vendido con éxito.');
                navigate('/');
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !userMessage.trim()) return;

    try {
        const payload = {
            productId: id,
            senderId: user.uid,
            receiverId: product.seller_id,
            message: userMessage,
            parentId: replyToId
        };

        const response = await fetch(`${API_URL}/api/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const newMessage = {
                _id: Date.now().toString(),
                productId: id,
                senderId: user.uid,
                senderUsername: user.username,
                message: userMessage,
                timestamp: new Date(),
                parentId: replyToId
            };
            setMessages([...messages, newMessage]);
            setUserMessage('');
            setReplyToId(null);
        } else {
            alert('Error al enviar el mensaje.');
        }
    } catch (err) {
        console.error("Error sending message:", err);
        alert("No se pudo enviar el mensaje. Intenta de nuevo.");
    }
  };

  const handleNextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="w-12 h-12 text-purple-500" />
        </motion.div>
        <p className="ml-4 text-lg text-gray-600">Buscando el producto... ¡No te desesperes!</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 text-xl font-semibold">{error}</p>
        <p className="text-gray-500 mt-2">Parece que este producto no existe o se perdió en el ciberespacio.</p>
        <motion.button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Volver al inicio
        </motion.button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const hasMedia = (product.images && product.images.length > 0) || (product.videos && product.videos.length > 0);
  const displayPrice = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;

  const questions = messages.filter(msg => !msg.parentId);
  const getReplies = (questionId) => messages.filter(msg => msg.parentId === questionId);

  return (
    <motion.div
      className="container mx-auto px-4 py-8 pt-20 md:pt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-full shadow-sm hover:bg-gray-300 transition-colors duration-200 flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </motion.button>

      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 lg:flex lg:gap-8">
        {hasMedia && (
          <div className="lg:w-1/2 relative mb-6 lg:mb-0">
            <AnimatePresence mode="wait">
              {product.images && product.images.length > 0 && (
                <motion.img
                  key={currentImageIndex}
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-contain rounded-2xl bg-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=Sin+Imagen'; }}
                />
              )}
              {product.videos && product.videos.length > 0 && !product.images && (
                <motion.video
                  key={product.videos[0]}
                  src={product.videos[0]}
                  controls
                  className="w-full h-96 object-contain rounded-2xl bg-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            {product.images && product.images.length > 1 && (
              <>
                <motion.button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </motion.button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {product.images.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: index === currentImageIndex ? 1.2 : 0.8 }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>
          {user && user.uid === product.seller_id && product.status !== 'vendido' && (
              <motion.button
                  onClick={handleMarkAsSold}
                  className="mb-4 px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              >
                  Marcar como Vendido
              </motion.button>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xl font-bold">{displayPrice} {product.currency || 'MXN'}</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Preguntas y Respuestas</h3>
            
            <form onSubmit={handleSendMessage} className="mb-6 flex items-center">
                <textarea
                    className="w-full p-3 border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder={replyToId ? 'Escribe tu respuesta...' : 'Haz una pregunta...'}
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                />
                <motion.button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-r-xl shadow-md hover:bg-blue-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!user}
                >
                    <Send className="w-5 h-5" />
                </motion.button>
            </form>

            <div className="space-y-4">
                {questions.length > 0 ? (
                    questions.map((question) => (
                        <div key={question._id} className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-gray-800 font-semibold">{question.senderUsername}:</p>
                            <p className="text-gray-600 mt-1">{question.message}</p>
                            
                            {getReplies(question._id).map(reply => (
                                <div key={reply._id} className="bg-gray-200 p-3 mt-2 rounded-xl ml-8">
                                    <p className="text-gray-800 font-semibold">{reply.senderUsername} (Vendedor):</p>
                                    <p className="text-gray-600 mt-1">{reply.message}</p>
                                </div>
                            ))}

                            {user && user.uid === product.seller_id && (
                                <motion.button
                                    onClick={() => setReplyToId(question._id)}
                                    className="mt-2 text-blue-600 font-semibold hover:underline"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Responder
                                </motion.button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Sé el primero en hacer una pregunta.</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;