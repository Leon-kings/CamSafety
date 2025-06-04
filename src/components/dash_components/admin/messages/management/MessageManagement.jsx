/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Pending,
  Archive,
  Refresh,
  ErrorOutline,
} from "@mui/icons-material";
import { SearchMessagesModal } from "../search/Msearch";
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
  { name: "Dashboard", icon: <DashboardIcon />, href: "/Dashboard" },
  { name: "Orders", icon: <ShoppingCart />, href: "/7822289/2902" },
  { name: "Messages", icon: <Message />, href: "/9723089/9820" },
  { name: "Contacts", icon: <ContactMail />, href: "/1283782/6282" },
  { name: "Users", icon: <PeopleIcon />, href: "/8032782/0209" },
  { name: "Testimony", icon: <TextFields />, href: "/7822982/6728" },
  { name: "NewsLetter", icon: <Subscriptions />, href: "/9783989/1689" },
];

const API_URL = "https://camera-safety.onrender.com/messages/890";

// Status configuration
const statusConfig = {
  new: {
    icon: <Pending className="text-blue-500" />,
    actionIcon: <Refresh />,
    label: "New",
    color: "bg-blue-100 text-blue-800",
    nextStatus: "in_progress",
  },
  in_progress: {
    icon: <Refresh className="text-yellow-500" />,
    actionIcon: <CheckCircle />,
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800",
    nextStatus: "resolved",
  },
  resolved: {
    icon: <CheckCircle className="text-green-500" />,
    actionIcon: <Archive />,
    label: "Resolved",
    color: "bg-green-100 text-green-800",
    nextStatus: "archived",
  },
  archived: {
    icon: <Archive className="text-gray-500" />,
    actionIcon: <Delete />,
    label: "Archived",
    color: "bg-gray-200 text-gray-800",
    nextStatus: null,
  },
};

const messageService = {
  getMessages: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${API_URL}?page=${page}&limit=${limit}`,
        {
          timeout: 10000,
        }
      );
      return {
        messages: response.data?.data || [],
        totalPages: response.data?.totalPages || 1,
      };
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  },

  createMessage: async (messageData) => {
    try {
      const response = await axios.post(API_URL, messageData, {
        timeout: 8000,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create message:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create message"
      );
    }
  },

  updateMessage: async (id, messageData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, messageData, {
        timeout: 8000,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update message:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update message"
      );
    }
  },

  deleteMessage: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        timeout: 5000,
      });
      return true;
    } catch (error) {
      console.error("Failed to delete message:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  },

  updateMessageStatus: async (id, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${id}/status`,
        { status },
        { timeout: 5000 }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update status"
      );
    }
  },
};

export const MessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    status: "new",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  //
  // navbar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  //

  //
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await messageService.getMessages(page, 10);
      setMessages(data.messages);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const openModal = (message = null) => {
    setCurrentMessage(
      message || {
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        status: "new",
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      if (currentMessage._id) {
        await messageService.updateMessage(currentMessage._id, currentMessage);
        toast.success("Message updated successfully!");
      } else {
        await messageService.createMessage(currentMessage);
        toast.success("Message created successfully!");
      }
      fetchMessages();
      closeModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      setIsProcessing(true);
      try {
        await messageService.deleteMessage(id);
        toast.success("Message deleted successfully!");
        fetchMessages();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    setIsProcessing(true);
    try {
      const newStatus = statusConfig[currentStatus]?.nextStatus;
      if (newStatus) {
        await messageService.updateMessageStatus(id, newStatus);
        toast.success(`Status updated to ${statusConfig[newStatus]?.label}`);
        fetchMessages();
      }
    } catch (err) {
      toast.error(err.message);
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
                          mobileSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-64"
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

        {/* Main content */}
        <div
          className={`flex-1 overflow-auto transition-all duration-300 ${
            sidebarOpen ? "lg:ml-6" : "lg:ml-4"
          }`}
        >
          {/* Top bar */}
          <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
              aria-label="Open menu"
            >
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>
          </header>
          <div className="min-h-screen mt-4 rounded-2xl bg-gray-50 p-2 sm:p-4 md:p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet qui,
              tempora reiciendis quos molestias molestiae itaque vel
              consequuntur officia fuga earum, id animi dignissimos architecto
              aspernatur repellendus ullam quasi in!
            </p>
            {/* Mobile Header */}{" "}
            <div className="w-full">
              <div className="sm:hidden flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-black">Messages</h3>

                <button
                  onClick={() => openModal()}
                  className="bg-blue-600 text-white p-2 rounded-lg"
                >
                  <Add />
                </button>
              </div>{" "}
              <SearchMessagesModal API_URL="https://camera-safety.onrender.com/messages/890" />
            </div>
            {/* Desktop Header */}
            <div className="hidden sm:flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">
                Message Management
              </h3>
              <button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Add />
                <span className="hidden md:inline">Add Message</span>
              </button>
              <SearchMessagesModal API_URL="https://camera-safety.onrender.com/messages/890" />
            </div>
            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <ErrorOutline />
                <span className="text-black">{error}</span>
              </div>
            )}
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
                {/* Mobile Cards View */}
                <div className="sm:hidden space-y-4">
                  {messages?.length > 0 ? (
                    messages.map((message) => (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-lg shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-black">
                              {message.name}
                            </h3>
                            <p className="text-sm text-black">
                              {message.email}
                            </p>
                            <p className="text-xs text-gray-600">
                              {message.service}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {statusConfig[message.status]?.icon}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                statusConfig[message.status]?.color
                              } text-black`}
                            >
                              {statusConfig[message.status]?.label}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-black">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(message)}
                              className="text-blue-600 p-1"
                            >
                              <Edit fontSize="small" />
                            </button>
                            {statusConfig[message.status]?.nextStatus && (
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    message._id,
                                    message.status
                                  )
                                }
                                className="text-black p-1"
                              >
                                {statusConfig[message.status]?.actionIcon}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(message._id)}
                              className="text-red-600 p-1"
                            >
                              <Delete fontSize="small" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-black">
                      No messages found
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {renderTableCell("Name", "Name", true)}
                        {renderTableCell("Email", "Email", true)}
                        {renderTableCell("Service", "Service", true)}
                        {renderTableCell("Message", "Message", true)}
                        {renderTableCell("Status", "Status", true)}
                        {renderTableCell("Date", "Date", true)}
                        {renderTableCell("Actions", "Actions", true)}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {messages?.length > 0 ? (
                        messages.map((message) => (
                          <motion.tr
                            key={message._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {renderTableCell("Name", message.name)}
                            {renderTableCell("Email", message.email)}
                            {renderTableCell("Service", message.service)}
                            {renderTableCell(
                              "Message",
                              message.message.length > 50
                                ? `${message.message.substring(0, 50)}...`
                                : message.message
                            )}
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {statusConfig[message.status]?.icon}
                                <span
                                  className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                    statusConfig[message.status]?.color
                                  } text-black`}
                                >
                                  {statusConfig[message.status]?.label}
                                </span>
                              </div>
                            </td>
                            {renderTableCell(
                              "Date",
                              new Date(message.createdAt).toLocaleDateString()
                            )}
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openModal(message)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                >
                                  <Edit fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleDelete(message._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                >
                                  <Delete fontSize="small" />
                                </button>
                                {statusConfig[message.status]?.nextStatus && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        message._id,
                                        message.status
                                      )
                                    }
                                    className="text-black hover:text-gray-900 p-1"
                                    title={`Change to ${
                                      statusConfig[message.status]?.nextStatus
                                    }`}
                                  >
                                    {statusConfig[message.status]?.actionIcon}
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
                            No messages found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-black">
                      Showing {(page - 1) * 10 + 1}-
                      {Math.min(page * 10, messages.length)} of{" "}
                      {totalPages * 10} messages
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || isProcessing}
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg ${
                          page === 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300 text-black"
                        }`}
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 sm:px-4 sm:py-2 text-black">
                        {page} / {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages || isProcessing}
                        className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg ${
                          page === totalPages
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300 text-black"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Message Modal */}
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
                    className="bg-white rounded-xl shadow-xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4 text-black">
                        {currentMessage._id
                          ? `Edit Message (ID: ${currentMessage._id.substring(
                              0,
                              8
                            )}...)`
                          : "Add New Message"}
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={currentMessage.name}
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
                            name="email"
                            value={currentMessage.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={currentMessage.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Service *
                          </label>
                          <select
                            name="service"
                            value={currentMessage.service}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                          >
                            <option value="">Select a service</option>
                            <option value="Web Development">
                              Web Development
                            </option>
                            <option value="Consulting">Consulting</option>
                            <option value="Support">Support</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Message *
                          </label>
                          <textarea
                            name="message"
                            value={currentMessage.message}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Status *
                          </label>
                          <div className="flex gap-4">
                            {Object.entries(statusConfig).map(
                              ([key, config]) => (
                                <label
                                  key={key}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="radio"
                                    name="status"
                                    value={key}
                                    checked={currentMessage.status === key}
                                    onChange={() =>
                                      handleInputChange({
                                        target: { name: "status", value: key },
                                      })
                                    }
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                  />
                                  <span className="flex items-center text-black">
                                    {config.icon}
                                    <span className="ml-1">{config.label}</span>
                                  </span>
                                </label>
                              )
                            )}
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
                        disabled={
                          isProcessing ||
                          !currentMessage.name ||
                          !currentMessage.email ||
                          !currentMessage.service ||
                          !currentMessage.message
                        }
                        className={`px-4 py-2 rounded-md text-white ${
                          isProcessing ||
                          !currentMessage.name ||
                          !currentMessage.email ||
                          !currentMessage.service ||
                          !currentMessage.message
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
                        ) : currentMessage._id ? (
                          "Update"
                        ) : (
                          "Create"
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
