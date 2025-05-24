/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

export const PricingPlan = () => {
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

  const handleOrderNow = (planName) => {
    // You can replace this with your actual order logic
    console.log(`Ordering ${planName} plan`);
    // Example: navigate to contact form with plan pre-selected
    // navigate(`/contact?plan=${encodeURIComponent(planName)}`);
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
                    onClick={() => handleOrderNow(plan.name)}
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
    </motion.div>
  );
};
