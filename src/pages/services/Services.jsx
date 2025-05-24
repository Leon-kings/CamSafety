/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Videocam, // CCTV Installation
  Settings, // Configuration
  Build, // Maintenance
  Handyman, // Repair & Service
  Visibility, // Monitoring
  Lock, // Access Control
  Close,
  Person,
  Email,
  Phone,
  Message,
  Business,
  CheckCircle
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

export const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    service: ''
  });

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

  const serviceItems = [
    {
      id: 1,
      icon: <Videocam fontSize="large" className="text-gray-500" />,
      title: "Installation",
      shortDescription: "Professional CCTV installation services for your security needs",
      fullDescription: "Our expert technicians provide comprehensive CCTV installation services tailored to your specific requirements. We handle everything from site survey and camera placement to wiring and system configuration. Our installations include high-quality cameras with night vision, motion detection, and weatherproof housing for outdoor use.",
      features: [
        "Site survey and security assessment",
        "Camera placement optimization",
        "Professional wiring and cabling",
        "System configuration and testing",
        "High-quality equipment installation"
      ],
      delay: 0.3
    },
    {
      id: 2,
      icon: <Settings fontSize="large" className="text-gray-500" />,
      title: "Configuration",
      shortDescription: "Custom system configuration for optimal performance",
      fullDescription: "We specialize in configuring CCTV systems to meet your specific surveillance needs. Our configuration services include network setup, remote access configuration, motion detection settings, and storage optimization. We ensure your system is perfectly tuned for your environment and security requirements.",
      features: [
        "Network and IP configuration",
        "Remote access setup",
        "Motion detection calibration",
        "Storage and recording optimization",
        "User access management"
      ],
      delay: 0.6
    },
    {
      id: 3,
      icon: <Build fontSize="large" className="text-gray-500" />,
      title: "Maintenance",
      shortDescription: "Regular maintenance to keep your system running smoothly",
      fullDescription: "Our maintenance services ensure your CCTV system operates at peak performance. We offer scheduled maintenance packages that include camera cleaning, system diagnostics, software updates, and performance optimization. Preventative maintenance helps avoid costly repairs and system downtime.",
      features: [
        "Scheduled maintenance visits",
        "Camera cleaning and adjustment",
        "System diagnostics",
        "Software and firmware updates",
        "Performance optimization"
      ],
      delay: 0.9
    },
    {
      id: 4,
      icon: <Handyman fontSize="large" className="text-gray-500" />,
      title: "Repair & Service",
      shortDescription: "Expert repair services for all CCTV system issues",
      fullDescription: "When your CCTV system encounters problems, our skilled technicians are ready to help. We diagnose and repair all types of CCTV system issues, from camera malfunctions to DVR/NVR problems. Our repair services include component replacement, wiring fixes, and system troubleshooting.",
      features: [
        "24/7 emergency repair service",
        "Camera and component replacement",
        "Wiring and connection repairs",
        "DVR/NVR troubleshooting",
        "System restoration"
      ],
      delay: 0.3
    },
    {
      id: 5,
      icon: <Visibility fontSize="large" className="text-gray-500" />,
      title: "Monitoring",
      shortDescription: "Professional monitoring for enhanced security",
      fullDescription: "Our monitoring services provide 24/7 surveillance of your property by trained security professionals. We offer both live monitoring and recorded video review services. Our monitoring center can dispatch authorities when suspicious activity is detected, providing an extra layer of security.",
      features: [
        "24/7 professional monitoring",
        "Real-time alert response",
        "Activity logging and reporting",
        "Emergency dispatch coordination",
        "Custom monitoring plans"
      ],
      delay: 0.6
    },
    {
      id: 6,
      icon: <Lock fontSize="large" className="text-gray-500" />,
      title: "Access Control",
      shortDescription: "Integrated access control solutions",
      fullDescription: "Combine your CCTV system with advanced access control for comprehensive security. We design and install access control systems that integrate with your surveillance, including keycard systems, biometric scanners, and remote access management. Perfect for businesses and high-security areas.",
      features: [
        "Keycard and keypad systems",
        "Biometric access solutions",
        "Remote access management",
        "Integration with CCTV",
        "Time-based access control"
      ],
      delay: 0.9
    }
  ];

  const handleReadMore = (service) => {
    setSelectedService(service);
    setOpenServiceModal(true);
  };

  const handleCloseServiceModal = () => {
    setOpenServiceModal(false);
    setSelectedService(null);
  };

  const handleOpenContactModal = (serviceTitle = '') => {
    setFormData(prev => ({
      ...prev,
      service: serviceTitle || selectedService?.title || ''
    }));
    setOpenContactModal(true);
    setOpenServiceModal(false);
  };

  const handleCloseContactModal = () => {
    setOpenContactModal(false);
    setIsSuccess(false);
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
      // Replace with your actual API endpoint
      const response = await fetch('https://your-api-endpoint.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          service: formData.service // Keep the service for potential follow-up
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true }}
      className="container-fluid py-20 mt-4 rounded-2xl bg-white"
      id="services"
    >
      <div className="container">
        <motion.div 
          variants={itemVariants}
          className="text-center mx-auto mb-12 max-w-2xl"
        >
          <h5 className="text-blue-600 uppercase tracking-widest mb-4">
            Services
          </h5>
          <h1 className="text-4xl text-black md:text-5xl font-bold">
            Our Excellent CCTV Security Services
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceItems.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: service.delay }}
              whileHover={{ y: -5 }}
              className="bg-gray-50 border-b-4 border-blue-500 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-8 text-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="inline-block mb-6"
                >
                  {service.icon}
                </motion.div>
                <h5 className="text-blue-600 text-lg mb-2">CCTV</h5>
                <h3 className="text-2xl text-blue-400 font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.shortDescription}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReadMore(service)}
                  className="text-blue-600 font-medium flex items-center justify-center mx-auto"
                >
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service Details Modal */}
        <Dialog
          open={openServiceModal}
          onClose={handleCloseServiceModal}
          maxWidth="md"
          fullWidth
        >
          {selectedService && (
            <>
              <DialogTitle className="flex justify-between items-center bg-blue-600 text-white">
                <div className="flex items-center">
                  {selectedService.icon}
                  <span className="ml-2">CCTV {selectedService.title}</span>
                </div>
                <IconButton onClick={handleCloseServiceModal} className="text-white">
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent className="py-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedService.title} Services</h2>
                  <p className="text-gray-700">{selectedService.fullDescription}</p>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Features:</h3>
                    <ul className="space-y-2">
                      {selectedService.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenContactModal(selectedService.title)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Contact Us About This Service
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* Contact Form Modal */}
        <Dialog
          open={openContactModal}
          onClose={handleCloseContactModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="flex justify-between items-center bg-blue-600 text-white">
            <div className="flex items-center">
              <Message className="mr-2" />
              <span>Contact Our Team</span>
            </div>
            <IconButton onClick={handleCloseContactModal} className="text-white">
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className="py-6">
            {isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your message has been sent successfully. Our team will get back to you soon.
                </p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseContactModal}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Close
                </Button>
              </div>
            ) : (
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
                    label="Company (Optional)"
                    variant="outlined"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <Business className="mr-2 text-gray-500" />,
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
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};