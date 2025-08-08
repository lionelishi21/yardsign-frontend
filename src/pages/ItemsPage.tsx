import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { itemAPI } from '../services/api';
import type { Item } from '../types';
import { useAuth } from '../hooks/useAuth';

export default function ItemsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemImageUrl, setNewItemImageUrl] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(false);

  useEffect(() => {
    if (user?.restaurant) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
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
      const items = await itemAPI.getItems(restaurantId);
      setItems(items);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !newItemPrice || !newItemCategory || !user?.restaurant) return;
    
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
      setAddingItem(true);
      const newItem = await itemAPI.createItem(restaurantId, {
        name: newItemName,
        description: newItemDescription,
        price: parseFloat(newItemPrice),
        category: newItemCategory,
        imageUrl: newItemImageUrl || undefined,
        isAvailable: true
      });
      setItems(prev => [...prev, newItem]);
      resetForm();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setAddingItem(false);
    }
  };

  const handleEditItem = async () => {
    if (!editingItem || !newItemName.trim() || !newItemPrice || !newItemCategory) return;
    
    try {
      setUpdatingItem(true);
      const updatedItem = await itemAPI.updateItem(editingItem.id, {
        name: newItemName,
        description: newItemDescription,
        price: parseFloat(newItemPrice),
        category: newItemCategory,
        imageUrl: newItemImageUrl || undefined
      });
      setItems(prev => prev.map(i => i.id === editingItem.id ? updatedItem : i));
      resetForm();
      setEditingItem(null);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setUpdatingItem(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await itemAPI.deleteItem(itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleAvailability = async (itemId: string) => {
    try {
      const updatedItem = await itemAPI.toggleItemAvailability(itemId);
      setItems(prev => prev.map(i => i.id === itemId ? updatedItem : i));
    } catch (error) {
      console.error('Error toggling item availability:', error);
    }
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemDescription(item.description || '');
    setNewItemPrice(item.price.toString());
    setNewItemCategory(item.category);
    setNewItemImageUrl(item.imageUrl || '');
    setShowEditModal(true);
  };

  const resetForm = () => {
    setNewItemName('');
    setNewItemDescription('');
    setNewItemPrice('');
    setNewItemCategory('');
    setNewItemImageUrl('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Items</h1>
          <p className="text-gray-600 mt-2">Manage your menu items</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Add Item
        </button>
      </div>

      {loading ? (
        <div className="card">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-600 mb-4">Create your first item to get started</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Your First Item
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-gray-500">
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {item.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Price</span>
                    <span className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">Category</span>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleToggleAvailability(item.id)}
                      className={`flex-1 text-sm px-3 py-1 rounded-md transition-colors ${
                        item.isAvailable 
                          ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50' 
                          : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                      }`}
                    >
                      {item.isAvailable ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
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

      {/* Add Item Modal */}
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
              className="card max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Item</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g., Classic Burger"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    placeholder="Describe your item..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    placeholder="e.g., Burgers, Drinks, Desserts"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newItemImageUrl}
                    onChange={(e) => setNewItemImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 btn-secondary"
                    disabled={addingItem}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddItem}
                    disabled={!newItemName.trim() || !newItemPrice || !newItemCategory || addingItem}
                    className="flex-1 btn-primary"
                  >
                    {addingItem ? 'Adding...' : 'Add Item'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Item Modal */}
      <AnimatePresence>
        {showEditModal && editingItem && (
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
              className="card max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Item</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g., Classic Burger"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    placeholder="Describe your item..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    placeholder="e.g., Burgers, Drinks, Desserts"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newItemImageUrl}
                    onChange={(e) => setNewItemImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 btn-secondary"
                    disabled={updatingItem}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditItem}
                    disabled={!newItemName.trim() || !newItemPrice || !newItemCategory || updatingItem}
                    className="flex-1 btn-primary"
                  >
                    {updatingItem ? 'Updating...' : 'Update Item'}
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