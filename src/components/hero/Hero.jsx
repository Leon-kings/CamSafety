/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  Security, 
  Home, 
  Phone, 
  ArrowBackIos, 
  ArrowForwardIos,
  Close,
  Person,
  Email,
  Business,
  Message
} from '@mui/icons-material';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import { slides } from '../../assets/data/data';

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        goToNext();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, isHovered]);

  const goToNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Your message has been sent successfully!');
      setContactModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openContactModal = () => {
    // Pre-fill service if available from slide
    const service = slides[currentSlide]?.service || '';
    setFormData(prev => ({ ...prev, service }));
    setContactModalOpen(true);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div 
      className="relative mt-4 rounded-2xl min-h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className="absolute w-full h-full"
        >
          <img
            src={slides[currentSlide].image}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Hover-based content overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={false}
            variants={{
              visible: { backgroundColor: 'rgba(0,0,0,0.7)' },
              hidden: { backgroundColor: 'rgba(0,0,0,0.5)' }
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-center p-4 max-w-4xl"
              variants={contentVariants}
              transition={{ delay: 0.2 }}
            >
              <motion.h5 
                className="text-white text-xl md:text-2xl uppercase mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <Security className="mr-2" /> {slides[currentSlide].subtitle}
              </motion.h5>
              <motion.h1
                className="text-white text-3xl md:text-6xl font-bold mb-8"
                whileHover={{ scale: 1.02 }}
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4"
                variants={contentVariants}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast.info('Our expert technicians provide comprehensive CCTV installation services tailored to your specific requirements. We handle everything from site survey and camera placement to wiring and system configuration. Our installations include high-quality cameras with night vision, motion detection, and weatherproof housing for outdoor use.')}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center"
                >
                  <Home className="mr-2" /> Quote
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openContactModal}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg flex items-center justify-center"
                >
                  <Phone className="mr-2" /> Contact Us
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

    

      {/* Indicators */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10"
        animate={isHovered ? "visible" : "hidden"}
        variants={{
          visible: { opacity: 1 },
          hidden: { opacity: 0.7 }
        }}
      >

      </motion.div>

      {/* Contact Modal */}
      <Dialog
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle className="flex justify-between items-center border-b p-6">
          <div className="flex items-center">
            <Phone className="text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold">Contact Us</h2>
          </div>
          <IconButton onClick={() => setContactModalOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className="p-6">
          <form onSubmit={handleSubmit} className="py-4">
            <Box mb={3}>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: <Person className="mr-2 text-gray-500" />,
                }}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                label="Your Email"
                variant="outlined"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: <Email className="mr-2 text-gray-500" />,
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
                InputProps={{
                  startAdornment: <Phone className="mr-2 text-gray-500" />,
                }}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                label="Service Interested In"
                variant="outlined"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                InputProps={{
                  readOnly: !!formData.service,
                }}
                helperText={formData.service ? "Pre-selected based on your interest" : ""}
              />
            </Box>

            <Box mb={4}>
              <TextField
                fullWidth
                label="Your Message"
                variant="outlined"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                InputProps={{
                  startAdornment: <Message className="mr-2 text-gray-500" />,
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
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              sx={{
                backgroundColor: '#2563eb',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                },
                py: 1.5
              }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};