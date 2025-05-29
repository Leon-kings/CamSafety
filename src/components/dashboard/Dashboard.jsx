/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiActivity, 
  FiUsers, 
  FiDollarSign, 
  FiPackage,
  FiCalendar,
  FiAlertCircle,
  FiBarChart2,
  FiPlus
} from 'react-icons/fi';
import { BarChart, PieChart } from '../dash_components/admin/ChartComponents'; // Custom chart components

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls
        const statsResponse = await fetch('/api/dashboard/stats');
        const activityResponse = await fetch('/api/dashboard/activity');
        
        const statsData = await statsResponse.json();
        const activityData = await activityResponse.json();
        
        setStats(statsData);
        setRecentActivity(activityData);
        toast.success('Dashboard data loaded!');
      } catch (error) {
        toast.error('Failed to load dashboard data',error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuickAction = (action) => {
    toast.info(`Performing ${action}...`);
    // Add actual action logic here
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard 
            icon={<FiUsers className="text-blue-500" size={24} />}
            title="Total Users"
            value={stats?.users || 0}
            change="+12%"
            isPositive={true}
          />
          <StatCard 
            icon={<FiDollarSign className="text-green-500" size={24} />}
            title="Revenue"
            value={`$${(stats?.revenue || 0).toLocaleString()}`}
            change="+8.2%"
            isPositive={true}
          />
          <StatCard 
            icon={<FiPackage className="text-orange-500" size={24} />}
            title="Orders"
            value={stats?.orders || 0}
            change="-3.1%"
            isPositive={false}
          />
          <StatCard 
            icon={<FiActivity className="text-purple-500" size={24} />}
            title="Active Now"
            value={stats?.activeUsers || 0}
            change="+4.5%"
            isPositive={true}
          />
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Revenue Overview</h2>
              <select className="bg-gray-100 rounded px-3 py-1 text-sm">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            <BarChart data={stats?.revenueData} />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
            <PieChart data={stats?.trafficData} />
          </div>
        </motion.div>

        {/* Quick Actions & Activity Feed */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-xl shadow lg:col-span-1"
          >
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <QuickActionButton 
                icon={<FiPlus />}
                text="Add New User"
                onClick={() => handleQuickAction('add user')}
                color="bg-blue-100 text-blue-600"
              />
              <QuickActionButton 
                icon={<FiCalendar />}
                text="Create Event"
                onClick={() => handleQuickAction('create event')}
                color="bg-purple-100 text-purple-600"
              />
              <QuickActionButton 
                icon={<FiAlertCircle />}
                text="Report Issue"
                onClick={() => handleQuickAction('report issue')}
                color="bg-red-100 text-red-600"
              />
              <QuickActionButton 
                icon={<FiBarChart2 />}
                text="Generate Report"
                onClick={() => handleQuickAction('generate report')}
                color="bg-green-100 text-green-600"
              />
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-xl shadow lg:col-span-2"
          >
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <ActivityItem 
                  key={index}
                  type={activity.type}
                  user={activity.user}
                  action={activity.action}
                  time={activity.time}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

// Reusable Components
const StatCard = ({ icon, title, value, change, isPositive }) => (
  <motion.div 
   
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow"
  >
    <div className="flex justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="bg-gray-100 p-3 rounded-lg">
        {icon}
      </div>
    </div>
    <p className={`mt-3 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {change} from last week
    </p>
  </motion.div>
);

const QuickActionButton = ({ icon, text, onClick, color }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center space-x-2 w-full p-3 rounded-lg ${color} transition-colors`}
  >
    {icon}
    <span>{text}</span>
  </motion.button>
);

const ActivityItem = ({ type, user, action, time }) => {
  const getIcon = () => {
    switch (type) {
      case 'user': return <FiUsers className="text-blue-500" />;
      case 'order': return <FiPackage className="text-orange-500" />;
      case 'payment': return <FiDollarSign className="text-green-500" />;
      default: return <FiActivity className="text-purple-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-start space-x-3"
    >
      <div className={`p-2 rounded-lg bg-opacity-20 ${type === 'user' ? 'bg-blue-100' : type === 'order' ? 'bg-orange-100' : 'bg-purple-100'}`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">{user}</span> {action}
        </p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </motion.div>
  );
};
