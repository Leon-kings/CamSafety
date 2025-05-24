/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  LocationOn,
  Email,
  Phone,
  Person,
  Subject,
  Message,
  Close,
  Login,
  PersonAdd
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';

export const Contact = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Modal states
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Message sent successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true }}
      className="container-fluid mt-4 rounded-2xl bg-white text-black py-20"
    >
      <div className="container px-4">
        <motion.div 
          variants={itemVariants}
          className="text-center mx-auto mb-12 max-w-2xl"
        >
          <h5 className="text-blue-600 uppercase tracking-widest mb-4">
            Contact Us
          </h5>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Please Feel Free To Contact Us
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            custom={0.3}
            className="bg-gray-200 rounded-xl p-8 shadow-md"
          >
            <form onSubmit={handleSubmit} className='text-black'>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Person sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                  <TextField
                    fullWidth
                    label="Your Name"
                    variant="standard"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Email sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                  <TextField
                    fullWidth
                    label="Your Email"
                    variant="standard"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Box>
              </div>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 6 }}>
                <Subject sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Subject"
                  variant="standard"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 6 }}>
                <Message sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                  fullWidth
                  label="Message"
                  variant="standard"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Box>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  sx={{ py: 2, borderRadius: '8px' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </motion.div>
            </form>

            <Divider sx={{ my: 4 }}>OR</Divider>

            <div className="flex justify-center gap-4">
              <Button
                variant="outlined"
                startIcon={<Login />}
                onClick={() => setOpenLogin(true)}
              >
                Login
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setOpenRegister(true)}
              >
                Register
              </Button>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={itemVariants}
            custom={0.6}
            className="bg-gray-200 rounded-xl p-8 shadow-md"
          >
            <div className="space-y-6">
              <div className="flex items-start">
                <LocationOn className="text-blue-600 text-4xl mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Our Office</h3>
                  <p className="text-gray-600">123 Street, New York, USA</p>
                </div>
              </div>
              <div className="flex items-start">
                <Email className="text-blue-600 text-4xl mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Email Us</h3>
                  <p className="text-gray-600">info@example.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="text-blue-600 text-4xl mr-4 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Call Us</h3>
                  <p className="text-gray-600">+012 345 6789</p>
                </div>
              </div>

              <div className="pt-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215373510518!2d-73.98784492416407!3d40.74844047138969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1689877897795!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Login Modal */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="xs" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <span>Login to Your Account</span>
          <IconButton onClick={() => setOpenLogin(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Login
            </Button>
            <div className="text-center">
              <Button onClick={() => {
                setOpenLogin(false);
                setOpenRegister(true);
              }}>
                Don't have an account? Register
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)} maxWidth="xs" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <span>Create New Account</span>
          <IconButton onClick={() => setOpenRegister(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Register
            </Button>
            <div className="text-center">
              <Button onClick={() => {
                setOpenRegister(false);
                setOpenLogin(true);
              }}>
                Already have an account? Login
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

