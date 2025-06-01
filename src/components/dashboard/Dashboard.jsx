import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Dashboard as DashboardIcon,
  CameraAlt as CameraIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';

// Camera safety data
const inspectionData = [
  { name: 'Jan', value: 42 },
  { name: 'Feb', value: 38 },
  { name: 'Mar', value: 51 },
  { name: 'Apr', value: 47 },
  { name: 'May', value: 39 },
  { name: 'Jun', value: 45 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const navItems = [
  { name: 'Dashboard', icon: <DashboardIcon /> },
  { name: 'Cameras', icon: <CameraIcon /> },
  { name: 'Violations', icon: <WarningIcon /> },
  { name: 'Reports', icon: <BarChartIcon /> },
  { name: 'Users', icon: <PeopleIcon /> },
  { name: 'Settings', icon: <SettingsIcon /> }
];

export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userStats, setUserStats] = useState();
  const [messageStats, setMessageStats] = useState();
  const [complianceStats, setComplianceStats] = useState();
  const [statsLoading, setStatsLoading] = useState(true);
  const [messageStatsLoading, setMessageStatsLoading] = useState(true);
  const [complianceStatsLoading, setComplianceStatsLoading] = useState(true);
  const [growthData, setGrowthData] = useState([]);
  const [orderTargetData, setOrderTargetData] = useState([
    { name: 'Achieved', value: 0 },
    { name: 'Remaining', value: 100 }
  ]);

  useEffect(() => {
    // Fetch user statistics from API
    const fetchUserStats = async () => {
      try {
        const response = await axios.get('https://camera-safety.onrender.com/users/statistics/system');
        console.log(response.data.report);
        setUserStats(response.data.report);
        
        // Process growth data for the chart
        if (response.data.report?.growthData) {
          const formattedData = response.data.report.growthData.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: item.count
          }));
          setGrowthData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching user statistics:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    // Fetch message statistics from API
    const fetchMessageStats = async () => {
      try {
        const response = await axios.get('https://camera-safety.onrender.com/messages/890/stats');
        console.log(response.data.data);
        setMessageStats(response.data.data);
      } catch (error) {
        console.error('Error fetching message statistics:', error);
      } finally {
        setMessageStatsLoading(false);
      }
    };

    // Fetch compliance statistics from API
    const fetchComplianceStats = async () => {
      try {
        const response = await axios.get('https://camera-safety.onrender.com/api/orders/stats');
        console.log('Compliance stats:', response.data.data);
        setComplianceStats(response.data.data);
        
        // Calculate percentage of target (1000) reached
        if (response.data.data?.totalRevenue) {
          const target = 1000;
          const percentage = Math.min(Math.round((response.data.data.totalRevenue / target) * 100, 100));
          setOrderTargetData([
            { name: 'Achieved', value: percentage },
            { name: 'Remaining', value: 100 - percentage }
          ]);
        }
      } catch (error) {
        console.error('Error fetching compliance statistics:', error);
      } finally {
        setComplianceStatsLoading(false);
      }
    };

    fetchUserStats();
    fetchMessageStats();
    fetchComplianceStats();

    // Simulate other data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const StatsCard = ({ title, value, change, icon }) => (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="text-gray-700 text-sm mb-2">{title}</div>
      <div className="text-2xl text-blue-400 font-bold mb-1">{value}</div>
      {change !== undefined && (
        <div className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? `+${change}%` : `${change}%`} from last period
        </div>
      )}
      <div className="mt-3 text-2xl">{icon}</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
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
                <a 
                  href="#" 
                  className={`flex items-center p-3 rounded-lg hover:bg-blue-700 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <span className={sidebarOpen ? 'mr-3' : ''}>{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'lg:ml-6' : 'lg:ml-4'}`}>
        {/* Top bar */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
          <button 
            onClick={toggleMobileSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="flex items-center space-x-4">
            <select
              className="p-2 rounded border border-gray-300 text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            {/* Hidden toggle button for larger screens - only visible when sidebar is collapsed */}
            <button 
              onClick={toggleSidebar} 
              className="hidden lg:block text-gray-500 hover:text-gray-700 ml-2"
              aria-label="Toggle sidebar"
            >
              <MenuIcon />
            </button>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-5 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-5">Camera Safety Compliance Dashboard</h1>

          {isLoading ? (
            <div className="text-center p-5">Loading safety data...</div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                <StatsCard 
                  title="Cameras Inspected" 
                  value="142" 
                  change={8.5} 
                  icon={<CameraIcon className="text-blue-500" />} 
                />
                {complianceStatsLoading ? (
                  <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
                    <div className="animate-pulse">Loading Orders data...</div>
                  </div>
                ) : (
                  <StatsCard 
                    title="Orders" 
                    value={complianceStats?.totalRevenue} 
                    change={complianceStats?.totalOrders || 0} 
                    icon={<CheckCircleIcon className="text-green-500" />} 
                  />
                )}
                {messageStatsLoading ? (
                  <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
                    <div className="animate-pulse">Loading message data...</div>
                  </div>
                ) : (
                  <StatsCard 
                    title="Total Messages" 
                    value={messageStats?.totalContacts || '0'} 
                    icon={<MessageIcon className="text-purple-500" />} 
                    change={messageStats?.newThisMonth}
                  />
                )}
                {statsLoading ? (
                  <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
                    <div className="animate-pulse">Loading user data...</div>
                  </div>
                ) : (
                  <StatsCard 
                    title="Total Users" 
                    value={userStats?.totalUsers || '0'} 
                    icon={<PeopleIcon className="text-green-500" />} 
                    change={userStats?.newUsers?.last7d}
                  />
                )}
              </div>

              {/* Monthly Inspections and Target Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                {/* User Growth Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TimelineIcon className="text-blue-500 mr-2" /> User Growth
                  </h3>
                  {growthData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          interval={Math.floor(growthData.length / 5)}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [value, 'User Count']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          dot={{ r: (data) => data.count > 0 ? 4 : 0 }}
                          activeDot={{ r: 6 }} 
                          name="User Count"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      {statsLoading ? 'Loading growth data...' : 'No growth data available'}
                    </div>
                  )}
                </div>

                {/* Monthly Revenue Target Progress */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <PieChartIcon className="text-green-500 mr-2" /> Monthly Revenue Target
                  </h3>
                  {complianceStatsLoading ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      Loading order data...
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-blue-600">
                          ${complianceStats?.totalRevenue || 0} / $1000
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.min(Math.round(((complianceStats?.totalRevenue || 0) / 10), 100))}% of target
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={orderTargetData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#00C49F" />
                            <Cell fill="#FF8042" />
                          </Pie>
                          <Tooltip 
                            formatter={(value, name) => [`${value}%`, name]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </>
                  )}
                </div>
              </div>

              {/* Recent Violations */}
              <div className="grid grid-cols-1 gap-5 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <WarningIcon className="text-red-500 mr-2" /> Recent Violations
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={inspectionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Safety Analysis Models */}
              <h2 className="text-xl font-bold text-gray-800 my-5 flex items-center">
                <BarChartIcon className="text-purple-500 mr-2" /> Safety Analysis Models
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Risk Prediction</h3>
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded text-gray-500">
                    Camera failure risk prediction model
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Maintenance Optimization</h3>
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded text-gray-500">
                    Maintenance schedule optimization model
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};