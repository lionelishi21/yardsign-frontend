import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.tsx';
import icon from '../assets/yaadsign-icon.png';

// SVG Icons Components
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const ItemsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm-2 4a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
  </svg>
);

const DisplayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/admin/menus', label: 'Menus', icon: <MenuIcon /> },
  { path: '/admin/items', label: 'Items', icon: <ItemsIcon /> },
  { path: '/admin/displays', label: 'Displays', icon: <DisplayIcon /> },
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 flex flex-col">
      {/* Glassmorphic Sidebar */}
      <motion.aside 
        className="flex-1 flex flex-col p-4 bg-white/90 backdrop-blur-lg shadow-xl border-r border-gray-200"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Brand Section */}
        {/* Logo and iconn should be in the same line */}
        <div className="mb-10 p-4"> 
          <div className="flex items-center space-x-2">
            <img src={icon} alt="YardSign Logo" className="h-10 w-10 rounded-2xl overflow-hidden" /> 
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              YaadSign
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Digital Menu Board</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-50 to-red-50 text-red-600 border-l-4 border-red-500 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <span className={`mr-3 ${item.path.includes('dashboard') ? 'text-red-500' : 'text-orange-500'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              <div className="ml-auto w-2 h-2 rounded-full bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="px-4 py-2">
            <p className="font-medium text-gray-900 truncate">{user?.restaurant?.name}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
          
          <motion.button
            onClick={logout}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow hover:shadow-md transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </motion.button>
        </div>
      </motion.aside>
    </div>
  );
}