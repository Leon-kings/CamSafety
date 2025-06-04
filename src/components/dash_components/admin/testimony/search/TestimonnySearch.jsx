/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Search, Close, Edit, Delete, Save, Cancel, Warning, Star } from '@mui/icons-material';

export const SearchTestimonialsModal = ({ API_URL, onTestimonialsUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [testimonial, setTestimonial] = useState(null);
  const [originalTestimonial, setOriginalTestimonial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchTestimonialById = async () => {
    if (!searchId.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/${searchId.trim()}`);
      setTestimonial(response.data);
      setOriginalTestimonial(response.data);
      setIsEditing(false);
      setDeleteConfirm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Testimonial not found');
      setTestimonial(null);
      setOriginalTestimonial(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTestimonialById();
  };

  const clearSearch = () => {
    setSearchId('');
    setTestimonial(null);
    setOriginalTestimonial(null);
    setError(null);
    setIsEditing(false);
    setDeleteConfirm(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    clearSearch();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTestimonial(originalTestimonial);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestimonial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (value) => {
    setTestimonial(prev => ({
      ...prev,
      rating: value
    }));
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${API_URL}/${testimonial._id}/status`, { 
        status: newStatus 
      });
      setTestimonial(response.data);
      setOriginalTestimonial(response.data);
      if (onTestimonialsUpdated) onTestimonialsUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${testimonial._id}`, testimonial);
      setTestimonial(response.data);
      setOriginalTestimonial(response.data);
      setIsEditing(false);
      if (onTestimonialsUpdated) onTestimonialsUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${testimonial._id}`);
      if (onTestimonialsUpdated) onTestimonialsUpdated();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete testimonial');
      setDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${star <= rating ? 'text-yellow-500' : 'text-gray-300'} ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={() => isEditing && handleRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Search />
        <span>Search Testimonials</span>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Search Testimonials by ID</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Close />
                  </button>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="Enter Testimonial ID..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    />
                    <button
                      type="submit"
                      disabled={!searchId.trim() || loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </form>

                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full"
                    />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                    <Close className="text-red-700" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Testimonial Details */}
                {testimonial && (
                  <div className="border-t pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Testimonial Details
                          </h3>
                          <p className="text-sm text-gray-600">ID: {testimonial._id}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            testimonial.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={testimonial.name}
                              onChange={handleInputChange}
                              className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                            />
                          ) : (
                            <p className="text-gray-800">{testimonial.name}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={testimonial.email}
                              onChange={handleInputChange}
                              className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                            />
                          ) : (
                            <p className="text-gray-800">{testimonial.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Profession</p>
                          {isEditing ? (
                            <input
                              type="text"
                              name="profession"
                              value={testimonial.profession}
                              onChange={handleInputChange}
                              className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                            />
                          ) : (
                            <p className="text-gray-800">{testimonial.profession}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Rating</p>
                          {isEditing ? (
                            renderStars(testimonial.rating)
                          ) : (
                            renderStars(testimonial.rating)
                          )}
                        </div>
                      </div>

                      {testimonial.image && (
                        <div>
                          <p className="text-sm text-gray-500">Image</p>
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="h-24 w-24 object-cover rounded-md"
                          />
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-gray-500">Testimonial</p>
                        {isEditing ? (
                          <textarea
                            name="testimonial"
                            value={testimonial.testimonial}
                            onChange={handleInputChange}
                            rows={5}
                            className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                          />
                        ) : (
                          <p className="text-gray-800 whitespace-pre-line">{testimonial.testimonial}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Created At</p>
                          <p className="text-gray-800">
                            {new Date(testimonial.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="text-gray-800">
                            {new Date(testimonial.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                              <Cancel fontSize="small" /> Cancel
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={loading}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
                            >
                              <Save fontSize="small" /> Save
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={handleEdit}
                              className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                              <Edit fontSize="small" /> Edit
                            </button>
                            <select
                              value={testimonial.status}
                              onChange={(e) => handleStatusChange(e.target.value)}
                              disabled={loading}
                              className="px-3 py-1 border border-gray-300 rounded-md text-black bg-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                            </select>
                            <button
                              onClick={handleDelete}
                              disabled={loading}
                              className={`flex items-center gap-1 px-3 py-1 ${
                                deleteConfirm ? 'bg-red-800' : 'bg-red-600'
                              } text-white rounded-md hover:bg-red-700 disabled:bg-red-400`}
                            >
                              {deleteConfirm ? (
                                <>
                                  <Warning fontSize="small" /> Confirm?
                                </>
                              ) : (
                                <>
                                  <Delete fontSize="small" /> Delete
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};