import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const SignInPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignIn) {
        const result = await signIn(email, password);
        if (result.ok) {
          setMessage('Sesión iniciada con éxito. Redirigiendo...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setMessage(`Error: ${result.message}`);
        }
      } else {
        const finalUsername = username.trim() || email.split('@')[0];
        const result = await signUp(email, password, finalUsername);
        if (result.ok) {
          setMessage('¡Registro exitoso! Redirigiendo para iniciar sesión...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setMessage(`Error: ${result.message}`);
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
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
        {isSignIn ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-sm mx-auto">
        <form onSubmit={handleAuth}>
          {!isSignIn && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Nombre de Usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Elige un nombre"
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
                placeholder="tu-email@ejemplo.com"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
                minLength="6"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>
          {message && (
            <div className={`mb-4 p-3 rounded-xl text-center font-semibold ${
              message.includes('Error') || message.includes('error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
          <motion.button
            type="submit"
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center font-semibold text-lg disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'Procesando...' : isSignIn ? 'Iniciar Sesión' : 'Registrarse'}
          </motion.button>
        </form>
        <button
          onClick={() => {
            setIsSignIn(!isSignIn);
            setMessage('');
          }}
          className="w-full mt-4 text-center text-blue-600 font-semibold hover:underline"
        >
          {isSignIn ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia Sesión'}
        </button>
      </div>
    </motion.div>
  );
};

export default SignInPage;