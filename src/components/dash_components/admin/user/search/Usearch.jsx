/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Search, Close, Edit, Delete, Person, AdminPanelSettings, Shield, Save, Cancel } from '@mui/icons-material';

export const SearchUserModal = ({ API_URL, onUserUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchUserById = async () => {
    if (!searchId.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/${searchId.trim()}`);
      setUser(response.data.user);
      setOriginalUser(response.data.user);
      setIsEditing(false);
      setDeleteConfirm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'User not found');
      setUser(null);
      setOriginalUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUserById();
  };

  const clearSearch = () => {
    setSearchId('');
    setUser(null);
    setOriginalUser(null);
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
    setUser(originalUser);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${API_URL}/${user._id}/status`, { 
        status: newStatus 
      });
      setUser(response.data.user);
      setOriginalUser(response.data.user);
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${user._id}`, user);
      setUser(response.data.user);
      setOriginalUser(response.data.user);
      setIsEditing(false);
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
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
      await axios.delete(`${API_URL}/${user._id}`);
      if (onUserUpdated) onUserUpdated();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
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
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Search />
        <span>Search User</span>
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Search User by ID</h2>
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
                      placeholder="Enter User ID..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <button
                      type="submit"
                      disabled={!searchId.trim() || loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
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
                      className="h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"
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

                {/* User Details */}
                {user && (
                  <div className="border-t pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleInputChange}
                                className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                              />
                              <input
                                type="text"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleInputChange}
                                className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {user.firstName} {user.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">ID: {user._id}</p>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {user.status === 'admin' ? (
                            <AdminPanelSettings className="text-purple-500" />
                          ) : (
                            <Person className="text-blue-500" />
                          )}
                          {isEditing ? (
                            <select
                              name="status"
                              value={user.status}
                              onChange={(e) => handleInputChange(e)}
                              className="px-2 py-1 text-xs rounded-full border border-gray-300 text-black"
                            >
                              <option value="user" className="bg-blue-100 text-blue-800">User</option>
                              <option value="admin" className="bg-purple-100 text-purple-800">Admin</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.status === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.status === 'admin' ? 'Admin' : 'User'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={user.email}
                              onChange={handleInputChange}
                              className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                            />
                          ) : (
                            <p className="text-gray-800">{user.email}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phone"
                              value={user.phone || ''}
                              onChange={handleInputChange}
                              className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                              placeholder="N/A"
                            />
                          ) : (
                            <p className="text-gray-800">{user.phone || 'N/A'}</p>
                          )}
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
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              <Edit fontSize="small" /> Edit
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.status === 'admin' ? 'user' : 'admin')}
                              disabled={loading}
                              className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
                            >
                              <Shield fontSize="small" /> Change Status
                            </button>
                            <button
                              onClick={handleDelete}
                              disabled={loading}
                              className={`flex items-center gap-1 px-3 py-1 ${
                                deleteConfirm ? 'bg-red-800' : 'bg-red-600'
                              } text-white rounded-md hover:bg-red-700 disabled:bg-red-400`}
                            >
                              <Delete fontSize="small" /> {deleteConfirm ? 'Confirm?' : 'Delete'}
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