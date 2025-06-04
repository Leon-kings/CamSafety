/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Search, Close, Edit, Delete, Save, Cancel, Warning, Receipt, Person, Phone, Home, LocalOffer, CameraAlt, Payment, AttachMoney } from '@mui/icons-material';

export const SearchOrdersModal = ({ API_URL, onOrdersUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState(null);
  const [originalOrder, setOriginalOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchOrderById = async () => {
    if (!searchId.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/${searchId.trim()}`);
      setOrder(response.data);
      setOriginalOrder(response.data);
      setIsEditing(false);
      setDeleteConfirm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
      setOrder(null);
      setOriginalOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrderById();
  };

  const clearSearch = () => {
    setSearchId('');
    setOrder(null);
    setOriginalOrder(null);
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
    setOrder(originalOrder);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.includes('.') ? name.split('.') : [name, null];
    
    setOrder(prev => {
      if (child) {
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      } else {
        return {
          ...prev,
          [parent]: value
        };
      }
    });
  };

  const handlePaymentStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${API_URL}/${order._id}/payment-status`, { 
        status: newStatus 
      });
      setOrder(response.data);
      setOriginalOrder(response.data);
      if (onOrdersUpdated) onOrdersUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${order._id}`, order);
      setOrder(response.data);
      setOriginalOrder(response.data);
      setIsEditing(false);
      if (onOrdersUpdated) onOrdersUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
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
      await axios.delete(`${API_URL}/${order._id}`);
      if (onOrdersUpdated) onOrdersUpdated();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete order');
      setDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const renderFeatureList = (features) => {
    return (
      <ul className="list-disc pl-5">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
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
        <span>Search Orders</span>
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
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Receipt />
                    Search Orders by ID
                  </h2>
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
                      placeholder="Enter Order ID..."
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

                {/* Order Details */}
                {order && (
                  <div className="border-t pt-4">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Order Details
                          </h3>
                          <p className="text-sm text-gray-600">ID: {order._id}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.payment.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : order.payment.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            Payment: {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Customer Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
                          <Person /> Customer Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            {isEditing ? (
                              <input
                                type="text"
                                name="customer.name"
                                value={order.customer.name}
                                onChange={handleInputChange}
                                className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                              />
                            ) : (
                              <p className="text-gray-800">{order.customer.name}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            {isEditing ? (
                              <input
                                type="email"
                                name="customer.email"
                                value={order.customer.email}
                                onChange={handleInputChange}
                                className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                              />
                            ) : (
                              <p className="text-gray-800">{order.customer.email}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone fontSize="small" /> Phone
                            </p>
                            {isEditing ? (
                              <input
                                type="text"
                                name="customer.phone"
                                value={order.customer.phone}
                                onChange={handleInputChange}
                                className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                              />
                            ) : (
                              <p className="text-gray-800">{order.customer.phone}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Home fontSize="small" /> Address
                            </p>
                            {isEditing ? (
                              <textarea
                                name="customer.address"
                                value={order.customer.address}
                                onChange={handleInputChange}
                                rows={2}
                                className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                              />
                            ) : (
                              <p className="text-gray-800 whitespace-pre-line">{order.customer.address}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
                          <LocalOffer /> Order Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Plan ID</p>
                            <p className="text-gray-800">{order.orderDetails.planId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Plan Name</p>
                            {isEditing ? (
                              <input
                                type="text"
                                name="orderDetails.planName"
                                value={order.orderDetails.planName}
                                onChange={handleInputChange}
                                className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                              />
                            ) : (
                              <p className="text-gray-800">{order.orderDetails.planName}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <CameraAlt fontSize="small" /> Camera Count
                            </p>
                            {isEditing ? (
                              <input
                                type="number"
                                name="orderDetails.cameraCount"
                                value={order.orderDetails.cameraCount}
                                onChange={handleInputChange}
                                className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                              />
                            ) : (
                              <p className="text-gray-800">{order.orderDetails.cameraCount}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Features</p>
                            {isEditing ? (
                              <textarea
                                name="orderDetails.features"
                                value={order.orderDetails.features.join('\n')}
                                onChange={(e) => {
                                  const features = e.target.value.split('\n').filter(f => f.trim());
                                  handleInputChange({
                                    target: {
                                      name: 'orderDetails.features',
                                      value: features
                                    }
                                  });
                                }}
                                rows={4}
                                className="px-3 py-1 border border-gray-300 rounded-md w-full text-black"
                              />
                            ) : (
                              renderFeatureList(order.orderDetails.features)
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
                          <Payment /> Payment Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <AttachMoney fontSize="small" /> Original Price
                            </p>
                            <p className="text-gray-800">${order.orderDetails.originalPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <AttachMoney fontSize="small" /> Discount
                            </p>
                            <p className="text-gray-800">${order.orderDetails.discountAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <AttachMoney fontSize="small" /> Final Price
                            </p>
                            <p className="text-gray-800 font-medium">
                              ${order.orderDetails.finalPrice.toFixed(2)} {order.payment.currency}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Created At</p>
                          <p className="text-gray-800">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="text-gray-800">
                            {new Date(order.updatedAt).toLocaleString()}
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
                              value={order.payment.status}
                              onChange={(e) => handlePaymentStatusChange(e.target.value)}
                              disabled={loading}
                              className="px-3 py-1 border border-gray-300 rounded-md text-black bg-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="failed">Failed</option>
                              <option value="refunded">Refunded</option>
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