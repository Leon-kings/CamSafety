import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('https://api.example.com/subscribe', { email });
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-gray-800 text-gray-200 mt-4 rounded-2xl py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Newsletter</h3>
            <p className="text-gray-400">Stay updated with our latest offers</p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded font-medium ${
                  isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to={'/6272/738A'} className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to={'/7812/18u91'} className="hover:text-blue-400 transition-colors">Services</Link></li>
              <li><Link to={'/782130/93en032'} className="hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link to={'/7329832'} className="hover:text-blue-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Current Time */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Current Time</h3>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-2xl font-mono text-center">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-gray-400 text-center mt-2">
                {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LD. </p>
        </div>
      </div>
    </footer>
  );
};

