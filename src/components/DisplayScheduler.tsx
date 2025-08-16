import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { displayAPI, menuAPI } from '../services/api';
import type { Display, Menu, MediaItem, ScheduledContent, ScheduleConfig } from '../types';

// SVG Icons
const ScheduleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CloseIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const MediaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

interface DisplaySchedulerProps {
  display: Display;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (display: Display) => void;
}

export default function DisplayScheduler({ display, isOpen, onClose, onUpdate }: DisplaySchedulerProps) {
  const [activeTab, setActiveTab] = useState<'media' | 'schedule'>('media');
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New schedule form state
  const [newSchedule, setNewSchedule] = useState<{
    contentType: 'menu' | 'media';
    menuId?: string;
    selectedMedia: MediaItem[];
    scheduleType: 'always' | 'time_range' | 'recurring';
    startTime?: string;
    endTime?: string;
    daysOfWeek: string[];
    startDate?: string;
    endDate?: string;
    priority: number;
  }>({
    contentType: 'menu',
    selectedMedia: [],
    scheduleType: 'always',
    daysOfWeek: [],
    priority: 0
  });

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, display.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load menus
      const restaurantId = display.id; // This might need to be adjusted based on your data structure
      try {
        const menusData = await menuAPI.getMenus(restaurantId);
        setMenus(menusData);
      } catch (error) {
        console.warn('Could not load menus:', error);
        setMenus([]);
      }

      // Load scheduled content
      try {
        const scheduleData = await displayAPI.getScheduledContent(display.id);
        setScheduledContent(scheduleData.scheduledContent);
      } catch (error) {
        console.warn('Could not load scheduled content:', error);
        setScheduledContent([]);
      }

    } catch (error) {
      console.error('Error loading scheduler data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const result = await displayAPI.uploadScheduledMedia(display.id, files);
      setUploadedMedia(prev => [...prev, ...result.mediaItems]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCreateSchedule = async () => {
    try {
      const content = newSchedule.contentType === 'menu' 
        ? { type: 'menu' as const, menuId: newSchedule.menuId }
        : { type: 'media' as const, mediaItems: newSchedule.selectedMedia };

      const schedule: ScheduleConfig = {
        type: newSchedule.scheduleType,
        ...(newSchedule.startTime && { startTime: newSchedule.startTime }),
        ...(newSchedule.endTime && { endTime: newSchedule.endTime }),
        ...(newSchedule.daysOfWeek.length > 0 && { daysOfWeek: newSchedule.daysOfWeek as any }),
        ...(newSchedule.startDate && { startDate: newSchedule.startDate }),
        ...(newSchedule.endDate && { endDate: newSchedule.endDate }),
      };

      const newItem = await displayAPI.addScheduledContent(display.id, content, schedule, newSchedule.priority);
      setScheduledContent(prev => [...prev, newItem]);

      // Reset form
      setNewSchedule({
        contentType: 'menu',
        selectedMedia: [],
        scheduleType: 'always',
        daysOfWeek: [],
        priority: 0
      });

      setActiveTab('schedule');
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleDeleteSchedule = async (itemId: string) => {
    try {
      await displayAPI.deleteScheduledContent(display.id, itemId);
      setScheduledContent(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const formatScheduleDisplay = (schedule: ScheduleConfig) => {
    if (schedule.type === 'always') return 'Always active';
    
    if (schedule.type === 'time_range') {
      const parts = [];
      if (schedule.startTime && schedule.endTime) {
        parts.push(`${schedule.startTime} - ${schedule.endTime}`);
      }
      if (schedule.startDate && schedule.endDate) {
        parts.push(`${schedule.startDate} to ${schedule.endDate}`);
      }
      return parts.join(', ') || 'Time range';
    }
    
    if (schedule.type === 'recurring') {
      const parts = [];
      if (schedule.daysOfWeek?.length) {
        parts.push(schedule.daysOfWeek.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', '));
      }
      if (schedule.startTime && schedule.endTime) {
        parts.push(`${schedule.startTime} - ${schedule.endTime}`);
      }
      return parts.join(' ') || 'Recurring';
    }

    return 'Custom schedule';
  };

  if (!isOpen) return null;

  return (
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
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ScheduleIcon />
                Schedule Content for {display.name}
              </h2>
              <p className="text-gray-600 text-sm mt-1">Upload media and create schedules for your display</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('media')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'media'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Media Upload
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Schedule Manager
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : activeTab === 'media' ? (
              <div className="space-y-6">
                {/* Upload Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Media Files</h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow hover:shadow-md transition-all disabled:opacity-70 border-2 border-dashed border-transparent hover:border-white/20"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <UploadIcon />
                    {uploading ? 'Uploading...' : 'Choose Multiple Files'}
                  </motion.button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Supported formats: JPG, PNG, MP4, MOV (up to 50MB each)
                  </p>
                </div>

                {/* Uploaded Media Grid */}
                {uploadedMedia.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Uploaded Media ({uploadedMedia.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uploadedMedia.map((media, index) => (
                        <div key={index} className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                          {media.type === 'image' ? (
                            <img 
                              src={`https://api.yaadsign.com${media.url}`} 
                              alt={media.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video 
                              src={`https://api.yaadsign.com${media.url}`} 
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                            <p className="text-xs truncate">{media.name}</p>
                            <p className="text-xs opacity-80">{media.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Create Schedule Form */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Schedule</h3>
                  
                  <div className="space-y-4">
                    {/* Content Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setNewSchedule(prev => ({ ...prev, contentType: 'menu' }))}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                            newSchedule.contentType === 'menu'
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <MenuIcon />
                          Menu
                        </button>
                        <button
                          onClick={() => setNewSchedule(prev => ({ ...prev, contentType: 'media' }))}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                            newSchedule.contentType === 'media'
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <MediaIcon />
                          Media
                        </button>
                      </div>
                    </div>

                    {/* Content Selection */}
                    {newSchedule.contentType === 'menu' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Menu</label>
                        <select
                          value={newSchedule.menuId || ''}
                          onChange={(e) => setNewSchedule(prev => ({ ...prev, menuId: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Choose a menu...</option>
                          {menus.map(menu => (
                            <option key={menu.id} value={menu.id}>{menu.name}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Media Files</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                          {uploadedMedia.map((media, index) => (
                            <label key={index} className="relative cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newSchedule.selectedMedia.some(m => m.url === media.url)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewSchedule(prev => ({
                                      ...prev,
                                      selectedMedia: [...prev.selectedMedia, media]
                                    }));
                                  } else {
                                    setNewSchedule(prev => ({
                                      ...prev,
                                      selectedMedia: prev.selectedMedia.filter(m => m.url !== media.url)
                                    }));
                                  }
                                }}
                                className="absolute top-2 left-2 z-10"
                              />
                              <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                                {media.type === 'image' ? (
                                  <img 
                                    src={`https://api.yaadsign.com${media.url}`} 
                                    alt={media.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <video 
                                    src={`https://api.yaadsign.com${media.url}`} 
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Schedule Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Type</label>
                      <select
                        value={newSchedule.scheduleType}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, scheduleType: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="always">Always Active</option>
                        <option value="time_range">Time Range</option>
                        <option value="recurring">Recurring Schedule</option>
                      </select>
                    </div>

                    {/* Schedule Configuration */}
                    {newSchedule.scheduleType === 'time_range' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={newSchedule.startTime || ''}
                            onChange={(e) => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                          <input
                            type="time"
                            value={newSchedule.endTime || ''}
                            onChange={(e) => setNewSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    )}

                    {newSchedule.scheduleType === 'recurring' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {daysOfWeek.map(day => (
                            <label key={day} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={newSchedule.daysOfWeek.includes(day)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewSchedule(prev => ({
                                      ...prev,
                                      daysOfWeek: [...prev.daysOfWeek, day]
                                    }));
                                  } else {
                                    setNewSchedule(prev => ({
                                      ...prev,
                                      daysOfWeek: prev.daysOfWeek.filter(d => d !== day)
                                    }));
                                  }
                                }}
                                className="mr-2"
                              />
                              <span className="text-sm capitalize">{day.slice(0, 3)}</span>
                            </label>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                              type="time"
                              value={newSchedule.startTime || ''}
                              onChange={(e) => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <input
                              type="time"
                              value={newSchedule.endTime || ''}
                              onChange={(e) => setNewSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority (0-10)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={newSchedule.priority}
                        onChange={(e) => setNewSchedule(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Higher numbers = higher priority"
                      />
                    </div>

                    {/* Create Button */}
                    <button
                      onClick={handleCreateSchedule}
                      disabled={
                        (newSchedule.contentType === 'menu' && !newSchedule.menuId) ||
                        (newSchedule.contentType === 'media' && newSchedule.selectedMedia.length === 0)
                      }
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-xl shadow hover:shadow-md transition-all disabled:opacity-50"
                    >
                      Create Schedule
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Scheduled Content</h3>
                
                {scheduledContent.length === 0 ? (
                  <div className="text-center py-8">
                    <ScheduleIcon />
                    <p className="text-gray-600 mt-2">No scheduled content yet</p>
                    <p className="text-sm text-gray-500">Create your first schedule in the Media Upload tab</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scheduledContent.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {item.content.type === 'menu' ? <MenuIcon /> : <MediaIcon />}
                              <span className="font-medium">
                                {item.content.type === 'menu' ? 'Menu Content' : 'Media Content'}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {item.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Priority: {item.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {formatScheduleDisplay(item.schedule)}
                            </p>
                            {item.content.type === 'media' && item.content.mediaItems && (
                              <p className="text-xs text-gray-500">
                                {item.content.mediaItems.length} media file(s)
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteSchedule(item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 