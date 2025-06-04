/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
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
} from '@mui/icons-material';


const API_URL ='https://camera-safety.onrender.com/contact/messaging';

// Status configuration
const statusConfig = {
  pending: {
    icon: <Pending className="text-yellow-500" />,
    actionIcon: <CheckCircle />,
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    nextStatus: 'processed',
  },
  processed: {
    icon: <CheckCircle className="text-green-500" />,
    actionIcon: <Warning />,
    label: 'Processed',
    color: 'bg-green-100 text-green-800',
    nextStatus: 'rejected',
  },
  rejected: {
    icon: <Warning className="text-red-500" />,
    actionIcon: <Pending />,
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    nextStatus: 'pending',
  },
};

const contactService = {
  getContacts: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
        timeout: 10000,
      });
      return {
        contacts: response.data?.contacts || [],
        totalPages: response.data?.totalPages || 1,
      };
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch contacts');
    }
  },

  createContact: async (contactData) => {
    try {
      const response = await axios.post(API_URL, contactData, {
        timeout: 8000,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create contact:', error);
      throw new Error(error.response?.data?.message || 'Failed to create contact');
    }
  },

  updateContact: async (id, contactData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, contactData, {
        timeout: 8000,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update contact:', error);
      throw new Error(error.response?.data?.message || 'Failed to update contact');
    }
  },

  deleteContact: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        timeout: 5000,
      });
      return true;
    } catch (error) {
      console.error('Failed to delete contact:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete contact');
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
      console.error('Failed to update status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update status');
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
                  ? `Edit Contact (ID: ${currentContact._id.substring(0, 8)}...)`
                  : 'Add New Contact'}
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
                      currentContact._id ? 'bg-gray-100 cursor-not-allowed' : ''
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
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="status"
                            value={key}
                            checked={currentContact.status === key}
                            onChange={() =>
                              onInputChange({
                                target: { name: 'status', value: key },
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
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </span>
                ) : currentContact._id ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SearchContactsModal = ({ API_URL, onContactsUpdated }) => {
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
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Search />
        <span>Search Contacts</span>
      </button>

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

                {loading && (
                  <div className="flex justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full"
                    />
                  </div>
                )}

                {error && (
                  <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                    <Close className="text-red-700" />
                    <span>{error}</span>
                  </div>
                )}

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
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            statusConfig[contact.status]?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {statusConfig[contact.status]?.label || contact.status}
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
                              {Object.keys(statusConfig).map((status) => (
                                <option key={status} value={status}>
                                  {statusConfig[status]?.label}
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

export const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    status: 'pending',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getContacts(page, 10);
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
    fetchContacts();
  }, [page]);

  const openModal = (contact = null) => {
    setCurrentContact(
      contact || {
        name: '',
        email: '',
        subject: '',
        message: '',
        status: 'pending',
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
        toast.success('Contact updated successfully!');
      } else {
        await contactService.createContact(currentContact);
        toast.success('Contact created successfully!');
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
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setIsProcessing(true);
      try {
        await contactService.deleteContact(id);
        toast.success('Contact deleted successfully!');
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
            {typeof value === 'string' && value.length > 50
              ? `${value.substring(0, 50)}...`
              : value}
          </span>
        </div>
      </td>
    );
  };

  return (
    <div className="min-h-screen mt-4 rounded-2xl bg-gray-50 p-2 sm:p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-black">
          Contact Management
        </h3>
        <div className="flex gap-2">
          <SearchContactsModal API_URL={API_URL} onContactsUpdated={fetchContacts} />
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2"
          >
            <Add fontSize="small" className="sm:font-size-medium" />
            <span className="text-sm sm:text-base">Add Contact</span>
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
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
                      <h3 className="font-medium text-black">{contact.name}</h3>
                      <p className="text-sm text-black">{contact.email}</p>
                      <p className="text-xs text-gray-600">{contact.subject}</p>
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
              <div className="text-center py-8 text-black">No contacts found</div>
            )}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Subject', 'Message', 'Status', 'Date', 'Actions'].map(
                    (label) => renderTableCell(label, label, true)
                  )}
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
                      {renderTableCell('Name', contact.name)}
                      {renderTableCell('Email', contact.email)}
                      {renderTableCell('Subject', contact.subject)}
                      {renderTableCell('Message', contact.message)}
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
                        'Date',
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
                              handleStatusChange(contact._id, contact.status)
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
                    <td colSpan="7" className="px-4 py-6 text-center text-black">
                      No contacts found
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
                {Math.min(page * 10, contacts.length)} of {totalPages * 10} contacts
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isProcessing}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg ${
                    page === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300 text-black'
                  }`}
                >
                  Previous
                </button>
                <span className="px-3 py-1 sm:px-4 sm:py-2 text-black">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isProcessing}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg ${
                    page === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300 text-black'
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
  );
};

