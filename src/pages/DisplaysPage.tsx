import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { displayAPI, restaurantAPI, menuAPI } from '../services/api';
import type { Display, Menu } from '../types';
import { useAuth } from '../hooks/useAuth';
import DisplayScheduler from '../components/DisplayScheduler';

// SVG Icons
const DisplayIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const RegenerateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ScheduleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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
  const [showScheduler, setShowScheduler] = useState(false);
  const [schedulerDisplay, setSchedulerDisplay] = useState<Display | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.yaadsign.com';

  useEffect(() => {
    if (user?.restaurant) {
      fetchDisplays();
    }
  }, [user]);

  const fetchDisplays = async () => {
    if (!user?.restaurant) return;
    
    if (!user.restaurant.id) {
      setRestaurantError('Restaurant data not available. Please log out and log back in.');
      try {
        const restaurant = await restaurantAPI.getMyRestaurant();
        if (restaurant.id) {
          setRestaurantError(null);
          const displays = await displayAPI.getDisplays(restaurant.id);
          setDisplays(displays);
        }
      } catch {
        setRestaurantError('Unable to load restaurant data.');
      }
      return;
    }
    
    try {
      setLoading(true);
      const displays = await displayAPI.getDisplays(user.restaurant.id);
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
    setSelectedDisplay(display);
    setShowAssignMenuModal(true);
    
    try {
      let restaurantId = user?.restaurant?.id;
      if (!restaurantId) {
        const restaurant = await restaurantAPI.getMyRestaurant();
        restaurantId = restaurant.id;
      }
      const fetchedMenus = await menuAPI.getMenus(restaurantId);
      setMenus(fetchedMenus);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setRestaurantError('Failed to load menus');
    }
  };

  const handleAssignMenu = async (menuId: string) => {
    if (!selectedDisplay) return;
    
    try {
      setAssigningMenu(true);
      await displayAPI.assignMenu(selectedDisplay.id, menuId);
      const updatedDisplay = await displayAPI.getDisplay(selectedDisplay.id);
      
      setDisplays(prev => prev.map(d => 
        d.id === selectedDisplay.id ? updatedDisplay : d
      ));
      
      setShowAssignMenuModal(false);
      setSelectedDisplay(null);
    } catch (error) {
      console.error('Error assigning menu:', error);
    } finally {
      setAssigningMenu(false);
    }
  };

  // FIXED: Media upload functionality
  const openMediaUploadModal = (display: Display) => {
    setSelectedDisplay(display);
    setShowMediaUpload(true);
    
    // Reset file input to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDisplay) return;

    setUploadingMedia(true);
    try {
      const updatedDisplay = await displayAPI.uploadMedia(selectedDisplay.id, file);
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

  const openScheduler = (display: Display) => {
    setSchedulerDisplay(display);
    setShowScheduler(true);
  };

  const handleSchedulerUpdate = (updatedDisplay: Display) => {
    setDisplays(prev => prev.map(d => 
      d.id === updatedDisplay.id ? updatedDisplay : d
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-4"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <DisplayIcon />
            Displays
          </h1>
          <p className="text-gray-600 mt-2">Manage your digital displays</p>
        </div>
        <motion.button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow hover:shadow-md transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AddIcon />
          Add Display
        </motion.button>
      </div>

      {restaurantError ? (
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200">
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
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : displays.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center">
          <div className="text-gray-400 mb-4 mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <DisplayIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No displays yet</h3>
          <p className="text-gray-600 mb-4">Create your first display to get started</p>
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AddIcon />
            Add Your First Display
          </motion.button>
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
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{display.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">ID: {display.id.substring(0, 8)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${display.currentMenu ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-xs text-gray-500">
                        {display.currentMenu ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                          Pairing Code
                        </span>
                        <button
                          onClick={() => handleRegeneratePairingCode(display.id)}
                          className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800"
                        >
                          <RegenerateIcon />
                          Regenerate
                        </button>
                      </div>
                      <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-800">
                        {display.pairingCode}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1 block">
                        Current Menu
                      </label>
                      <p className={`text-sm ${display.currentMenu ? 'text-gray-800' : 'text-gray-500 italic'}`}>
                        {display.currentMenu ? display.currentMenu.name : 'No menu assigned'}
                      </p>
                    </div>

                    {display.mediaUrl && (
                      <div>
                        <label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1 block">
                          Current Media
                        </label>
                        <div className="relative group">
                          {display.mediaType === 'image' ? (
                            <img 
                              src={`${API_BASE_URL}${display.mediaUrl}`}
                              alt="Display media"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <video 
                              src={`${API_BASE_URL}${display.mediaUrl}`}
                              className="w-full h-32 object-cover rounded-lg"
                              controls
                            />
                          )}
                          <button
                            onClick={() => handleRemoveMedia(display.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <CloseIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      onClick={() => openAssignMenuModal(display)}
                      className="flex items-center gap-1 text-xs px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                      whileHover={{ y: -2 }}
                    >
                      <MenuIcon />
                      Assign Menu
                    </motion.button>
                    
                    <motion.button
                      onClick={() => openMediaUploadModal(display)}
                      className="flex items-center gap-1 text-xs px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      whileHover={{ y: -2 }}
                    >
                      <UploadIcon />
                      Upload Media
                    </motion.button>
                    
                    <motion.button
                      onClick={() => openScheduler(display)}
                      className="flex items-center gap-1 text-xs px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      whileHover={{ y: -2 }}
                    >
                      <ScheduleIcon />
                      Schedule
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleDeleteDisplay(display.id)}
                      className="flex items-center gap-1 text-xs px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      whileHover={{ y: -2 }}
                    >
                      <DeleteIcon />
                      Delete
                    </motion.button>
                  </div>
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Display</h2>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <CloseIcon />
                  </button>
                </div>
                
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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddDisplay()}
                    />
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 btn-secondary rounded-xl"
                      disabled={addingDisplay}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddDisplay}
                      disabled={!newDisplayName.trim() || addingDisplay}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow py-3 px-4 hover:shadow-md transition-shadow disabled:opacity-70"
                    >
                      {addingDisplay ? 'Adding...' : 'Add Display'}
                    </button>
                  </div>
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Assign Menu to {selectedDisplay.name}
                  </h2>
                  <button 
                    onClick={() => setShowAssignMenuModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <CloseIcon />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {menus.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">No menus available</p>
                      <p className="text-sm text-gray-500">
                        Create a menu first in the Menus section
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {menus.map((menu) => (
                        <motion.button
                          key={menu.id}
                          onClick={() => handleAssignMenu(menu.id)}
                          disabled={assigningMenu}
                          className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                          whileHover={{ y: -2 }}
                        >
                          <div className="font-medium text-gray-900">{menu.name}</div>
                          {menu.description && (
                            <div className="text-sm text-gray-600 mt-1">{menu.description}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-2">
                            {menu.items?.length || 0} items
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Upload Media to {selectedDisplay.name}
                  </h2>
                  <button 
                    onClick={() => setShowMediaUpload(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <CloseIcon />
                  </button>
                </div>
                
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
                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingMedia}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow hover:shadow-md transition-all disabled:opacity-70"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <UploadIcon />
                      {uploadingMedia ? 'Uploading...' : 'Choose File'}
                    </motion.button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Supported formats: JPG, PNG, MP4, MOV
                    </p>
                  </div>

                  {selectedDisplay.mediaUrl && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Current Media
                      </label>
                      <div className="relative">
                        {selectedDisplay.mediaType === 'image' ? (
                          <img 
                            src={`${API_BASE_URL}${selectedDisplay.mediaUrl}`} 
                            alt="Display media"
                            className="w-full h-48 object-cover rounded-xl"
                          />
                        ) : (
                          <video 
                            src={`${API_BASE_URL}${selectedDisplay.mediaUrl}`} 
                            className="w-full h-48 object-cover rounded-xl"
                            controls
                          />
                        )}
                        <button
                          onClick={() => handleRemoveMedia(selectedDisplay.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Display Scheduler Modal */}
      <AnimatePresence>
        {showScheduler && schedulerDisplay && (
          <DisplayScheduler
            display={schedulerDisplay}
            isOpen={showScheduler}
            onClose={() => {
              setShowScheduler(false);
              setSchedulerDisplay(null);
            }}
            onUpdate={handleSchedulerUpdate}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}