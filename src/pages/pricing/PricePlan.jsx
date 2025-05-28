/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Person,
  Email,
  Phone,
  Home,
  CameraAlt,
  ShoppingCart,
  Close,
  AttachMoney,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

// API configuration
const API_BASE_URL = "https://your-api-endpoint.com/api";
const CREATE_ORDER_ENDPOINT = `${API_BASE_URL}/orders`;

export const PricingPlan = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cameraCount: 1,
    plan: "",
    price: 0,
    discountAmount: 0,
    finalPrice: 0,
  });

  // Animation variants
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

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (delay) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.7,
      },
    }),
  };

  const pricingPlans = [
    {
      id: 1,
      name: "Basic Plan",
      price: 49,
      period: "Mo",
      features: [
        "Up to 4 cameras",
        "24/7 basic monitoring",
        "Cloud storage (7 days)",
        "Mobile app access",
        "Email alerts",
      ],
      borderColor: "border-blue-500",
      bgColor: "bg-blue-600",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      delay: 0.3,
    },
    {
      id: 2,
      name: "Standard Plan",
      price: 99,
      period: "Mo",
      features: [
        "Up to 8 cameras",
        "24/7 professional monitoring",
        "Cloud storage (14 days)",
        "Mobile app access",
        "SMS & email alerts",
        "Priority support",
      ],
      borderColor: "border-gray-500",
      bgColor: "bg-gray-600",
      btnColor: "bg-gray-600 hover:bg-gray-700",
      delay: 0.6,
      popular: true,
    },
    {
      id: 3,
      name: "Premium Plan",
      price: 149,
      period: "Mo",
      features: [
        "Unlimited cameras",
        "24/7 premium monitoring",
        "Cloud storage (30 days)",
        "Mobile app access",
        "SMS, email & push alerts",
        "VIP support",
        "Monthly security reports",
      ],
      borderColor: "border-blue-500",
      bgColor: "bg-blue-600",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      delay: 0.9,
    },
  ];

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPlan(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      cameraCount: 1,
      plan: "",
      price: 0,
      discountAmount: 0,
      finalPrice: 0,
    });
  };

  const handleOrderNow = (plan) => {
    const discountAmount = plan.price * 0.5;
    const finalPrice = plan.price - discountAmount;
    
    setSelectedPlan(plan);
    setFormData({
      ...formData,
      plan: plan.name,
      price: plan.price,
      discountAmount,
      finalPrice,
    });
    setOpenModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "cameraCount") {
      const count = Math.max(1, Math.min(10, parseInt(value) || 1));
      const basePrice = selectedPlan.price * count;
      const discountAmount = basePrice * 0.5;
      const finalPrice = basePrice - discountAmount;
      
      setFormData({
        ...formData,
        cameraCount: count,
        price: basePrice,
        discountAmount,
        finalPrice,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        orderDetails: {
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          cameraCount: formData.cameraCount,
          originalPrice: formData.price,
          discountAmount: formData.discountAmount,
          finalPrice: formData.finalPrice,
          features: selectedPlan.features,
        },
        payment: {
          status: "pending",
          amount: formData.finalPrice,
          currency: "USD",
        },
      };

      // Submit to API
      const response = await axios.post(CREATE_ORDER_ENDPOINT, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success("Order placed successfully! We'll contact you shortly.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      handleCloseModal();
    } catch (error) {
      console.error("Order submission error:", error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Failed to place order. Please try again.";
      
      toast.error(errorMessage, {
        position: "top-right",
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

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true }}
      className="container-fluid py-20 mt-4 rounded-2xl bg-white"
      style={{ marginBottom: "75px" }}
      id="pricing"
    >
      <div className="container px-4">
        <motion.div
          variants={itemVariants}
          className="text-center mx-auto mb-12 max-w-2xl"
        >
          <h5 className="text-blue-600 uppercase tracking-widest mb-4">
            Pricing Plan
          </h5>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Pricing Plan For CCTV Security Services
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              custom={plan.delay}
              variants={cardVariants}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              <div
                className={`h-full border-2 ${plan.borderColor} rounded-lg overflow-hidden flex flex-col`}
              >
                <div
                  className={`${plan.bgColor} text-center pt-8 pb-6 px-6 text-white`}
                >
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex justify-center items-baseline">
                    <span className="text-3xl mr-1">$</span>
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-xl ml-1">/{plan.period}</span>
                  </div>
                </div>
                <div className="flex-grow p-6 bg-gray-50">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 bg-white text-center">
                  <button
                    onClick={() => handleOrderNow(plan)}
                    className={`${plan.btnColor} text-white font-medium py-3 px-8 rounded-lg transition-colors w-full`}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Order Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        className="text-black"
      >
        <DialogTitle className="flex justify-between items-center bg-blue-600 text-white">
          <div className="flex items-center">
            <ShoppingCart className="mr-2" />
            <span>
              {selectedPlan
                ? `Order ${selectedPlan.name} (50% Off)`
                : "Place Your Order"}
            </span>
          </div>
          <IconButton onClick={handleCloseModal} className="text-white">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className="py-8 mt-4">
          {selectedPlan && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{selectedPlan.name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-gray-600">Original Price:</p>
                  <p className="line-through">${formData.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Discount (50%):</p>
                  <p className="text-red-500">-${formData.discountAmount.toFixed(2)}</p>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <p className="text-gray-600 font-semibold">Final Price:</p>
                  <p className="text-green-600 font-bold text-xl">
                    ${formData.finalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="py-3 text-black">
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
                  startAdornment: <Person className="mr-2 text-gray-500" />,
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
                required
                InputProps={{
                  startAdornment: <Phone className="mr-2 text-gray-500" />,
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
                  startAdornment: <Home className="mr-2 text-gray-500" />,
                }}
              />
            </Box>

            <Box mb={3}>
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
                  startAdornment: <CameraAlt className="mr-2 text-gray-500" />,
                }}
              />
            </Box>

            <Box mb={4} className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <TextField
                  fullWidth
                  label="Original Price"
                  variant="outlined"
                  name="price"
                  value={`$${formData.price.toFixed(2)}`}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <AttachMoney className="mr-2 text-gray-500" />,
                  }}
                />
              </div>
              <div className="col-span-1">
                <TextField
                  fullWidth
                  label="Discount"
                  variant="outlined"
                  name="discountAmount"
                  value={`-$${formData.discountAmount.toFixed(2)}`}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <AttachMoney className="mr-2 text-gray-500" />,
                  }}
                />
              </div>
              <div className="col-span-1">
                <TextField
                  fullWidth
                  label="Final Price"
                  variant="outlined"
                  name="finalPrice"
                  value={`$${formData.finalPrice.toFixed(2)}`}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <AttachMoney className="mr-2 text-gray-500" />,
                  }}
                />
              </div>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <ShoppingCart />
              }
            >
              {isSubmitting
                ? "Processing..."
                : `Pay Now ($${formData.finalPrice.toFixed(2)})`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};