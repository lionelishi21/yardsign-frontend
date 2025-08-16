
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import icon from '../assets/yaadsign-icon.png';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    // In a real app, this would navigate to sign-up page
    console.log('Navigating to get started...');
    navigate('/signup');
  };


  const handleSubmitEmail = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
    // Show success message
    const toast = document.getElementById('success-toast');
    if (toast) {
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 3000);
    }
  };

  const features = [
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Create stunning digital menus with our intuitive design tools and professional templates.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📱',
      title: 'Real-time Updates',
      description: 'Update your menus instantly across all displays. Change prices, items, and availability in seconds.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track performance, popular items, and customer engagement with detailed analytics.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: '🔄',
      title: 'Easy Management',
      description: 'Manage multiple locations, displays, and menus from one centralized dashboard.',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Built for speed with modern technology. Your displays load instantly, every time.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '🛡️',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee. Your business never stops.',
      gradient: 'from-red-500 to-rose-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Restaurant Owner',
      company: 'Bella Vista',
      quote: 'YaadSign transformed our restaurant. We can update our daily specials instantly and our customers love the beautiful displays.',
      avatar: '👩‍🍳',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Franchise Manager',
      company: 'Quick Bites Chain',
      quote: 'Managing 15 locations used to be a nightmare. Now I can update all menus from my phone while having coffee.',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: 'Lisa Park',
      role: 'Café Owner',
      company: 'The Daily Grind',
      quote: 'Our customers constantly compliment our digital menu boards. The analytics help us optimize our offerings.',
      avatar: '👩‍💻',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small restaurants',
      features: [
        'Up to 3 displays',
        '5 menu templates',
        'Basic analytics',
        'Email support'
      ],
      popular: false,
      gradient: 'from-slate-500 to-gray-600'
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Up to 10 displays',
        'Unlimited templates',
        'Advanced analytics',
        'Priority support',
        'Custom branding'
      ],
      popular: true,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large operations',
      features: [
        'Unlimited displays',
        'Custom development',
        'Dedicated support',
        'API access',
        'White-label solution'
      ],
      popular: false,
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 z-0"
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            d="M0,200 C320,100 420,300 800,200 C1120,100 1200,0 1440,100 L1440,900 L0,900 Z"
            fill="url(#heroGradient1)"
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5 }}
            d="M0,300 C360,200 520,400 900,300 C1180,200 1280,100 1440,200 L1440,900 L0,900 Z"
            fill="url(#heroGradient2)"
          />
          <defs>
            <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="heroGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            > 
              <img 
                src={icon} 
                alt="YardSign Logo" 
                className="h-10 w-10 rounded-2xl overflow-hidden object-cover" 
                style={{ marginBottom: 0 }} 
              />
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent align-middle">
                YaadSign
              </span>
            </motion.div>
            <nav className="hidden md:flex space-x-8">
              {['Features', 'Pricing', 'Testimonials'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
                >
                  {item}
                  {/* TODO: no Gradient for this */}   
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full"></span>
                </motion.a>
              ))}
            </nav>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              type="button"
              className=" bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"

            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Transform Your
                <motion.span 
                  className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Digital Menus
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Create stunning digital menu boards that engage customers and boost sales. 
                Update menus instantly, track performance, and manage multiple locations with ease.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  type="button"
                >
                  <span className="relative z-10">Start Free Trial</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="backdrop-blur-sm bg-white/80 border-2 border-gray-200 text-gray-700 px-10 py-4 rounded-2xl hover:bg-white/90 hover:border-gray-300 transition-all duration-300 font-bold text-lg shadow-lg"
                >
                  Watch Demo
                </motion.button>
              </motion.div>

              <motion.div 
                className="grid grid-cols-3 gap-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                {[
                  { icon: '✓', text: 'No credit card' },
                  { icon: '🎯', text: '14-day trial' },
                  { icon: '🔓', text: 'Cancel anytime' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {item.icon}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="relative"
            >
              <motion.div
                animate={{ 
                  rotateY: [0, 5, -5, 0],
                  rotateX: [0, 2, -2, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl p-8 relative overflow-hidden border border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <div className="relative z-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                  <h3 className="text-3xl font-bold mb-6">Today's Specials</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Truffle Pasta', price: '$24.99' },
                      { name: 'Grilled Salmon', price: '$28.99' },
                      { name: 'Caesar Salad', price: '$16.99' }
                    ].map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 + index * 0.2 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex justify-between items-center backdrop-blur-sm bg-white/20 rounded-xl p-4 cursor-pointer transition-all duration-200"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="font-bold text-xl">{item.price}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl"
              >
                <span className="text-2xl">⭐</span>
              </motion.div>
              <motion.div
                animate={{
                  y: [10, -10, 10],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl"
              >
                <span className="text-2xl">🎯</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 bg-gradient-to-br from-gray-50/80 to-blue-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to help restaurants of all sizes create amazing digital menu experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                className="group backdrop-blur-sm bg-white/80 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-5xl mb-6 relative z-10"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed relative z-10">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Loved by restaurant owners
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers are saying about YaadSign
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
                className="backdrop-blur-sm bg-white/90 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="text-5xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                    <p className="text-blue-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-4 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 + i * 0.1 }}
                      className="text-yellow-400 text-xl"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed relative z-10">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 bg-gradient-to-br from-gray-50/80 to-purple-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: plan.popular ? 1.02 : 1.05,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
                className={`relative backdrop-blur-sm bg-white/90 rounded-3xl p-10 border-2 hover:shadow-2xl transition-all duration-500 ${
                  plan.popular 
                    ? 'border-blue-500 shadow-2xl transform scale-105 ring-4 ring-blue-200/50' 
                    : 'border-white/30 shadow-xl'
                }`}
              >
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                  >
                    <span className={`bg-gradient-to-r ${plan.gradient} text-white px-6 py-3 rounded-full font-bold shadow-lg`}>
                      Most Popular
                    </span>
                  </motion.div>
                )}
                
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                  <p className="text-gray-600 mb-8 text-lg">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">{plan.price}</span>
                    <span className="text-gray-600 text-xl">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                      className="flex items-center"
                    >
                      <span className="text-green-500 mr-4 text-xl">✓</span>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-xl`
                      : 'backdrop-blur-sm bg-gray-100/80 text-gray-900 hover:bg-gray-200/80 border border-gray-200'
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
<section className="relative z-10 py-32 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
  <div className="absolute inset-0">
    <svg viewBox="0 0 1440 320" className="w-full h-full opacity-20">
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 2 }}
        d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,197.3C672,181,768,171,864,176C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        fill="white"
        fillOpacity="0.1"
      />
    </svg>
  </div>
  
  <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2 
        className="text-5xl font-bold text-white mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Ready to transform your restaurant?
      </motion.h2>
      <motion.p 
        className="text-xl text-blue-100 mb-12 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Join thousands of restaurants already using YaadSign to create amazing digital menu experiences.
      </motion.p>
      
      <motion.form 
        onSubmit={handleSubmitEmail} 
        className="max-w-md mx-auto flex gap-4 mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-6 py-4 rounded-2xl border-0 focus:ring-4 focus:ring-blue-300 text-gray-900 backdrop-blur-sm bg-white/90 shadow-lg"
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="backdrop-blur-sm bg-white/90 text-blue-600 px-8 py-4 rounded-2xl hover:bg-white transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
        >
          Start Free Trial
        </motion.button>
      </motion.form>
      
      <motion.p 
        className="text-blue-100 text-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        14-day free trial • No credit card required • Cancel anytime
      </motion.p>
    </motion.div>
  </div>
</section>

      <footer className="relative z-10 bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <motion.div 
              className="col-span-1 md:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">Y</span>
                </div>
                <span className="font-bold text-2xl">YaadSign</span>
              </div>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                The future of digital menu boards. Create, manage, and optimize your restaurant's digital presence with cutting-edge technology.
              </p>
              <div className="flex space-x-6">
                {['Twitter', 'LinkedIn', 'Facebook'].map((social, index) => (
                  <motion.a
                    key={social}
                    href="#"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.2, color: '#3B82F6' }}
                    className="text-gray-400 hover:text-blue-400 transition-all duration-300 text-lg font-medium"
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold mb-6 text-xl">Product</h4>
              <ul className="space-y-3 text-gray-400">
                {['Features', 'Pricing', 'Templates', 'Integrations'].map((item, index) => (
                  <motion.li key={item}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5, color: '#ffffff' }}
                      className="hover:text-white transition-all duration-300 text-lg"
                    >
                      {item}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold mb-6 text-xl">Support</h4>
              <ul className="space-y-3 text-gray-400">
                {['Help Center', 'Contact', 'API Docs', 'Status'].map((item, index) => (
                  <motion.li key={item}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5, color: '#ffffff' }}
                      className="hover:text-white transition-all duration-300 text-lg"
                    >
                      {item}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            className="border-t border-gray-800 mt-12 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-lg">
              &copy; 2024 YaadSign. All rights reserved. Made with ❤️ for restaurants worldwide.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
} 