import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { displayAPI } from '../services/api';
import type { Display, Menu } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function DisplayClient() {
  const [display, setDisplay] = useState<Display | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState('');
  const [isPaired, setIsPaired] = useState(false);

  useEffect(() => {
    // Check if we have a pairing code in localStorage
    const pairingCode = localStorage.getItem('pairingCode');
    if (pairingCode) {
      console.log('Found pairing code in localStorage:', pairingCode);
      fetchDisplayByPairingCode(pairingCode);
    } else {
      console.log('No pairing code found in localStorage');
      setLoading(false);
    }
  }, []);

  const fetchDisplayByPairingCode = async (code: string) => {
    try {
      setLoading(true);
      console.log('Fetching display with pairing code:', code);
      const displayData = await displayAPI.getDisplayByPairingCode(code);
      console.log('Display data received:', displayData);
      setDisplay(displayData);
      setIsPaired(true);
    } catch (error) {
      console.error('Error fetching display:', error);
      setError('Failed to load display');
      // Clear invalid data
      localStorage.removeItem('displayId');
      localStorage.removeItem('pairingCode');
      setIsPaired(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePairing = async () => {
    if (!pairingCode.trim()) return;
    
    try {
      setLoading(true);
      console.log('Pairing with code:', pairingCode);
      await displayAPI.pairDisplay(pairingCode);
      localStorage.setItem('pairingCode', pairingCode);
      
      // Use the public endpoint to get display data
      const displayData = await displayAPI.getDisplayByPairingCode(pairingCode);
      console.log('Display data after pairing:', displayData);
      setDisplay(displayData);
      setIsPaired(true);
    } catch (error) {
      console.error('Error pairing display:', error);
      setError('Invalid pairing code');
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Show pairing form only if not paired and no display data
  if (!isPaired && !display) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold mb-4">YardSign</h1>
          <p className="text-2xl text-gray-400 mb-8">Digital Menu Board</p>
          
          <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-4">Pairing Mode</h2>
            <p className="text-lg text-gray-300 mb-6">
              Enter the pairing code from your dashboard to link this screen.
            </p>
            
            <div className="space-y-4">
              <input
                type="text"
                value={pairingCode}
                onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                placeholder="Enter pairing code"
                className="w-full px-4 py-3 text-center text-2xl font-mono bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={6}
                onKeyPress={(e) => e.key === 'Enter' && handlePairing()}
              />
              
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              
              <button
                onClick={handlePairing}
                disabled={!pairingCode.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Connect Display
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show error if no display data
  if (!display) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Display Not Found</h1>
          <p className="text-xl text-gray-400">Please check your pairing code</p>
          <button
            onClick={() => {
              localStorage.removeItem('pairingCode');
              setIsPaired(false);
              setDisplay(null);
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show the full display - this should be the main case when paired
  console.log('Rendering display:', display);
  console.log('Is paired:', isPaired);
  console.log('Current menu:', display.currentMenu);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative">
      {/* Display Name Overlay - Small, Non-intrusive */}
      <div className="absolute top-4 left-4 z-50 bg-black bg-opacity-60 rounded-lg px-4 py-2">
        <h1 className="text-lg font-bold">{display.name}</h1>
        <p className="text-xs text-gray-300">{new Date().toLocaleTimeString()}</p>
      </div>

      {/* Full Screen Content */}
      <div className="h-full w-full">
        {/* Media Display - Full Height */}
        {display.mediaUrl && (
          <div className="w-full h-full">
            {display.mediaType === 'image' ? (
              <img 
                src={`${API_BASE_URL}${display.mediaUrl}`} 
                alt="Display media"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Error loading image:', e);
                }}
              />
            ) : display.mediaType === 'video' ? (
              <video 
                src={`${API_BASE_URL}${display.mediaUrl}`} 
                autoPlay 
                loop 
                muted
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Error loading video:', e);
                }}
              />
            ) : null}
          </div>
        )}

        {/* Menu Content Area - Takes remaining height */}
        <div className="flex-1 w-full">
          {display.currentMenu ? (
            <div className="h-full w-full">
              <MenuViewer menu={display.currentMenu} />
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-600 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2">Display Ready</h2>
                <p className="text-xl text-gray-400">
                  Menu content will appear here when assigned
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MenuViewerProps {
  menu: Menu;
  hasMedia?: boolean;
}

function MenuViewer({ menu, hasMedia = false }: MenuViewerProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (menu.items && menu.items.length > 1) {
        setCurrentItemIndex((prev) => (prev + 1) % menu.items.length);
      }
    }, 5000); // Change item every 5 seconds

    return () => clearInterval(interval);
  }, [menu.items]);

  console.log('MenuViewer - Menu:', menu);
  console.log('MenuViewer - Items:', menu.items);

  if (!menu.items || menu.items.length === 0) {
    return (
      <div className={`h-full w-full flex items-center justify-center ${hasMedia ? 'bg-black bg-opacity-80' : ''}`}>
        <div className="text-center">
          <h2 className="text-6xl font-bold mb-4">{menu.name}</h2>
          {menu.description && (
            <p className="text-2xl text-gray-400 mb-8">{menu.description}</p>
          )}
          <p className="text-3xl text-gray-600">No items in this menu</p>
        </div>
      </div>
    );
  }

  const currentItem = menu.items[currentItemIndex];

  return (
    <div className={`h-full w-full flex flex-col ${hasMedia ? 'bg-black bg-opacity-70' : 'bg-black'}`}>
      {/* Menu Header - Compact */}
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl lg:text-6xl font-bold mb-2">{menu.name}</h1>
        {menu.description && (
          <p className="text-lg lg:text-2xl text-gray-300">{menu.description}</p>
        )}
      </div>

      {/* Current Item - Takes remaining space, FULL WIDTH */}
      <div className="flex-1 w-full flex items-center justify-center px-4 lg:px-8">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="bg-white text-black rounded-2xl shadow-2xl p-6 lg:p-12 w-full max-w-7xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-12">
            {/* Item Image */}
            {currentItem.imageUrl && (
              <div className="w-full lg:w-1/2">
                <img
                  src={`${API_BASE_URL}${currentItem.imageUrl}`}
                  alt={currentItem.name}
                  className="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* Item Details */}
            <div className={`w-full ${currentItem.imageUrl ? 'lg:w-1/2' : ''} text-center lg:text-left`}>
              <h2 className="text-4xl lg:text-6xl font-bold mb-4 lg:mb-6">{currentItem.name}</h2>
              {currentItem.description && (
                <p className="text-xl lg:text-3xl text-gray-600 mb-6 lg:mb-8 leading-relaxed">{currentItem.description}</p>
              )}
              
              {/* Price and Status */}
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                <div className="text-center lg:text-left">
                  <span className="text-5xl lg:text-6xl font-bold text-green-600">
                    ${currentItem.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-4">
                  <span className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full text-lg lg:text-xl font-medium">
                    {currentItem.category}
                  </span>
                  {currentItem.isAvailable ? (
                    <span className="px-6 py-3 bg-green-100 text-green-800 rounded-full text-lg lg:text-xl font-medium">
                      Available
                    </span>
                  ) : (
                    <span className="px-6 py-3 bg-red-100 text-red-800 rounded-full text-lg lg:text-xl font-medium">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Item Counter - Compact */}
      {menu.items.length > 1 && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center space-x-2">
            {menu.items.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentItemIndex ? 'bg-white' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-lg text-gray-400 mt-2">
            {currentItemIndex + 1} of {menu.items.length}
          </p>
        </div>
      )}
    </div>
  );
}