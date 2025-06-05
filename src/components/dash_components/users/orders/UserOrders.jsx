/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Payment,
  Search,
  Clear,
  Add,
  ErrorOutline,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Dashboard as DashboardIcon,
  ShoppingCart,
  Message,
  ContactMail,
  People as PeopleIcon,
  TextFields,
  Subscriptions,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const navItems = [
  { name: 'Dashboard', icon: <DashboardIcon />, href: '/37911' },
  { name: 'Orders', icon: <ShoppingCart />, href: '/78631/83672' },
  { name: 'Messages', icon: <Message />, href: '/90203/89382' },
  { name: 'Contact', icon: <ContactMail />, href: '/78320/23943' },
  { name: 'NewsLetter', icon: <Subscriptions />, href: '/92092/93082' },
  { name: 'Testimony', icon: <TextFields />, href: '/43272/37191' },
];

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://camera-safety.onrender.com/api/orders";

const orderService = {
  getOrders: async (search = "", status = "", userEmail = "") => {
    try {
      const params = { search, status, email: userEmail };
      const response = await axios.get(API_URL, { 
        params, 
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axios.post(API_URL, orderData, { 
        timeout: 8000,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Order created successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order");
      throw error;
    }
  },

  updateOrder: async (id, orderData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, orderData, {
        timeout: 8000,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Order updated successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { 
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Order deleted successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order");
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${id}/status`,
        { status },
        { 
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success("Status updated successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
      throw error;
    }
  },
};

export const UserOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [currentOrder, setCurrentOrder] = useState({
    customer: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    orderDetails: {
      planId: 0,
      planName: "",
      cameraCount: 0,
      originalPrice: 0,
      discountAmount: 0,
      finalPrice: 0,
      features: [],
    },
    payment: {
      status: "pending",
      amount: 0,
      currency: "USD",
    },
  });

  // Status configuration
  const statusConfig = {
    completed: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="text-green-500" />,
      action: "Mark as Pending",
      nextStatus: "pending",
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <Payment className="text-yellow-500" />,
      action: "Mark as Completed",
      nextStatus: "completed",
    },
    failed: {
      color: "bg-red-100 text-red-800",
      icon: <Cancel className="text-red-500" />,
      action: "Mark as Pending",
      nextStatus: "pending",
    },
  };
  
  // navbar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  useEffect(() => {
    // Get user email from localStorage or token
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      // If email not in localStorage, try to get it from token or API
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.email) {
            setUserEmail(payload.email);
            localStorage.setItem('userEmail', payload.email);
          }
        } catch (e) {
          console.error("Could not get email from token");
        }
      }
    }
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrders(
        searchTerm,
        statusFilter === "all" ? "" : statusFilter,
        userEmail
      );
      // Filter orders by user email (additional client-side filtering)
      const filteredOrders = data.data.filter(order => 
        order.customer?.email?.toLowerCase() === userEmail?.toLowerCase()
      );
      setOrders(filteredOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchOrders();
    }
  }, [searchTerm, statusFilter, userEmail]);

  const openModal = (order = null) => {
    setCurrentOrder(
      order || {
        customer: {
          name: "",
          email: userEmail || "", // Pre-fill with user's email
          phone: "",
          address: "",
        },
        orderDetails: {
          planId: 0,
          planName: "",
          cameraCount: 0,
          originalPrice: 0,
          discountAmount: 0,
          finalPrice: 0,
          features: [],
        },
        payment: {
          status: "pending",
          amount: 0,
          currency: "USD",
        },
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setCurrentOrder((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCurrentOrder((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddFeature = () => {
    if (currentOrder.newFeature?.trim()) {
      setCurrentOrder((prev) => ({
        ...prev,
        orderDetails: {
          ...prev.orderDetails,
          features: [...prev.orderDetails.features, prev.newFeature.trim()],
        },
        newFeature: "",
      }));
    }
  };

  const handleRemoveFeature = (index) => {
    setCurrentOrder((prev) => {
      const updatedFeatures = [...prev.orderDetails.features];
      updatedFeatures.splice(index, 1);
      return {
        ...prev,
        orderDetails: {
          ...prev.orderDetails,
          features: updatedFeatures,
        },
      };
    });
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      // Ensure the order is associated with the logged-in user
      const orderToSubmit = {
        ...currentOrder,
        customer: {
          ...currentOrder.customer,
          email: userEmail // Force the email to be the logged-in user's email
        }
      };

      if (currentOrder._id) {
        await orderService.updateOrder(currentOrder._id, orderToSubmit);
      } else {
        await orderService.createOrder(orderToSubmit);
      }
      fetchOrders();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setIsProcessing(true);
      try {
        await orderService.deleteOrder(id);
        fetchOrders();
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    setIsProcessing(true);
    try {
      const newStatus = statusConfig[currentStatus]?.nextStatus || "pending";
      await orderService.updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderTableCell = (label, value, isHeader = false) => {
    if (isHeader) {
      return (
        <th className="px-2 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{label.substring(0, 1)}</span>
        </th>
      );
    }
    return (
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 sm:hidden">{label}</span>
          <span className="text-sm text-black">{value}</span>
        </div>
      </td>
    );
  };

  return (
    <>
      <div className="w-full flex h-screen mt-4 rounded-2xl bg-gray-100">
        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleMobileSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed lg:static z-30 ${
            sidebarOpen ? "w-64" : "w-20"
          } h-full bg-blue-800 rounded-2xl text-white transition-all duration-300 ease-in-out
      ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-64"
      } lg:translate-x-0`}
        >
          <div className="flex items-center justify-between p-4 border-b border-blue-700">
            {sidebarOpen && (
              <h3 className="text-xl font-semibold">SafetyVision</h3>
            )}
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
                    className={`flex items-center p-3 rounded-lg hover:bg-blue-700 transition-colors ${
                      !sidebarOpen ? "justify-center" : ""
                    }`}
                    title={!sidebarOpen ? item.name : ""}
                  >
                    <span className={sidebarOpen ? "mr-3" : ""}>
                      {item.icon}
                    </span>
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main content - Changed this div to remove sliding */}
        <div className="flex-1 overflow-auto ml-0">
          {/* Top bar */}
          <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
              aria-label="Open menu"
            >
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>
            {userEmail && (
              <div className="text-sm text-gray-600">
                Showing your orders
              </div>
            )}
          </header>

          <div className="min-h-screen mt-4 rounded-2xl bg-gray-50 p-2 sm:p-4 md:p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            
            {/* Mobile Header */}
            <div className="sm:hidden flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-black">Your Orders</h3>
              <button
                onClick={() => openModal()}
                className="bg-blue-600 text-white p-2 rounded-lg"
              >
                <Add />
              </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden sm:flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">
                Your Orders
              </h3>
              <button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Add />
                <span className="hidden md:inline">Add Order</span>
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <ErrorOutline />
                <span className="text-black">{error}</span>
              </div>
            )}

            {/* Filters and Search */}
            <div className="flex flex-wrap gap-5 mb-5">
              

              <div className="flex items-center gap-2">
                <label htmlFor="statusFilter" className="text-sm text-black">
                  Status:
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md text-black bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"
                />
              </div>
            ) : (
              <>
                {/* Table - Mobile Cards */}
                <div className="sm:hidden space-y-4">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-lg shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-black">
                              Order #{order._id.substring(18, 24)}
                            </h3>
                            <p className="text-sm text-black">
                              {order.orderDetails.planName} (
                              {order.orderDetails.cameraCount} cameras)
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {statusConfig[order.payment.status]?.icon}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                statusConfig[order.payment.status]?.color
                              } text-black`}
                            >
                              {order.payment.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-black">
                            ${order.orderDetails.finalPrice.toFixed(2)}
                            {order.orderDetails.discountAmount > 0 && (
                              <span className="text-xs text-green-600 ml-2">
                                (Saved $
                                {order.orderDetails.discountAmount.toFixed(2)})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-black">
                            {format(
                              new Date(order.createdAt),
                              "MMM dd, yyyy HH:mm"
                            )}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(order)}
                              className="text-blue-600 p-1"
                            >
                              <Edit fontSize="small" />
                            </button>
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="text-red-600 p-1"
                            >
                              <Delete fontSize="small" />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            {order.payment.status !== "completed" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    order._id,
                                    order.payment.status
                                  )
                                }
                                className="text-green-600 p-1"
                                title="Mark as Completed"
                              >
                                <CheckCircle fontSize="small" />
                              </button>
                            )}
                            {order.payment.status !== "failed" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(order._id, "failed")
                                }
                                className="text-red-600 p-1"
                                title="Mark as Failed"
                              >
                                <Cancel fontSize="small" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-black">
                      You have no orders yet
                    </div>
                  )}
                </div>

                {/* Table - Desktop */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {renderTableCell("Order", "Order", true)}
                        
                        {renderTableCell("Cameras", "Cameras", true)}
                        {renderTableCell("Price", "Price", true)}
                        {renderTableCell("Status", "Status", true)}
                        {renderTableCell("Date", "Date", true)}
                        {renderTableCell("Actions", "Actions", true)}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <motion.tr
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                       
                            {renderTableCell(
                              "Plan",
                              order.orderDetails.planName
                            )}
                            {renderTableCell(
                              "Cameras",
                              order.orderDetails.cameraCount
                            )}
                            {renderTableCell(
                              "Price",
                              <>
                                ${order.orderDetails.finalPrice.toFixed(2)}
                                {order.orderDetails.discountAmount > 0 && (
                                  <div className="text-xs text-green-600">
                                    (Saved $
                                    {order.orderDetails.discountAmount.toFixed(
                                      2
                                    )}
                                    )
                                  </div>
                                )}
                              </>
                            )}
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {statusConfig[order.payment.status]?.icon}
                                <span
                                  className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                    statusConfig[order.payment.status]?.color
                                  } text-black`}
                                >
                                  {order.payment.status}
                                </span>
                              </div>
                            </td>
                            {renderTableCell(
                              "Date",
                              format(
                                new Date(order.createdAt),
                                "MMM dd, yyyy HH:mm"
                              )
                            )}
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openModal(order)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                >
                                  <Edit fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleDelete(order._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                >
                                  <Delete fontSize="small" />
                                </button>
                                {order.payment.status !== "completed" && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        order._id,
                                        order.payment.status
                                      )
                                    }
                                    className="text-green-600 hover:text-green-900 p-1"
                                    title="Mark as Completed"
                                  >
                                    <CheckCircle fontSize="small" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-4 py-6 text-center text-black"
                          >
                            You have no orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Order Modal */}
            <AnimatePresence>
              {isModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                  onClick={closeModal}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4 text-black">
                        {currentOrder._id
                          ? `Edit Order (ID: ${currentOrder._id.substring(
                              0,
                              8
                            )}...)`
                          : "Create New Order"}
                      </h2>

                      {/* Customer Information */}
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4 text-black">
                          Customer Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Name *
                            </label>
                            <input
                              type="text"
                              name="customer.name"
                              value={currentOrder.customer.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Email *
                            </label>
                            <input
                              type="email"
                              name="customer.email"
                              value={currentOrder.customer.email || userEmail}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                              required
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              name="customer.phone"
                              value={currentOrder.customer.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Address *
                            </label>
                            <textarea
                              name="customer.address"
                              value={currentOrder.customer.address}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black min-h-[60px]"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4 text-black">
                          Order Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Plan ID *
                            </label>
                            <input
                              type="number"
                              name="orderDetails.planId"
                              value={currentOrder.orderDetails.planId}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Plan Name *
                            </label>
                            <input
                              type="text"
                              name="orderDetails.planName"
                              value={currentOrder.orderDetails.planName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Camera Count *
                            </label>
                            <input
                              type="number"
                              name="orderDetails.cameraCount"
                              value={currentOrder.orderDetails.cameraCount}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Original Price *
                            </label>
                            <input
                              type="number"
                              name="orderDetails.originalPrice"
                              value={currentOrder.orderDetails.originalPrice}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Discount Amount
                            </label>
                            <input
                              type="number"
                              name="orderDetails.discountAmount"
                              value={currentOrder.orderDetails.discountAmount}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Final Price *
                            </label>
                            <input
                              type="number"
                              name="orderDetails.finalPrice"
                              value={currentOrder.orderDetails.finalPrice}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4 text-black">
                          Features
                        </h3>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            placeholder="Add Feature"
                            value={currentOrder.newFeature || ""}
                            onChange={(e) =>
                              setCurrentOrder((prev) => ({
                                ...prev,
                                newFeature: e.target.value,
                              }))
                            }
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          />
                          <button
                            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-black"
                            onClick={handleAddFeature}
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentOrder.orderDetails.features.map(
                            (feature, index) => (
                              <div
                                key={index}
                                className="flex items-center px-3 py-1 bg-gray-100 rounded-full"
                              >
                                <span className="text-sm text-black">
                                  {feature}
                                </span>
                                <button
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => handleRemoveFeature(index)}
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-black">
                          Payment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Status *
                            </label>
                            <select
                              name="payment.status"
                              value={currentOrder.payment.status}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            >
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Amount *
                            </label>
                            <input
                              type="number"
                              name="payment.amount"
                              value={currentOrder.payment.amount}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Currency
                            </label>
                            <input
                              type="text"
                              name="payment.currency"
                              value={currentOrder.payment.currency}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 text-black hover:text-gray-900 disabled:opacity-50"
                        disabled={isProcessing}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className={`px-4 py-2 rounded-md text-white ${
                          isProcessing
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Processing...
                          </span>
                        ) : currentOrder._id ? (
                          "Update Order"
                        ) : (
                          "Create Order"
                        )}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};