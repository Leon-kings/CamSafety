/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Mail as MailIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  Help as HelpIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

export default function NotFound() {
  const [searchId, setSearchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.warning("Please enter an ID to search", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(
        `https://camera-safety.onrender.com/users/${searchId}`
      );
      setSearchResult(response.data.users);
      setIsModalOpen(true);
      toast.success("Item found!", { position: "top-center" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Item not found", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col mt-4 rounded-2xl items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-black px-4"
    >

      {/* Search Results Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <DialogTitle className="flex justify-between items-center bg-gray-100">
            <span>Search Result Details</span>
            <IconButton onClick={() => setIsModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="p-6">
            {searchResult ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  {searchResult.name || "Item"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">ID:</p>
                    <p className="font-medium">{searchResult.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status:</p>
                    <p className="font-medium">
                      {searchResult.status || "Active"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Description:</p>
                  <p className="font-medium">
                    {searchResult.description || "No description available"}
                  </p>
                </div>
              </div>
            ) : (
              <p>No data available</p>
            )}
          </DialogContent>
        </motion.div>
      </Dialog>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-lg w-full mt-10 mb-6 bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <motion.div
          className="bg-red-400 p-6 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="flex justify-center text-6xl text-white mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <WarningIcon fontSize="inherit" />
          </motion.div>
          <h1 className="text-5xl font-bold text-white">404</h1>
        </motion.div>

        {/* Content */}
        <div className="p-8 text-center">
          <motion.h2
            className="text-2xl font-semibold text-gray-800 mb-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Page Not Found
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Oops! The page you're looking for doesn't exist or has been moved.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter item ID to search..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <SearchIcon />
              )}
            </motion.button>
          </motion.div>

          {/* Primary Action */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 mb-4"
            >
              <HomeIcon /> Return to Homepage
            </Link>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/782130/93en032"
                className="flex items-center text-black dark:text-black justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
              >
                <MailIcon /> Contact Support
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center text-white gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
              >
                <ArrowBackIcon /> Go Back
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="bg-gray-100 p-4 text-center text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Still need help? Visit our{" "}
          <Link to="/help" className="text-blue-600 hover:underline">
            <HelpIcon fontSize="small" /> help center
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
