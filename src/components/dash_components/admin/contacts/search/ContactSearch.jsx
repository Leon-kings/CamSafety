/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Search, 
  Close, 
  Edit, 
  Delete, 
  Mail, 
  Save, 
  Cancel, 
  Warning,
  CheckCircle,
  Pending,
  ErrorOutline
} from '@mui/icons-material';

// Status configuration matching your Mongoose schema
const statusConfig = {
  pending: {
    icon: <Pending className="text-yellow-500" />,
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800'
  },
  processed: {
    icon: <CheckCircle className="text-green-500" />,
    label: 'Processed',
    color: 'bg-green-100 text-green-800'
  },
  rejected: {
    icon: <ErrorOutline className="text-red-500" />,
    label: 'Rejected',
    color: 'bg-red-100 text-red-800'
  }
};

export const SearchContactsModal = ({ API_URL, onContactsUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [contact, setContact] = useState(null);
  const [originalContact, setOriginalContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchContactById = async () => {
    if (!searchId.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/${searchId.trim()}`);
      setContact(response.data.contact);
      setOriginalContact(response.data.contact);
      setIsEditing(false);
      setDeleteConfirm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Contact not found');
      setContact(null);
      setOriginalContact(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchContactById();
  };

  const clearSearch = () => {
    setSearchId('');
    setContact(null);
    setOriginalContact(null);
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
    setContact(originalContact);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${API_URL}/${contact._id}/status`, { 
        status: newStatus 
      });
      setContact(response.data.contact);
      setOriginalContact(response.data.contact);
      if (onContactsUpdated) onContactsUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${contact._id}`, contact);
      setContact(response.data.contact);
      setOriginalContact(response.data.contact);
      setIsEditing(false);
      if (onContactsUpdated) onContactsUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contact');
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
      await axios.delete(`${API_URL}/${contact._id}`);
      if (onContactsUpdated) onContactsUpdated();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contact');
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
        <span>Search Contacts</span>
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
                  <h2 className="text-xl font-bold text-gray-800">Search Contacts by ID</h2>
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
                      placeholder="Enter Contact ID..."
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
                    <ErrorOutline className="text-red-700" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Contact Details */}
                {contact && (
                  <div className="border-t pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Mail className="text-indigo-500" />
                            Contact Details
                          </h3>
                          <p className="text-sm text-gray-600">ID: {contact._id}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {statusConfig[contact.status]?.icon}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            statusConfig[contact.status]?.color
                          }`}>
                            {statusConfig[contact.status]?.label}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={contact.name}
                            onChange={handleInputChange}
                            className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                            required
                          />
                        ) : (
                          <p className="text-gray-800">{contact.name}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={contact.email}
                            onChange={handleInputChange}
                            className="px-3 py-1 border border-gray-300 rounded-md w-full text-black bg-gray-100"
                            disabled
                            required
                          />
                        ) : (
                          <p className="text-gray-800">{contact.email}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Subject</p>
                        {isEditing ? (
                          <input
                            type="text"
                            name="subject"
                            value={contact.subject}
                            onChange={handleInputChange}
                            className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                            required
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">{contact.subject}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Message</p>
                        {isEditing ? (
                          <textarea
                            name="message"
                            value={contact.message}
                            onChange={handleInputChange}
                            rows={5}
                            className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                            required
                          />
                        ) : (
                          <p className="text-gray-800 whitespace-pre-line">{contact.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Created At</p>
                          <p className="text-gray-800">
                            {new Date(contact.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="text-gray-800">
                            {new Date(contact.updatedAt).toLocaleString()}
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
                              value={contact.status}
                              onChange={(e) => handleStatusChange(e.target.value)}
                              disabled={loading}
                              className="px-3 py-1 border border-gray-300 rounded-md text-black bg-white"
                            >
                              {Object.keys(statusConfig).map(status => (
                                <option key={status} value={status}>
                                  {statusConfig[status].label}
                                </option>
                              ))}
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