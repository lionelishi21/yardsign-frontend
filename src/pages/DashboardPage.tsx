import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface DashboardStats {
  totalMenus: number;
  totalItems: number;
  activeDisplays: number;
  onlineUsers: number;
  recentActivity: Array<{
    id: string;
    type: 'menu' | 'item' | 'display';
    action: string;
    timestamp: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMenus: 0,
    totalItems: 0,
    activeDisplays: 0,
    onlineUsers: 1,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In a real app, you'd have a dashboard API endpoint
      // For now, we'll simulate loading real data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalMenus: 12,
        totalItems: 87,
        activeDisplays: 5,
        onlineUsers: 3,
        recentActivity: [
          {
            id: '1',
            type: 'menu',
            action: 'Updated "Summer Specials" menu',
            timestamp: '2 minutes ago'
          },
          {
            id: '2',
            type: 'item',
            action: 'Added "Truffle Pasta" to menu',
            timestamp: '15 minutes ago'
          },
          {
            id: '3',
            type: 'display',
            action: 'Display "Kitchen Board" went online',
            timestamp: '1 hour ago'
          },
          {
            id: '4',
            type: 'menu',
            action: 'Created "Breakfast Menu"',
            timestamp: '2 hours ago'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Menus',
      value: stats.totalMenus,
      icon: '🍽️',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Menu Items',
      value: stats.totalItems,
      icon: '🍕',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Active Displays',
      value: stats.activeDisplays,
      icon: '📺',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Online Users',
      value: stats.onlineUsers,
      icon: '👥',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: 'Live',
      changeType: 'neutral'
    }
  ];

  const quickActions = [
    {
      title: 'Create Menu',
      description: 'Design a new menu for your restaurant',
      icon: '➕',
      action: () => window.location.href = '/admin/menus',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    },
    {
      title: 'Add Item',
      description: 'Add new dishes to your menus',
      icon: '🍕',
      action: () => window.location.href = '/admin/items',
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      title: 'Setup Display',
      description: 'Connect and configure a new screen',
      icon: '📺',
      action: () => window.location.href = '/admin/displays',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-blue-100 text-lg">Here's what's happening with your digital menu boards today</p>
          </motion.div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className="w-full h-full bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
                         <div className="flex items-center justify-between mb-4">
               <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                 <span className="text-2xl">{stat.icon}</span>
               </div>
              <div className={`text-sm px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'bg-green-100 text-green-600' : 
                stat.changeType === 'negative' ? 'bg-red-100 text-red-600' : 
                'bg-gray-100 text-gray-600'
              }`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {loading ? '...' : stat.value.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
                     <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
             <span className="text-2xl mr-2">🚀</span>
             Quick Actions
           </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                onClick={action.action}
                className="group p-6 rounded-xl border-2 border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className={`absolute inset-0 ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                                     <div className="p-3 bg-gray-100 group-hover:bg-white/20 rounded-lg w-fit mb-4 transition-colors duration-300">
                     <span className="text-2xl">{action.icon}</span>
                   </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors duration-300 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-white/80 transition-colors duration-300">
                    {action.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
                     <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
             <span className="text-xl mr-2">🕒</span>
             Recent Activity
           </h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                                 <div className={`p-2 rounded-lg ${
                   activity.type === 'menu' ? 'bg-blue-100' :
                   activity.type === 'item' ? 'bg-green-100' : 'bg-purple-100'
                 }`}>
                   <span className="text-lg">
                     {activity.type === 'menu' ? '🍽️' :
                      activity.type === 'item' ? '🍕' : '📺'}
                   </span>
                 </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            View all activity
          </motion.button>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
                 <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
           <span className="text-xl mr-2">👁️</span>
           Display Performance
         </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 mb-1">98.5%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600 mb-1">1.2s</div>
            <div className="text-sm text-gray-600">Avg Load Time</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Monitoring</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 