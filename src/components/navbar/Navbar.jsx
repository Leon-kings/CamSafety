/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Menu,
  Close,
  AccountCircle,
  Login,
  Logout,
  PersonAdd,
  AdminPanelSettings
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  
  });

  // API base URL - replace with your actual API endpoint
  const API_URL = "https://camera-safety.onrender.com";

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (token && user) {
      setIsLoggedIn(true);
      setIsAdmin(user.status?.toLowerCase() === 'admin');
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      // Store token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      setIsLoggedIn(true);
      setIsAdmin(response.data.user?.status?.toLowerCase() === 'admin');
      setOpenLogin(false);
      toast.success("Login successful!");

      // Navigate based on user status
      const userStatus = response.data.user?.status?.toLowerCase();
      if (userStatus === 'admin') {
        navigate('/Dashboard');
      } else if (userStatus === 'user') {
        navigate('/37911');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/users`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      toast.success("Registration successful! Please login.");
      setOpenRegister(false);
      setOpenLogin(true);
      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
      
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsAdmin(false);
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link to={"/"} className="text-xl font-bold text-gray-900">
                SHIELD
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to={"/"}
                className="text-gray-900 dark:text-black px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to={"/6272/738A"}
                className="text-gray-900 dark:text-black px-3 py-2 text-sm font-medium"
              >
                About
              </Link> 
              <Link
                to={"/7812/18u91"}
                className="text-gray-900 dark:text-black px-3 py-2 text-sm font-medium"
              >
                Services
              </Link>
              <Link
                to={"/782130/93en032"}
                className="text-gray-900 dark:text-black px-3 py-2 text-sm font-medium"
              >
                Contact
              </Link>
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4 ml-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  {isAdmin ? (
                    // Admin icons
                    <>
                      <div className="flex items-center">
                        <AdminPanelSettings className="text-gray-600 !text-[28px]" />
                        <span className="ml-2 text-gray-900 text-sm font-medium">
                          Admin
                        </span>
                      </div>
                    </>
                  ) : (
                    // User icons
                    <div className="flex items-center">
                      <AccountCircle className="text-gray-600 !text-[28px]" />
                      <span className="ml-2 text-gray-900 text-sm font-medium">
                        User
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-white dark:text-black text-sm font-medium"
                  >
                    <Logout className="mr-1 !text-[20px]" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setOpenLogin(true)}
                    className="flex items-center text-white dark:text-white text-sm font-medium"
                  >
                    <Login className="mr-1 !text-[20px]" />
                    Login
                  </button>
                  <button
                    onClick={() => setOpenRegister(true)}
                    className="flex items-center text-white dark:text-white text-sm font-medium"
                  >
                    <PersonAdd className="mr-1 !text-[20px]" />
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-900 dark:text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <Close className="!text-[28px] text-white" />
                ) : (
                  <Menu className="!text-[28px] text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to={"/"}
                className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md text-base font-medium"
              >
                Home
              </Link>
              <Link
                to={"/6272/738A"}
                className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md text-base font-medium"
              >
                About
              </Link>
              <Link
                to={"/7812/18u91"}
                className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md text-base font-medium"
              >
                Services
              </Link>
              <Link
                to={"/782130/93en032"}
                className="block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md text-base font-medium"
              >
                Contact
              </Link>

              {isLoggedIn ? (
                <div className="px-3 py-2">
                  <div className="flex items-center">
                    {isAdmin ? (
                      <AdminPanelSettings className="text-gray-600 !text-[28px]" />
                    ) : (
                      <AccountCircle className="text-gray-600 !text-[28px]" />
                    )}
                    <span className="ml-2 text-gray-900 text-base font-medium">
                      {isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center mt-2 text-gray-900 dark:text-white text-base font-medium"
                  >
                    <Logout className="mr-1 !text-[20px] text-white" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <button
                    onClick={() => {
                      setOpenLogin(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-gray-900 dark:text-white text-base font-medium"
                  >
                    <Login className="mr-1 !text-[20px] text-white" />
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setOpenRegister(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-gray-900 dark:text-white text-base font-medium"
                  >
                    <PersonAdd className="mr-1 !text-[20px] text-white" />
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <Dialog
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <span>Login to Your Account</span>
          <IconButton onClick={() => setOpenLogin(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              margin="normal"
              required
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              margin="normal"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
            <div className="text-center">
              Don't have an account?{" "}
              <Button
                onClick={() => {
                  setOpenLogin(false);
                  setOpenRegister(true);
                }}
              >
                Register
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <span>Create New Account</span>
          <IconButton onClick={() => setOpenRegister(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              name="name"
              label="Full Name"
              margin="normal"
              required
              autoFocus
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              margin="normal"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              name="phone"
              label="Telephone"
              margin="normal"
              required
              value={formData.phone}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              margin="normal"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              margin="normal"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={
                loading ||
                !formData.name ||
                !formData.email ||
                !formData.phone ||
                !formData.password ||
                !formData.confirmPassword
              }
            >
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
            <div className="text-center">
              Already have an account?
              <Button
                onClick={() => {
                  setOpenRegister(false);
                  setOpenLogin(true);
                }}
              >
                Login
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};