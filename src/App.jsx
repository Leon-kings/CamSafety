/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "./App.css";
import { Navbar } from "./components/navbar/Navbar";
import { About } from "./pages/about/About";
import { Services } from "./pages/services/Services";
import { Blogs } from "./components/blogs/Blogs";
import { Contact } from "./pages/contact/Contact";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import NotFound from "./components/not found/Notfound";
import { Footer } from "./components/footer/Footer";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ViewTracker } from "./components/views/ViewTracker";

// Add a simple auth check function
const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

// ProtectedRoute component to check authentication
const ProtectedRoute = ({ element: Element, ...rest }) => {
  return isAuthenticated() ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/" replace />
  );
};

export default function App() {
  const location = useLocation();

  // Save current route to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lastRoute", location.pathname);
  }, [location]);

  // Check for saved route on initial load
  useEffect(() => {
    const lastRoute = localStorage.getItem("lastRoute");
    if (
      lastRoute &&
      lastRoute !== "/" &&
      lastRoute !== window.location.pathname
    ) {
      window.location.href = lastRoute;
    }
  }, []);

  return (
    <>
      <Navbar />
      <ViewTracker/>
      <Routes location={location} key={location.key}>
        <Route path="/" element={<Home />} />
        <Route path="/6272/738A" element={<About />} />
        <Route path="/7812/18u91" element={<Services />} />
        <Route path="/7329832" element={<Blogs />} />
        <Route path="/782130/93en032" element={<Contact />} />
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
        {/* protected route */}
        {/* <Route
          path="/Dashboard"
          element={<ProtectedRoute element={Dashboard} />}
        /> */}
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </>
  );
}
