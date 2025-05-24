/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Close,
  Person,
  Work,
  Message,
  Star,
  AddCircle,
} from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Box,
  Rating,
  CircularProgress,
} from "@mui/material";
import { testimonials } from "../../assets/data/data";

export const Testimonials = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    rating: 5,
    testimonial: "",
    image: null,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  // Auto slide configuration
  const slideInterval = 3000; // 3 seconds between slides
  const visibleTestimonials = 4; // Number of testimonials visible at once

  useEffect(() => {
    if (testimonials.length <= visibleTestimonials) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prevIndex) =>
          prevIndex >= testimonials.length - visibleTestimonials ? 0 : prevIndex + 1
        );
      }
    }, slideInterval);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const handleTestimonialClick = (testimonial) => {
    setSelectedTestimonial(testimonial);
  };

  const handleCloseModal = () => {
    setSelectedTestimonial(null);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("profession", formData.profession);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("testimonial", formData.testimonial);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        "https://your-api-endpoint.com/testimonials",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        "Testimonial submitted successfully! Thank you for your feedback.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      setOpenForm(false);
      setFormData({
        name: "",
        profession: "",
        rating: 5,
        testimonial: "",
        image: null,
      });
    } catch (error) {
      toast.error("Failed to submit testimonial. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Testimonial submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  // Determine which testimonials to display based on currentIndex
  const getVisibleTestimonials = () => {
    if (testimonials.length <= visibleTestimonials) {
      return testimonials;
    }
    
    const endIndex = currentIndex + visibleTestimonials;
    if (endIndex > testimonials.length) {
      return [
        ...testimonials.slice(currentIndex),
        ...testimonials.slice(0, endIndex - testimonials.length)
      ];
    }
    return testimonials.slice(currentIndex, endIndex);
  };

  return (
    <div className="w-full py-12 bg-white text-black mt-4 rounded-2xl md:py-16">
      <div className="w-full px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="text-center mx-auto mb-12 max-w-xl"
        >
          <h5 className="text-blue-600 uppercase tracking-widest mb-4">
            Testimonial
          </h5>
          <h1 className="text-3xl md:text-4xl font-bold">
            What People Say About Our Services
          </h1>
        </motion.div>

        <div 
          className="w-full grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 overflow-x-auto pb-6 gap-4"
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {getVisibleTestimonials().map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleTestimonialClick(testimonial)}
              className="flex-shrink-0 w-full bg-gray-600 cursor-pointer"
            >
              <div className="text-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="mx-auto rounded-full w-24 h-24 object-cover border-4 border-white shadow-md"
                />
                <div className="bg-gray-50 rounded-lg p-6 mt-6 shadow-md">
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    className="mb-3"
                  />
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {testimonial.text}
                  </p>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500 italic">
                    {testimonial.profession}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation dots */}
        {testimonials.length > visibleTestimonials && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(testimonials.length / visibleTestimonials) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * visibleTestimonials)}
                className={`w-3 h-3 mx-1 rounded-full ${currentIndex >= index * visibleTestimonials && currentIndex < (index + 1) * visibleTestimonials ? 'bg-blue-600' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial set ${index + 1}`}
              />
            ))}
          </div>
        )}

        <motion.div variants={itemVariants} className="text-center mt-8">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            onClick={handleOpenForm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Share Your Experience
          </Button>
        </motion.div>

        {/* Testimonial Detail Modal */}
        <Dialog
          open={!!selectedTestimonial}
          onClose={handleCloseModal}
          maxWidth="md"
        >
          {selectedTestimonial && (
            <>
              <DialogTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Person className="mr-2 text-blue-600" />
                  <span>{selectedTestimonial.name}'s Testimonial</span>
                </div>
                <IconButton onClick={handleCloseModal}>
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent className="py-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <img
                      src={selectedTestimonial.image}
                      alt={selectedTestimonial.name}
                      className="rounded-full w-32 h-32 object-cover mx-auto border-4 border-blue-100"
                    />
                    <div className="text-center mt-4">
                      <h3 className="text-xl font-semibold">
                        {selectedTestimonial.name}
                      </h3>
                      <p className="text-gray-600 italic">
                        {selectedTestimonial.profession}
                      </p>
                      <Rating
                        value={selectedTestimonial.rating}
                        readOnly
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <Message className="text-blue-600 mb-3" />
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedTestimonial.text}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* Testimonial Form Modal */}
        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="flex justify-between items-center">
            <div className="flex items-center">
              <AddCircle className="mr-2 text-blue-600" />
              <span>Share Your Experience</span>
            </div>
            <IconButton onClick={handleCloseForm}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className="py-6">
            <form onSubmit={handleSubmit} className="text-black py-4">
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
                  label="Your Profession"
                  variant="outlined"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: <Work className="mr-2 text-gray-500" />,
                  }}
                />
              </Box>

              <Box mb={3}>
                <div className="flex items-center">
                  <Star className="mr-2 text-gray-500" />
                  <Rating
                    name="rating"
                    value={formData.rating}
                    onChange={handleRatingChange}
                    precision={0.5}
                    size="large"
                  />
                </div>
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Your Testimonial"
                  variant="outlined"
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: <Message className="mr-2 text-gray-500" />,
                  }}
                />
              </Box>

              <Box mb={4}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Your Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
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
              >
                {isSubmitting ? "Submitting..." : "Submit Testimonial"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};