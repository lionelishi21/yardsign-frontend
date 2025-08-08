import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Menu } from '../types';

interface MenuEditorProps {
  menu: Menu;
  onSave: (updatedMenu: Menu) => void;
  onCancel: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  isAvailable: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function MenuEditor({ menu, onSave, onCancel }: MenuEditorProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    menu.items.map((item, index) => ({
      ...item,
      position: { x: 50 + (index % 2) * 300, y: 100 + Math.floor(index / 2) * 200 },
      size: { width: 250, height: 150 },
      zIndex: index
    }))
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setSelectedItem(itemId);
    e.dataTransfer.setData('text/plain', itemId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMenuItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, position: { x, y } }
        : item
    ));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleItemClick = useCallback((itemId: string) => {
    setSelectedItem(selectedItem === itemId ? null : itemId);
  }, [selectedItem]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedItem) return;

    console.log('Uploading image for item:', selectedItem, 'File:', file.name);
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Present' : 'Missing');

      const response = await fetch(`/api/items/${selectedItem}/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Upload response status:', response.status);
      
      if (response.ok) {
        const { imageUrl } = await response.json();
        console.log('Upload successful, imageUrl:', imageUrl);
        setMenuItems(prev => prev.map(item => 
          item.id === selectedItem 
            ? { ...item, imageUrl }
            : item
        ));
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData.error);
        alert('Failed to upload image: ' + errorData.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      setShowImageUpload(false);
    }
  };

  const handleSave = () => {
    console.log('MenuEditor - Original menu:', menu);
    console.log('MenuEditor - Menu items:', menuItems);
    
    const updatedMenu: Menu = {
      ...menu,
      items: menuItems.map((item) => {
        const { position, size, zIndex, ...itemData } = item;
        return {
          ...itemData,
          createdAt: itemData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      })
    };
    
    console.log('MenuEditor - Updated menu to save:', updatedMenu);
    onSave(updatedMenu);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Menu Editor</h2>
            <p className="text-gray-600">Drag items to position them on your menu</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowImageUpload(true)}
              className="btn-secondary"
              disabled={!selectedItem}
            >
              Upload Image
            </button>
            <button onClick={handleSave} className="btn-primary">
              Save Menu
            </button>
            <button onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          className="flex-1 relative bg-gray-50 overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              drag
              dragMomentum={false}
              dragElastic={0.1}
              dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragEnd={handleDragEnd}
                             onClick={(e) => {
                 e.stopPropagation();
                 handleItemClick(item.id);
               }}
              className={`absolute cursor-move p-4 bg-white rounded-lg shadow-lg border-2 ${
                selectedItem === item.id 
                  ? 'border-blue-500' 
                  : 'border-transparent'
              }`}
              style={{
                left: item.position.x,
                top: item.position.y,
                width: item.size.width,
                height: item.size.height,
                zIndex: selectedItem === item.id ? 1000 : item.zIndex
              }}
            >
              <div className="flex flex-col h-full">
                {item.imageUrl && (
                  <div className="w-full h-20 mb-2 rounded overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">
                    {item.description}
                  </p>
                  <p className="text-sm font-bold text-green-600">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    item.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="text-xs text-gray-500">{item.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Upload Modal */}
        <AnimatePresence>
          {showImageUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg p-6 w-96"
              >
                <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="space-y-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full btn-primary"
                  >
                    {uploadingImage ? 'Uploading...' : 'Choose Image'}
                  </button>
                  <button
                    onClick={() => setShowImageUpload(false)}
                    className="w-full btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 