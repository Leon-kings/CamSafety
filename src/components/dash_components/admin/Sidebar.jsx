import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Dashboard as DashboardIcon,
  ShoppingCart,
  Message,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const navItems = [
  { name: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  { name: 'Orders', icon: <ShoppingCart />, href: '/orders' },
  { name: 'Messages', icon: <Message />, href: '/messages' },
  { name: 'Reports', icon: <BarChartIcon />, href: '/reports' },
  { name: 'Users', icon: <PeopleIcon />, href: '/users' },
  { name: 'Settings', icon: <SettingsIcon />, href: '/settings' }
];

export const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static z-30 ${sidebarOpen ? 'w-64' : 'w-20'} h-full bg-blue-800 text-white transition-all duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-64'} lg:translate-x-0`}>
        
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          {sidebarOpen && <h3 className="text-xl font-semibold">SafetyVision</h3>}
          <button 
            onClick={toggleSidebar} 
            className="text-white hover:text-blue-200 hidden lg:block"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.href} 
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-700 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <span className={sidebarOpen ? 'mr-3' : ''}>{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile menu button to be placed in your header */}
      <button 
        onClick={toggleMobileSidebar}
        className="lg:hidden text-gray-500 hover:text-gray-700 fixed top-4 left-4 z-10"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>
    </>
  );
};