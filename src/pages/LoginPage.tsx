import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';

import icon from '../assets/yaadsign-icon.png';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();
  

  // Pre-populate admin credentials
  // useEffect(() => {
  //   setEmail('admin@yardsign.com');
  //   setPassword('password123');
  //   setRestaurantName('YardSign Restaurant');
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        await login(email, password);
    } catch (err) {
      const error = err;
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await login('admin@yardsign.com', 'password123');
    } catch (err) {
      const error = err;
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to Home</span>
      </motion.button>
      {/* Animated SVG Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            d="M0,400 C320,300 420,500 800,400 C1120,300 1200,200 1440,300 L1440,900 L0,900 Z"
            fill="url(#gradient1)"
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
            d="M0,500 C360,400 520,600 900,500 C1180,400 1280,300 1440,400 L1440,900 L0,900 Z"
            fill="url(#gradient2)"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 opacity-20"
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="30" fill="#F97316" opacity="0.3" />
            <circle cx="50" cy="50" r="20" fill="#EA580C" opacity="0.5" />
          </svg>
        </motion.div>

        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-32 right-16 opacity-20"
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="10" y="10" width="60" height="60" rx="15" fill="#FBBF24" opacity="0.4" />
            <rect x="20" y="20" width="40" height="40" rx="10" fill="#F59E0B" opacity="0.6" />
          </svg>
        </motion.div>

        <motion.div
          animate={{
            y: [-15, 25, -15],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-20 opacity-20"
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <polygon points="60,10 90,40 60,70 30,40" fill="#FB923C" opacity="0.4" />
            <polygon points="60,25 75,40 60,55 45,40" fill="#F97316" opacity="0.6" />
          </svg>
        </motion.div>

        <motion.div
          animate={{
            y: [25, -15, 25],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-20 right-32 opacity-20"
        >
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
            <path d="M45 5 L65 35 L85 25 L65 55 L45 85 L25 55 L5 25 L25 35 Z" fill="#FBBF24" opacity="0.5" />
          </svg>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md" >
        <div className="backdrop-blur-sm bg-white/90 rounded-3xl p-8 shadow-2xl border border-white/20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={icon} 
                alt="YardSign Logo" 
                className="w-14 h-14 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg ring-4 ring-orange-200/50" 
              />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              YaadSign
            </h1>
            <p className="text-gray-600 font-medium">Digital Menu Board System</p>
            
            {/* Toggle Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </motion.div>
          </motion.div>

          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                placeholder="Enter your password"
                required
              />
            </motion.div>

          
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="text-red-600 text-sm bg-red-50/90 backdrop-blur-sm p-4 rounded-xl border border-red-200"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                  />
                  Signing In...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In
                  <motion.svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </span>
              )}
            </motion.button>
          </div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full opacity-20 blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-30 blur-sm"
          />
        </div>
      </motion.div>
    </div>
  );
}