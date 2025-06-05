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
  Mail,
  CheckCircle,
  Pending,
  Warning,
  ErrorOutline,
  Search,
  Close,
  Save,
  Cancel,
} from "@mui/icons-material";
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

const API_URL = "https://camera-safety.onrender.com/contact/messaging";

// Status configuration
const statusConfig = {
  pending: {
    icon: <Pending className="text-yellow-500" />,
    actionIcon: <CheckCircle />,
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    nextStatus: "processed",
  },
  processed: {
    icon: <CheckCircle className="text-green-500" />,
    actionIcon: <Warning />,
    label: "Processed",
    color: "bg-green-100 text-green-800",
    nextStatus: "rejected",
  },
  rejected: {
    icon: <Warning className="text-red-500" />,
    actionIcon: <Pending />,
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    nextStatus: "pending",
  },
};

const contactService = {
  getContacts: async ( email = null) => {
    try {
      const response = await axios.get(
        `${API_URL}`,
        {
          timeout: 10000,
        }
      );
      
      // Filter contacts by email if provided
      let filteredContacts = response.data?.contacts || [];
      if (email) {
        filteredContacts = filteredContacts.filter(contact => 
          contact.email.toLowerCase() === email.toLowerCase()
        );
      }
      
      return {
        contacts: filteredContacts,
        totalPages: response.data?.totalPages || 1,
      };
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch contacts"
      );
    }
  },

  createContact: async (contactData) => {
    try {
      const response = await axios.post(API_URL, contactData, {
        timeout: 8000,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create contact:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create contact"
      );
    }
  },

  updateContact: async (id, contactData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, contactData, {
        timeout: 8000,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update contact:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update contact"
      );
    }
  },

  deleteContact: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        timeout: 5000,
      });
      return true;
    } catch (error) {
      console.error("Failed to delete contact:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete contact"
      );
    }
  },

  updateContactStatus: async (id, status) => {
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

const ContactModal = ({
  isOpen,
  onClose,
  currentContact,
  onInputChange,
  onSubmit,
  isProcessing,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
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
                {currentContact._id
                  ? `Edit Contact (ID: ${currentContact._id.substring(
                      0,
                      8
                    )}...)`
                  : "Add New Contact"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentContact.name}
                    onChange={onInputChange}
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
                    value={currentContact.email}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                      currentContact._id ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    required
                    disabled={!!currentContact._id}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={currentContact.subject}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={currentContact.message}
                    onChange={onInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>

                {currentContact._id && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Status *
                    </label>
                    <div className="flex gap-4">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <label
                          key={key}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name="status"
                            value={key}
                            checked={currentContact.status === key}
                            onChange={() =>
                              onInputChange({
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
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={onClose}
                className="px-4 py-2 text-black hover:text-gray-900 disabled:opacity-50"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={
                  isProcessing ||
                  !currentContact.name ||
                  !currentContact.email ||
                  !currentContact.subject ||
                  !currentContact.message
                }
                className={`px-4 py-2 rounded-md text-white ${
                  isProcessing ||
                  !currentContact.name ||
                  !currentContact.email ||
                  !currentContact.subject ||
                  !currentContact.message
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
                ) : currentContact._id ? (
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
  );
};

export const UserContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    status: "pending",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // navbar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Get logged-in user's email
  useEffect(() => {
    // Replace this with your actual authentication logic
    // For example, you might get it from localStorage, context, or an API call
    const email = localStorage.getItem('userEmail') || 'user@example.com';
    setUserEmail(email);
    // Set the email in the current contact form
    setCurrentContact(prev => ({ ...prev, email }));
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getContacts(page, 10, userEmail);
      setContacts(data.contacts);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchContacts();
    }
  }, [page, userEmail]);

  const openModal = (contact = null) => {
    setCurrentContact(
      contact || {
        name: "",
        email: userEmail, // Pre-fill with user's email
        subject: "",
        message: "",
        status: "pending",
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      if (currentContact._id) {
        await contactService.updateContact(currentContact._id, currentContact);
        toast.success("Contact updated successfully!");
      } else {
        await contactService.createContact(currentContact);
        toast.success("Contact created successfully!");
      }
      fetchContacts();
      closeModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setIsProcessing(true);
      try {
        await contactService.deleteContact(id);
        toast.success("Contact deleted successfully!");
        fetchContacts();
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
        await contactService.updateContactStatus(id, newStatus);
        toast.success(`Status updated to ${statusConfig[newStatus]?.label}`);
        fetchContacts();
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
          <span className="text-sm text-black">
            {typeof value === "string" && value.length > 50
              ? `${value.substring(0, 50)}...`
              : value}
          </span>
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
            <div className="text-sm text-gray-600">
              Showing contacts for: <span className="font-medium">{userEmail}</span>
            </div>
          </header>
          <div className="min-h-screen mt-4 rounded-2xl bg-gray-50 p-2 sm:p-4 md:p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <h3 className="text-xl sm:text-2xl font-bold text-black">
                My Contact Messages
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2"
                >
                  <Add fontSize="small" className="sm:font-size-medium" />
                  <span className="text-sm sm:text-base">New Message</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <ErrorOutline />
                <span className="text-black">{error}</span>
              </div>
            )}

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
                <div className="sm:hidden space-y-4">
                  {contacts?.length > 0 ? (
                    contacts.map((contact) => (
                      <motion.div
                        key={contact._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-lg shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-black">
                              {contact.name}
                            </h3>
                            <p className="text-sm text-black">
                              {contact.subject}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {statusConfig[contact.status]?.icon}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                statusConfig[contact.status]?.color
                              } text-black`}
                            >
                              {statusConfig[contact.status]?.label}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {contact.message}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-black">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(contact)}
                              className="text-blue-600 p-1"
                            >
                              <Edit fontSize="small" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(contact._id, contact.status)
                              }
                              className="text-black p-1"
                            >
                              {statusConfig[contact.status]?.actionIcon}
                            </button>
                            <button
                              onClick={() => handleDelete(contact._id)}
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
                      No messages found for your account
                    </div>
                  )}
                </div>

                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Name",
                          "Subject",
                          "Message",
                          "Status",
                          "Date",
                          "Actions",
                        ].map((label) => renderTableCell(label, label, true))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contacts?.length > 0 ? (
                        contacts.map((contact) => (
                          <motion.tr
                            key={contact._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {renderTableCell("Name", contact.name)}
                            {renderTableCell("Subject", contact.subject)}
                            {renderTableCell("Message", contact.message)}
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {statusConfig[contact.status]?.icon}
                                <span
                                  className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                    statusConfig[contact.status]?.color
                                  } text-black`}
                                >
                                  {statusConfig[contact.status]?.label}
                                </span>
                              </div>
                            </td>
                            {renderTableCell(
                              "Date",
                              new Date(contact.createdAt).toLocaleDateString()
                            )}
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openModal(contact)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                >
                                  <Edit fontSize="small" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(
                                      contact._id,
                                      contact.status
                                    )
                                  }
                                  className="text-black hover:text-gray-900 p-1"
                                  title={`Change to ${
                                    statusConfig[contact.status]?.nextStatus
                                  }`}
                                >
                                  {statusConfig[contact.status]?.actionIcon}
                                </button>
                                <button
                                  onClick={() => handleDelete(contact._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                >
                                  <Delete fontSize="small" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-4 py-6 text-center text-black"
                          >
                            No messages found for your account
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-black">
                      Showing {(page - 1) * 10 + 1}-
                      {Math.min(page * 10, contacts.length)} of{" "}
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

            <ContactModal
              isOpen={isModalOpen}
              onClose={closeModal}
              currentContact={currentContact}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </>
  );
};