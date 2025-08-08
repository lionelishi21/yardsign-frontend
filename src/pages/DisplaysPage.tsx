import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { displayAPI, restaurantAPI, menuAPI } from '../services/api';
import type { Display, Menu } from '../types';
import { useAuth } from '../hooks/useAuth';

export default function DisplaysPage() {
  const { user } = useAuth();
  const [displays, setDisplays] = useState<Display[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [addingDisplay, setAddingDisplay] = useState(false);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);
  const [showAssignMenuModal, setShowAssignMenuModal] = useState(false);
  const [selectedDisplay, setSelectedDisplay] = useState<Display | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [assigningMenu, setAssigningMenu] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.restaurant) {
      fetchDisplays();
    }
  }, [user]);

  const fetchDisplays = async () => {
    if (!user?.restaurant) {
      console.log('No restaurant data available');
      return;
    }
    
    if (!user.restaurant.id) {
      setRestaurantError('Restaurant data not available. Please log out and log back in.');
      // Try to get restaurant data from the API
      try {
        const restaurant = await restaurantAPI.getMyRestaurant();
        
                         if (restaurant.id) {
                   setRestaurantError(null);
                   const displays = await displayAPI.getDisplays(restaurant.id);
                   console.log('Fetched displays (fallback):', displays);
                   setDisplays(displays);
        } else {
          setRestaurantError('Unable to load restaurant data. Please try logging out and back in.');
        }
              } catch {
          setRestaurantError('Unable to load restaurant data. Please try logging out and back in.');
        }
      return;
    }
    
                 try {
               setLoading(true);
               const displays = await displayAPI.getDisplays(user.restaurant.id);
               console.log('Fetched displays:', displays);
               setDisplays(displays);
    } catch (error) {
      console.error('Error fetching displays:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDisplay = async () => {
    if (!newDisplayName.trim() || !user?.restaurant) return;
    
    let restaurantId = user.restaurant.id;
    
    if (!restaurantId) {
      try {
        const restaurant = await restaurantAPI.getMyRestaurant();
        restaurantId = restaurant.id;
      } catch {
        setRestaurantError('Unable to load restaurant data. Please try logging out and back in.');
        return;
      }
    }
    
    try {
      setAddingDisplay(true);
      const newDisplay = await displayAPI.createDisplay(restaurantId, { name: newDisplayName });
      setDisplays(prev => [...prev, newDisplay]);
      setNewDisplayName('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding display:', error);
    } finally {
      setAddingDisplay(false);
    }
  };

  const handleDeleteDisplay = async (displayId: string) => {
    if (!confirm('Are you sure you want to delete this display?')) return;
    
    try {
      await displayAPI.deleteDisplay(displayId);
      setDisplays(prev => prev.filter(d => d.id !== displayId));
    } catch (error) {
      console.error('Error deleting display:', error);
    }
  };

  const handleRegeneratePairingCode = async (displayId: string) => {
    try {
      const response = await displayAPI.regeneratePairingCode(displayId);
      setDisplays(prev => prev.map(d => 
        d.id === displayId ? { ...d, pairingCode: response.pairingCode } : d
      ));
    } catch (error) {
      console.error('Error regenerating pairing code:', error);
    }
  };

  const openAssignMenuModal = async (display: Display) => {
    console.log('Opening assign menu modal for display:', display);
    setSelectedDisplay(display);
    setShowAssignMenuModal(true);
    
    try {
      console.log('Fetching menus...');
      let restaurantId = user?.restaurant?.id;
      if (!restaurantId) {
        const restaurant = await restaurantAPI.getMyRestaurant();
        restaurantId = restaurant.id;
      }
      console.log('Fetching menus for restaurant:', restaurantId);
      const fetchedMenus = await menuAPI.getMenus(restaurantId);
      console.log('Fetched menus:', fetchedMenus);
      console.log('Menu IDs:', fetchedMenus.map(m => ({ id: m.id, name: m.name })));
      setMenus(fetchedMenus);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setRestaurantError('Failed to load menus');
    }
  };

  const handleAssignMenu = async (menuId: string) => {
    if (!selectedDisplay) return;
    
    console.log('Assigning menu to display:', selectedDisplay.id, menuId);
    console.log('Selected display:', selectedDisplay);
    console.log('Menu ID:', menuId);
    console.log('Menu ID type:', typeof menuId);
    console.log('Menu ID length:', menuId?.length);
    
    try {
      setAssigningMenu(true);
      console.log('Calling displayAPI.assignMenu with:', { displayId: selectedDisplay.id, menuId });
      const result = await displayAPI.assignMenu(selectedDisplay.id, menuId);
      console.log('Assign menu result:', result);
      
      // Update the display with the new menu
      console.log('Fetching updated display...');
      const updatedDisplay = await displayAPI.getDisplay(selectedDisplay.id);
      console.log('Updated display:', updatedDisplay);
      
      setDisplays(prev => prev.map(d => 
        d.id === selectedDisplay.id ? updatedDisplay : d
      ));
      
      setShowAssignMenuModal(false);
      setSelectedDisplay(null);
    } catch (error) {
      console.error('Error assigning menu:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setAssigningMenu(false);
    }
  };

  const openMediaUploadModal = (display: Display) => {
    setSelectedDisplay(display);
    setShowMediaUpload(true);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDisplay) return;

    setUploadingMedia(true);
    try {
      console.log('Uploading media for display:', selectedDisplay.id, 'File:', file.name);
      const updatedDisplay = await displayAPI.uploadMedia(selectedDisplay.id, file);
      console.log('Upload successful, updated display:', updatedDisplay);
      setDisplays(prev => prev.map(d => 
        d.id === selectedDisplay.id ? updatedDisplay : d
      ));
      setShowMediaUpload(false);
      setSelectedDisplay(null);
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleRemoveMedia = async (displayId: string) => {
    try {
      const updatedDisplay = await displayAPI.removeMedia(displayId);
      setDisplays(prev => prev.map(d => 
        d.id === displayId ? updatedDisplay : d
      ));
    } catch (error) {
      console.error('Error removing media:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Displays</h1>
          <p className="text-gray-600 mt-2">Manage your digital displays</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Add Display
        </button>
      </div>

      {restaurantError ? (
        <div className="card">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Restaurant Data Error</h3>
            <p className="text-gray-600 mb-4">{restaurantError}</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="btn-primary"
            >
              Go to Login
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="card">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      ) : displays.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No displays yet</h3>
            <p className="text-gray-600 mb-4">Create your first display to get started</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Your First Display
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {displays.map((display) => (
              <motion.div
                key={display.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{display.name}</h3>
                    <p className="text-sm text-gray-600">Display ID: {display.id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${display.currentMenu ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-xs text-gray-500">
                      {display.currentMenu ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      Pairing Code
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {display.pairingCode}
                      </code>
                      <button
                        onClick={() => handleRegeneratePairingCode(display.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Regenerate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      Current Menu
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      {display.currentMenu ? display.currentMenu.name : 'No menu assigned'}
                    </p>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={() => openAssignMenuModal(display)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      Assign Menu
                    </button>
                    <button 
                      onClick={() => openMediaUploadModal(display)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Upload Media
                    </button>
                    <button 
                      onClick={() => handleDeleteDisplay(display.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  
                  {display.mediaUrl && (
                    <div className="mt-3">
                      <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                        Current Media
                      </label>
                      <div className="mt-1">
                        {display.mediaType === 'image' ? (
                          <img 
                            src={`http://localhost:3001${display.mediaUrl}`}
                            alt="Display media"
                            className="w-full h-24 object-cover rounded"
                            onError={() => console.error('Image failed to load:', display.mediaUrl)}
                            onLoad={() => console.log('Image loaded successfully:', display.mediaUrl)}
                          />
                        ) : (
                          <video 
                            src={`http://localhost:3001${display.mediaUrl}`}
                            className="w-full h-24 object-cover rounded"
                            controls
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Display Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Display</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="e.g., Main Entrance Display"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddDisplay()}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 btn-secondary"
                    disabled={addingDisplay}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDisplay}
                    disabled={!newDisplayName.trim() || addingDisplay}
                    className="flex-1 btn-primary"
                  >
                    {addingDisplay ? 'Adding...' : 'Add Display'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Menu Modal */}
      <AnimatePresence>
        {showAssignMenuModal && selectedDisplay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAssignMenuModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Assign Menu to {selectedDisplay.name}
              </h2>
              
              <div className="space-y-4">
                {menus.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">No menus available</p>
                    <p className="text-sm text-gray-500">
                      Create a menu first in the Menus section
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select a Menu
                    </label>
                    {menus.map((menu) => (
                      <button
                        key={menu.id}
                        onClick={() => handleAssignMenu(menu.id)}
                        disabled={assigningMenu}
                        className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <div className="font-medium text-gray-900">{menu.name}</div>
                        {menu.description && (
                          <div className="text-sm text-gray-600">{menu.description}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {menu.items?.length || 0} items
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAssignMenuModal(false)}
                    className="flex-1 btn-secondary"
                    disabled={assigningMenu}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Upload Modal */}
      <AnimatePresence>
        {showMediaUpload && selectedDisplay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowMediaUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload Media to {selectedDisplay.name}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Image or Video
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingMedia}
                    className="w-full btn-primary"
                  >
                    {uploadingMedia ? 'Uploading...' : 'Choose File'}
                  </button>
                </div>

                {selectedDisplay.mediaUrl && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Media
                    </label>
                    <div className="relative">
                      {selectedDisplay.mediaType === 'image' ? (
                        <img 
                          src={`http://localhost:3001${selectedDisplay.mediaUrl}`} 
                          alt="Display media"
                          className="w-full h-32 object-cover rounded"
                        />
                      ) : (
                        <video 
                          src={`http://localhost:3001${selectedDisplay.mediaUrl}`} 
                          className="w-full h-32 object-cover rounded"
                          controls
                        />
                      )}
                      <button
                        onClick={() => handleRemoveMedia(selectedDisplay.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowMediaUpload(false)}
                    className="flex-1 btn-secondary"
                    disabled={uploadingMedia}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 