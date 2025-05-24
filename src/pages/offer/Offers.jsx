/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  LocalOffer, 
  ShoppingCart, 
  Info, 
  Close,
  Person,
  Email,
  Phone,
  Home,
  CameraAlt
} from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';

export const Offer = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cameraCount: 1
  });

  const handleOrderClick = () => {
    setOpenModal(true);
  };

  const handleReadMoreClick = () => {
    toast.info('This special offer provides 50% discount on your first CCTV security system order. Limited time only!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('https://your-api-endpoint.com/orders', {
        ...formData,
        offer: '50% First Order Discount'
      });

      toast.success('Order submitted successfully! We will contact you shortly.', {
        position: 'top-right',
        autoClose: 5000,
      });
      setOpenModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        cameraCount: 1
      });
    } catch (error) {
      toast.error('Failed to submit order. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
      });
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.1,
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
      }
    }
  };

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
        className="offer rounded-2xl mt-4 py-12 md:py-16 shadow-xl"
      >
        {/* ... (rest of your existing component JSX) ... */}
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="text-center max-w-4xl">
              <motion.div className="mb-8">
                <div className="flex items-center justify-center">
                  <LocalOffer className="text-white mr-2" fontSize="large" />
                  <h5 className="text-white uppercase tracking-widest text-lg">
                    Special Offer
                  </h5>
                </div>
                <motion.h1 
                  className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mt-4"
                  whileHover={{ scale: 1.02 }}
                >
                  Save 50% On All Items Your First Order
                </motion.h1>
              </motion.div>

              <motion.p className="text-white mb-8 text-lg">
                Eirmod sed tempor lorem ut dolores sit kasd ipsum. Dolor ea et dolore et at sea ea at dolor justo ipsum duo rebum sea. Eos vero eos vero ea et dolore eirmod et. Dolores diam duo lorem. Elitr ut dolores magna sit. Sea dolore sed et.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOrderClick}
                  className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium flex items-center justify-center"
                >
                  <ShoppingCart className="mr-2" /> Order Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReadMoreClick}
                  className="bg-blue-500 hover:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center"
                >
                  <Info className="mr-2" /> Read More
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Order Form Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth className='text-black'>
        <DialogTitle className="flex justify-between items-center bg-blue-600 text-white">
          <div className="flex items-center">
            <ShoppingCart className="mr-2" />
            <span>Place Your Order (50% Off)</span>
          </div>
          <IconButton onClick={handleCloseModal} className="text-white">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className="py-16 mt-4">
          <form onSubmit={handleSubmit} className='py-3 text-black'>
            <Box mb={3}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: <Person className="mr-2 text-gray-500" />
                }}
              />
            </Box>
            
            <Box mb={3}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: <Email className="mr-2 text-gray-500" />
                }}
              />
            </Box>
            
            <Box mb={3}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: <Phone className="mr-2 text-gray-500" />
                }}
              />
            </Box>
            
            <Box mb={3}>
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                multiline
                rows={3}
                InputProps={{
                  startAdornment: <Home className="mr-2 text-gray-500" />
                }}
              />
            </Box>
            
            <Box mb={4}>
              <TextField
                fullWidth
                label="Number of Cameras"
                variant="outlined"
                type="number"
                name="cameraCount"
                value={formData.cameraCount}
                onChange={handleInputChange}
                required
                inputProps={{ min: 1, max: 10 }}
                InputProps={{
                  startAdornment: <CameraAlt className="mr-2 text-gray-500" />
                }}
              />
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <ShoppingCart />}
            >
              {isSubmitting ? 'Submitting...' : 'Place Order (50% Off)'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

