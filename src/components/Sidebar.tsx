import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.tsx';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/menus', label: 'Menus', icon: '🍽️' },
  { path: '/items', label: 'Items', icon: '🍕' },
  { path: '/displays', label: 'Displays', icon: '📺' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <motion.aside
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      className="sidebar"
    >
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">YardSign</h1>
          <p className="text-sm text-gray-600 mt-1">Digital Menu Board</p>
        </motion.div>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-auto pt-8"
        >
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              {user?.restaurant?.name}
            </p>
            <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
          </div>
          
          <button
            onClick={logout}
            className="w-full mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </motion.aside>
  );
} 