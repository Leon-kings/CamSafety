/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Star,
  EmojiEvents,
  Security,
  Info,
  ArrowForward,
  Close,
  CheckCircle,
  Settings,
  Support,
  CameraAlt,
} from "@mui/icons-material";
import about from "../../assets/images/about.jpg";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

export const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLearnMore = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const zoomInVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
      },
    },
  };

  const features = [
    {
      icon: <Star className="text-white text-5xl mb-4" />,
      title: "15 Years Experience",
      description:
        "Trusted security solutions with a decade and a half of industry leadership",
      bgColor: "bg-blue-600",
      borderColor: "border-yellow-500",
    },
    {
      icon: <EmojiEvents className="text-white text-5xl mb-4" />,
      title: "Award Winning",
      description:
        "Recognized excellence in security innovation and customer service",
      bgColor: "bg-gray-700",
      borderColor: "border-blue-500",
    },
  ];

  const services = [
    {
      icon: <CameraAlt className="text-blue-600 mr-4 text-3xl" />,
      title: "HD CCTV Installation",
      description:
        "High-definition cameras with night vision and motion detection",
    },
    {
      icon: <Settings className="text-blue-600 mr-4 text-3xl" />,
      title: "System Maintenance",
      description:
        "Regular checkups and software updates to keep your system running smoothly",
    },
    {
      icon: <Support className="text-blue-600 mr-4 text-3xl" />,
      title: "24/7 Monitoring",
      description:
        "Professional monitoring services for immediate response to security events",
    },
    {
      icon: <CheckCircle className="text-blue-600 mr-4 text-3xl" />,
      title: "Smart Home Integration",
      description: "Connect your security system with other smart home devices",
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true }}
      className="py-16 px-4 md:px-8 mt-4 rounded-2xl bg-gray-50"
      id="about"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
          {/* Image Section */}
          <motion.div
            variants={zoomInVariants}
            className="w-full lg:w-1/2 relative rounded-xl overflow-hidden shadow-2xl"
          >
            <img className="w-full h-full object-cover" src={about} alt="" />
          </motion.div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <motion.div variants={itemVariants} className="mb-8 items-center">
              <div className="flex items-center mb-4">
                <Info className="text-blue-600 mr-2" fontSize="large" />
                <h5 className="text-blue-600 text-lg uppercase tracking-widest font-medium">
                  About Our Company
                </h5>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Advanced Security Solutions for Your Peace of Mind
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                We specialize in cutting-edge CCTV systems that provide
                comprehensive surveillance for homes and businesses.
              </p>
              <p className="text-gray-700 mb-8">
                Founded in 2008, our team of security experts has installed over
                5,000 systems across the region. We combine technical expertise
                with personalized service to deliver solutions that actually
                work.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={zoomInVariants}
                viewport={{ once: true }}
                className={`${feature.bgColor} flex flex-col justify-center items-center text-center border-b-4 ${feature.borderColor} rounded-xl p-8 h-full min-h-[200px] shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                <p className="text-white text-5xl mb-4">{feature.icon}</p>
                <h4 className="text-white text-xl font-semibold mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-200">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLearnMore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg inline-flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>Learn More About Our Services</span>
            <ArrowForward className="ml-2" />
          </motion.button>
        </motion.div>

        {/* Services Modal */}
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              borderRadius: "16px",
              padding: "20px",
            },
          }}
        >
          <DialogTitle className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center">
              <Security className="text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">
                Our Comprehensive Services
              </h2>
            </div>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-4 text-3xl">
                      {service.icon}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        {service.title}
                      </h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Why Choose Us?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1" />
                  <span>Certified security professionals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1" />
                  <span>Customized security solutions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1" />
                  <span>24/7 customer support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-1" />
                  <span>Competitive pricing with no hidden fees</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg inline-flex items-center transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.section>
  );
};
