/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import blog from '../../assets/images/blog-1.jpg'
import blog1 from '../../assets/images/blog-2.jpg'
const serviceData = {
  services: [
    {
      id: 1,
      title: "Home Security Camera Installation",
      excerpt: "Professional installation of home surveillance systems to protect your property.",
      content: `
        <h3 class="text-xl font-semibold mb-3">Complete Home Security Solutions</h3>
        <p class="mb-4">Our expert technicians provide end-to-end home security camera installation services including:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Site assessment and camera placement planning</li>
          <li>Wired and wireless camera installation</li>
          <li>Night vision and motion detection setup</li>
          <li>Remote viewing configuration for smartphones</li>
          <li>Cloud storage and local backup options</li>
        </ul>
        <p>We work with all major brands and offer customized solutions based on your home's layout and security needs.</p>
      `,
      category: "Residential",
      readTime: "5 min",
      image: blog
    },
    {
      id: 2,
      title: "Commercial CCTV Systems",
      excerpt: "Enterprise-grade surveillance solutions for businesses of all sizes.",
      content: `
        <h3 class="text-xl font-semibold mb-3">Business Security Solutions</h3>
        <p class="mb-4">Our commercial CCTV services include:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>High-resolution IP camera systems</li>
          <li>Multi-camera installations with centralized monitoring</li>
          <li>License plate recognition systems</li>
          <li>Access control integration</li>
          <li>24/7 monitoring options</li>
          <li>Compliance with industry regulations</li>
        </ul>
        <p>We provide scalable solutions that grow with your business needs.</p>
      `,
      category: "Commercial",
      readTime: "7 min",
      image: blog1
    },
    {
      id: 3,
      title: "Camera Maintenance & Repair",
      excerpt: "Keep your surveillance system running smoothly with our maintenance plans.",
      content: `
        <h3 class="text-xl font-semibold mb-3">System Maintenance Services</h3>
        <p class="mb-4">Our maintenance services ensure your cameras operate at peak performance:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Regular system health checks</li>
          <li>Lens cleaning and calibration</li>
          <li>Firmware updates</li>
          <li>Cable and connection repairs</li>
          <li>Infrared sensor maintenance</li>
          <li>Emergency repair services</li>
        </ul>
        <p>Choose from quarterly or annual maintenance plans with priority service options.</p>
      `,
      category: "Maintenance",
      readTime: "6 min",
      image: blog
    },
    {
      id: 4,
      title: "Smart Home Integration",
      excerpt: "Connect your security cameras with other smart home devices for complete automation.",
      content: `
        <h3 class="text-xl font-semibold mb-3">Integrated Smart Home Security</h3>
        <p class="mb-4">We specialize in integrating security cameras with:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Smart lighting systems</li>
          <li>Voice assistants (Alexa, Google Home)</li>
          <li>Smart locks and doorbells</li>
          <li>Home automation hubs</li>
          <li>Mobile alert systems</li>
        </ul>
        <p>Create custom automation rules like turning on lights when motion is detected.</p>
      `,
      category: "Residential",
      readTime: "5 min",
      image: blog1
    },
    {
      id: 5,
      title: "License Plate Recognition Systems",
      excerpt: "Advanced LPR technology for parking lots and gated communities.",
      content: `
        <h3 class="text-xl font-semibold mb-3">LPR Technology Solutions</h3>
        <p class="mb-4">Our license plate recognition systems feature:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>High-speed plate capture (day and night)</li>
          <li>Integration with access control systems</li>
          <li>Customizable alert rules</li>
          <li>Vehicle tracking and reporting</li>
          <li>Cloud-based database storage</li>
        </ul>
        <p>Ideal for parking management, security checkpoints, and traffic monitoring.</p>
      `,
      category: "Commercial",
      readTime: "8 min",
      image: blog
    },
    {
      id: 6,
      title: "Outdoor Thermal Imaging Cameras",
      excerpt: "Detect heat signatures for perimeter security in any conditions.",
      content: `
        <h3 class="text-xl font-semibold mb-3">Thermal Security Solutions</h3>
        <p class="mb-4">Our thermal imaging services provide:</p>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>24/7 detection regardless of lighting</li>
          <li>Long-range detection capabilities</li>
          <li>Weather-resistant installations</li>
          <li>Integration with existing security systems</li>
          <li>Customizable alert thresholds</li>
        </ul>
        <p>Perfect for large properties, industrial sites, and critical infrastructure.</p>
      `,
      category: "Specialty",
      readTime: "7 min",
      image: blog1
    },
    
  ]
};

export const Blogs = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openContactModal = (service = "") => {
    setFormData(prev => ({ ...prev, service }));
    setIsContactModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setIsSuccess(false);
    document.body.style.overflow = 'auto';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: formData.service, // Keep the service if pre-selected
        message: ""
      });
    }, 1500);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleServices = serviceData.services.slice(0, visibleCount);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto px-4 mt-4 bg-white text-black rounded-2xl py-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Security Camera Solutions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional installation, maintenance, and integration services for residential and commercial security systems.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt=''
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/images/default-service.jpg";
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {service.category}
                    </span>
                    <span className="text-sm text-gray-500">{service.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-5">{service.excerpt}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openModal(service)}
                      className="flex-1 py-2 hover:bg-gray-200 dark:text-white text-gray-800 rounded-lg transition-colors font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openContactModal(service.title)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {serviceData.services.length > visibleCount && (
            <div className="text-center mt-10">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
              >
                Load More Services
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50"
              onClick={closeModal}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-auto"
            >
              <div className="bg-white text-black rounded-xl shadow-xl overflow-hidden m-4">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedService.title}</h2>
                      <div className="flex items-center mt-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mr-3">
                          {selectedService.category}
                        </span>
                        <span className="text-sm text-gray-500">{selectedService.readTime} read</span>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-6">
                    <img
                      src={selectedService.image}
                      alt={selectedService.title}
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/images/default-service.jpg";
                      }}
                    />
                  </div>

                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedService.content }}
                  />

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold mb-4">Ready to get started?</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => {
                          closeModal();
                          openContactModal(selectedService.title);
                        }}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:text-white text-gray-800 rounded-lg transition-colors font-medium"
                      >
                        Contact Our Team
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contact Us Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50"
              onClick={closeContactModal}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden m-4">
                {/* Modal Header */}
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="font-medium">Contact Our Team</span>
                  </div>
                  <button
                    onClick={closeContactModal}
                    className="text-white hover:text-gray-200 focus:outline-none"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {isSuccess ? (
                    <div className="text-center py-4">
                      <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Thank You!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Your message has been sent successfully. Our team will get back to you soon.
                      </p>
                      <button
                        onClick={closeContactModal}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 text-black">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 border"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 border"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 border"
                            placeholder="(123) 456-7890"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Service Interested In</label>
                        <input
                          type="text"
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          readOnly={!!formData.service}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 border bg-gray-50"
                        />
                
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                        <div className="relative">
                          <div className="absolute top-3 left-3">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={2}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 border"
                            placeholder="Tell us about your project..."
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};