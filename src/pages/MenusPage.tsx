import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuAPI } from '../services/api';
import type { Menu } from '../types';
import { useAuth } from '../hooks/useAuth';
import MenuEditor from '../components/MenuEditor';

export default function MenusPage() {
  const { user } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuDescription, setNewMenuDescription] = useState('');
  const [addingMenu, setAddingMenu] = useState(false);
  const [updatingMenu, setUpdatingMenu] = useState(false);
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [editingMenuForVisual, setEditingMenuForVisual] = useState<Menu | null>(null);

  useEffect(() => {
    if (user?.restaurant) {
      fetchMenus();
    }
  }, [user]);

  const fetchMenus = async () => {
    if (!user?.restaurant) return;
    
    let restaurantId = user.restaurant.id;
    
    if (!restaurantId) {
      try {
        const restaurant = await fetch('/api/restaurants/my/restaurant', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json());
        restaurantId = restaurant.id;
      } catch (error) {
        console.error('Error getting restaurant data:', error);
        return;
      }
    }
    
    try {
      setLoading(true);
      const menus = await menuAPI.getMenus(restaurantId);
      setMenus(menus);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = async () => {
    if (!newMenuName.trim() || !user?.restaurant) return;
    
    let restaurantId = user.restaurant.id;
    
    if (!restaurantId) {
      try {
        const restaurant = await fetch('/api/restaurants/my/restaurant', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json());
        restaurantId = restaurant.id;
      } catch (error) {
        console.error('Error getting restaurant data:', error);
        return;
      }
    }
    
    try {
      setAddingMenu(true);
      const newMenu = await menuAPI.createMenu(restaurantId, { 
        name: newMenuName,
        description: newMenuDescription 
      });
      setMenus(prev => [...prev, newMenu]);
      setNewMenuName('');
      setNewMenuDescription('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding menu:', error);
    } finally {
      setAddingMenu(false);
    }
  };

  const handleEditMenu = async () => {
    if (!editingMenu || !newMenuName.trim()) return;
    
    try {
      setUpdatingMenu(true);
      const updatedMenu = await menuAPI.updateMenu(editingMenu.id, {
        name: newMenuName,
        description: newMenuDescription
      });
      setMenus(prev => prev.map(m => m.id === editingMenu.id ? updatedMenu : m));
      setNewMenuName('');
      setNewMenuDescription('');
      setEditingMenu(null);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating menu:', error);
    } finally {
      setUpdatingMenu(false);
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;
    
    try {
      await menuAPI.deleteMenu(menuId);
      setMenus(prev => prev.filter(m => m.id !== menuId));
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  const openEditModal = (menu: Menu) => {
    setEditingMenu(menu);
    setNewMenuName(menu.name);
    setNewMenuDescription(menu.description || '');
    setShowEditModal(true);
  };

  const openVisualEditor = (menu: Menu) => {
    setEditingMenuForVisual(menu);
    setShowVisualEditor(true);
  };

  const handleVisualEditorSave = async (updatedMenu: Menu) => {
    try {
      console.log('Saving menu:', updatedMenu);
      
      if (!updatedMenu.id) {
        console.error('Menu ID is undefined');
        alert('Error: Menu ID is missing. Please try again.');
        return;
      }
      
      const savedMenu = await menuAPI.updateMenu(updatedMenu.id, {
        name: updatedMenu.name,
        description: updatedMenu.description,
        items: updatedMenu.items.map(item => item.id)
      });
      setMenus(prev => prev.map(m => m.id === updatedMenu.id ? savedMenu : m));
      setShowVisualEditor(false);
      setEditingMenuForVisual(null);
    } catch (error) {
      console.error('Error saving menu:', error);
      alert('Failed to save menu. Please try again.');
    }
  };

  const handleVisualEditorCancel = () => {
    setShowVisualEditor(false);
    setEditingMenuForVisual(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menus</h1>
          <p className="text-gray-600 mt-2">Manage your restaurant menus</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Create Menu
        </button>
      </div>

      {loading ? (
        <div className="card">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      ) : menus.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menus yet</h3>
            <p className="text-gray-600 mb-4">Create your first menu to get started</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Create Your First Menu
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {menus.map((menu) => (
              <motion.div
                key={menu.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{menu.name}</h3>
                    <p className="text-sm text-gray-600">{menu.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {menu.items?.length || 0} items
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      Menu ID
                    </label>
                    <p className="text-sm text-gray-600 mt-1 font-mono">{menu.id}</p>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={() => openVisualEditor(menu)}
                      className="flex-1 btn-primary text-sm"
                    >
                      Visual Editor
                    </button>
                    <button 
                      onClick={() => openEditModal(menu)}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteMenu(menu.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Menu Modal */}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Menu</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu Name
                  </label>
                  <input
                    type="text"
                    value={newMenuName}
                    onChange={(e) => setNewMenuName(e.target.value)}
                    placeholder="e.g., Lunch Menu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMenu()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newMenuDescription}
                    onChange={(e) => setNewMenuDescription(e.target.value)}
                    placeholder="Describe your menu..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 btn-secondary"
                    disabled={addingMenu}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMenu}
                    disabled={!newMenuName.trim() || addingMenu}
                    className="flex-1 btn-primary"
                  >
                    {addingMenu ? 'Creating...' : 'Create Menu'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Menu Modal */}
      <AnimatePresence>
        {showEditModal && editingMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Menu</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu Name
                  </label>
                  <input
                    type="text"
                    value={newMenuName}
                    onChange={(e) => setNewMenuName(e.target.value)}
                    placeholder="e.g., Lunch Menu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleEditMenu()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newMenuDescription}
                    onChange={(e) => setNewMenuDescription(e.target.value)}
                    placeholder="Describe your menu..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 btn-secondary"
                    disabled={updatingMenu}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditMenu}
                    disabled={!newMenuName.trim() || updatingMenu}
                    className="flex-1 btn-primary"
                  >
                    {updatingMenu ? 'Updating...' : 'Update Menu'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Menu Editor */}
      <AnimatePresence>
        {showVisualEditor && editingMenuForVisual && (
          <MenuEditor
            menu={editingMenuForVisual}
            onSave={handleVisualEditorSave}
            onCancel={handleVisualEditorCancel}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
} 