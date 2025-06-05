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
  Star,
  StarHalf,
  StarBorder,
  ErrorOutline,
  CheckCircle,
  Cancel,
  AccessTime,
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

const API_URL =
  import.meta.env.VITE_API_URL || "https://camera-safety.onrender.com";

const testimonialService = {
  getTestimonials: async (page = 1, limit = 100, status = "", email = "") => {
    try {
      const params = { page, limit, status, email };
      const response = await axios.get(`${API_URL}/api/testimonials`, {
        params,
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch testimonials"
      );
      console.error("API Error:", error.response);
      throw error;
    }
  },

  createTestimonial: async (testimonialData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/testimonials`,
        testimonialData,
        { 
          timeout: 8000,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success("Testimonial submitted successfully!");
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create testimonial"
      );
      throw error;
    }
  },

  updateTestimonialStatus: async (id, status) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/testimonials/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success("Status updated successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
      throw error;
    }
  },

  deleteTestimonial: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/testimonials/${id}`, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Testimonial deleted successfully!");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete testimonial"
      );
      throw error;
    }
  },
};

export const UserTestimonyManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTestimonials, setTotalTestimonials] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState({
    name: "",
    email: "",
    profession: "",
    rating: 5,
    testimonial: "",
    image: "",
    status: "pending",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Status configuration
  const statusConfig = {
    pending: {
      icon: <AccessTime className="text-yellow-500" />,
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    approved: {
      icon: <CheckCircle className="text-green-500" />,
      label: "Approved",
      color: "bg-green-100 text-green-800",
    },
    rejected: {
      icon: <Cancel className="text-red-500" />,
      label: "Rejected",
      color: "bg-red-100 text-red-800",
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

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testimonialService.getTestimonials(
        page,
        100, // Increased limit to fetch more testimonials at once
        statusFilter,
        userEmail
      );
      console.log("API Response:", data); // Debug log
      // Additional client-side filtering
      const filteredTestimonials = data.data.filter(testimonial => 
        testimonial.email?.toLowerCase() === userEmail?.toLowerCase()
      );
      setTestimonials(filteredTestimonials || []);
      setTotalPages(data?.totalPages || 1);
      setTotalTestimonials(filteredTestimonials?.length || 0);
    } catch (err) {
      setError(err.message);
      console.error("Fetch Error:", err.response); // More detailed error logging
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchTestimonials();
    }
  }, [page, statusFilter, userEmail]);

  const openModal = (testimonial = null) => {
    setCurrentTestimonial(
      testimonial || {
        name: "",
        email: userEmail || "", // Pre-fill with user's email
        profession: "",
        rating: 5,
        testimonial: "",
        image: "",
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
    setCurrentTestimonial((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      // Ensure the testimonial is associated with the logged-in user
      const testimonialToSubmit = {
        ...currentTestimonial,
        email: userEmail // Force the email to be the logged-in user's email
      };

      if (currentTestimonial._id) {
        await testimonialService.updateTestimonialStatus(
          currentTestimonial._id,
          currentTestimonial.status
        );
      } else {
        await testimonialService.createTestimonial(testimonialToSubmit);
      }
      fetchTestimonials();
      closeModal();
    } catch (err) {
      console.error("Submission Error:", err.response);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      setIsProcessing(true);
      try {
        await testimonialService.deleteTestimonial(id);
        fetchTestimonials();
      } catch (err) {
        console.error("Deletion Error:", err.response);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    setIsProcessing(true);
    try {
      await testimonialService.updateTestimonialStatus(id, status);
      fetchTestimonials();
    } catch (err) {
      console.error("Status Change Error:", err.response);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="text-yellow-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="text-yellow-500" />);
      } else {
        stars.push(<StarBorder key={i} className="text-yellow-500" />);
      }
    }
    return stars;
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
            {userEmail && (
              <div className="text-sm text-gray-600">
                Showing your testimonials
              </div>
            )}
          </header>
          <div className=" mt-4 rounded-2xl bg-gray-50 sm:p-4 md:p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-black">
                Your Testimonials
              </h3>
           
              <div className="flex flex-col sm:flex-row gap-3 sm:w-auto">
                <button
                  onClick={() => openModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Add />
                  <span className="md:inline">Add Testimonial</span>
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500">
                  Your Testimonials
                </h4>
                <p className="text-2xl font-bold text-black">
                  {totalTestimonials}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500">Approved</h4>
                <p className="text-2xl font-bold text-green-600">
                  {testimonials.filter((t) => t.status === "approved").length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500">Pending</h4>
                <p className="text-2xl font-bold text-yellow-600">
                  {testimonials.filter((t) => t.status === "pending").length}
                </p>
              </div>
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
                {/* Mobile Cards */}
                <div className="sm:hidden space-y-4">
                  {testimonials.length > 0 ? (
                    testimonials.map((testimonial) => (
                      <motion.div
                        key={testimonial._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-4 rounded-lg shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-black">
                              {testimonial.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {testimonial.profession}
                            </p>
                            <div className="flex items-center mt-1">
                              {renderRatingStars(testimonial.rating)}
                              <span className="ml-2 text-sm text-gray-600">
                                ({testimonial.rating.toFixed(1)})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {statusConfig[testimonial.status]?.icon}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                statusConfig[testimonial.status]?.color
                              } text-black`}
                            >
                              {statusConfig[testimonial.status]?.label}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-700">
                          {testimonial.testimonial}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-black">
                            {new Date(
                              testimonial.createdAt
                            ).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(testimonial)}
                              className="text-blue-600 p-1"
                            >
                              <Edit fontSize="small" />
                            </button>
                            <button
                              onClick={() => handleDelete(testimonial._id)}
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
                      You have no testimonials yet
                    </div>
                  )}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {renderTableCell("Name", "Name", true)}
                        {renderTableCell("Profession", "Profession", true)}
                        {renderTableCell("Rating", "Rating", true)}
                        {renderTableCell("Testimonial", "Testimonial", true)}
                        {renderTableCell("Status", "Status", true)}
                        {renderTableCell("Date", "Date", true)}
                        {renderTableCell("Actions", "Actions", true)}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testimonials.length > 0 ? (
                        testimonials.map((test) => (
                          <motion.tr
                            key={test._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {renderTableCell("Name", test.name)}
                            {renderTableCell("Profession", test.profession)}
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {renderRatingStars(test.rating)}
                                <span className="ml-2 text-sm text-gray-600">
                                  ({test.rating.toFixed(1)})
                                </span>
                              </div>
                            </td>
                            <td className="px-2 py-4">
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {test.testimonial}
                              </p>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {statusConfig[test.status]?.icon}
                                <span
                                  className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                    statusConfig[test.status]?.color
                                  } text-black`}
                                >
                                  {statusConfig[test.status]?.label}
                                </span>
                              </div>
                            </td>
                            {renderTableCell(
                              "Date",
                              new Date(test.createdAt).toLocaleDateString()
                            )}
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openModal(test)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                >
                                  <Edit fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleDelete(test._id)}
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
                            colSpan="7"
                            className="px-4 py-6 text-center text-black"
                          >
                            You have no testimonials yet
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
                      Showing {(page - 1) * 100 + 1}-
                      {Math.min(page * 100, totalTestimonials)} of{" "}
                      {totalTestimonials} testimonials
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

            {/* Testimonial Modal */}
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
                        {currentTestimonial._id
                          ? `Edit Your Testimonial`
                          : "Add New Testimonial"}
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={currentTestimonial.name}
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
                            value={currentTestimonial.email || userEmail}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Profession *
                          </label>
                          <input
                            type="text"
                            name="profession"
                            value={currentTestimonial.profession}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Rating *
                          </label>
                          <select
                            name="rating"
                            value={currentTestimonial.rating}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                          >
                            {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(
                              (value) => (
                                <option key={value} value={value}>
                                  {value} Stars
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Testimonial *
                          </label>
                          <textarea
                            name="testimonial"
                            value={currentTestimonial.testimonial}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            rows="4"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-black mb-1">
                            Image URL
                          </label>
                          <input
                            type="url"
                            name="image"
                            value={currentTestimonial.image}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          />
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
                          !currentTestimonial.name ||
                          !currentTestimonial.profession ||
                          !currentTestimonial.testimonial
                        }
                        className={`px-4 py-2 rounded-md text-white ${
                          isProcessing ||
                          !currentTestimonial.name ||
                          !currentTestimonial.profession ||
                          !currentTestimonial.testimonial
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
                        ) : currentTestimonial._id ? (
                          "Update"
                        ) : (
                          "Submit"
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