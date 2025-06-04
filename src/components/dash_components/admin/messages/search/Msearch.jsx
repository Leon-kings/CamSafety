/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Search, Close, Edit, Delete, Mail, Save, Cancel, Warning } from '@mui/icons-material';

export const SearchMessagesModal = ({ API_URL, onMessagesUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [message, setMessage] = useState(null);
  const [originalMessage, setOriginalMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchMessageById = async () => {
    if (!searchId.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/${searchId.trim()}`);
      setMessage(response.data.message);
      setOriginalMessage(response.data.message);
      setIsEditing(false);
      setDeleteConfirm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Message not found');
      setMessage(null);
      setOriginalMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMessageById();
  };

  const clearSearch = () => {
    setSearchId('');
    setMessage(null);
    setOriginalMessage(null);
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
    setMessage(originalMessage);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMessage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${API_URL}/${message._id}/status`, { 
        status: newStatus 
      });
      setMessage(response.data.message);
      setOriginalMessage(response.data.message);
      if (onMessagesUpdated) onMessagesUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${message._id}`, message);
      setMessage(response.data.message);
      setOriginalMessage(response.data.message);
      setIsEditing(false);
      if (onMessagesUpdated) onMessagesUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update message');
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
      await axios.delete(`${API_URL}/${message._id}`);
      if (onMessagesUpdated) onMessagesUpdated();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
      setDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Search />
        <span>Search Messages</span>
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
                  <h2 className="text-xl font-bold text-gray-800">Search Messages by ID</h2>
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
                      placeholder="Enter Message ID..."
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

                {/* Message Details */}
                {message && (
                  <div className="border-t pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Mail className="text-indigo-500" />
                            Message Details
                          </h3>
                          <p className="text-sm text-gray-600">ID: {message._id}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            message.status === 'unread' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : message.status === 'archived'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          {isEditing ? (
                            <input
                              type="text"
                              name="sender"
                              value={message.sender}
                              onChange={handleInputChange}
                              className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                            />
                          ) : (
                            <p className="text-gray-800">{message.sender}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">To</p>
                          {isEditing ? (
                            <input
                              type="text"
                              name="recipient"
                              value={message.recipient}
                              onChange={handleInputChange}
                              className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                            />
                          ) : (
                            <p className="text-gray-800">{message.recipient}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Subject</p>
                        {isEditing ? (
                          <input
                            type="text"
                            name="subject"
                            value={message.subject}
                            onChange={handleInputChange}
                            className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">{message.subject}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Message</p>
                        {isEditing ? (
                          <textarea
                            name="content"
                            value={message.content}
                            onChange={handleInputChange}
                            rows={5}
                            className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                          />
                        ) : (
                          <p className="text-gray-800 whitespace-pre-line">{message.content}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Created At</p>
                          <p className="text-gray-800">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="text-gray-800">
                            {new Date(message.updatedAt).toLocaleString()}
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
                              value={message.status}
                              onChange={(e) => handleStatusChange(e.target.value)}
                              disabled={loading}
                              className="px-3 py-1 border border-gray-300 rounded-md text-black bg-white"
                            >
                              <option value="unread">Unread</option>
                              <option value="read">Read</option>
                              <option value="archived">Archived</option>
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