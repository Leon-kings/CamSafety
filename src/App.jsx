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
import { UserManagement } from "./components/dash_components/admin/user/management/UserManagement";
import { MessageManagement } from "./components/dash_components/admin/messages/management/MessageManagement";
import { ContactManagement } from "./components/dash_components/admin/contacts/management/ContactManagement";
import { NewsLetterManagement } from "./components/dash_components/admin/newsletter/NewsLetterManagement";
import { TestimonyManagement } from "./components/dash_components/admin/testimony/management/TestimonyManagement";
import { OrderManagement } from "./components/dash_components/admin/orders/management/OrderManagement";
import { UserDashboard } from "./components/dashboard/UserDashboard";
import { UserNewsLetterManagement } from "./components/dash_components/users/newsletter/UserNewsLetter";
import { UserMessageManagement } from "./components/dash_components/users/messages/UserMessageManagement";
import { UserContactManagement } from "./components/dash_components/users/contacts/UserContact";
import { UserTestimonyManagement } from "./components/dash_components/users/testimony/UserTestimony";
import { UserOrderManagement } from "./components/dash_components/users/orders/UserOrders";
// user


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
      <ViewTracker />
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
        <Route path="/8032782/0209" element={<UserManagement />} />
        <Route path="/9723089/9820" element={<MessageManagement />} />
        <Route path="/1283782/6282" element={<ContactManagement />} />
        <Route path="/9783989/1689" element={<NewsLetterManagement />} />
        <Route path="/7822982/6728" element={<TestimonyManagement />} />
        <Route path="/7822289/2902" element={<OrderManagement />} />
        {/*  */}
        <Route path="/37911" element={<UserDashboard />} />
        <Route path="/92092/93082" element={<UserNewsLetterManagement />} />
        <Route path="/90203/89382" element={<UserMessageManagement />} />
        <Route path="/78320/23943" element={<UserContactManagement />} />
        <Route path="/43272/37191" element={<UserTestimonyManagement />} />
        <Route path="/78631/83672" element={<UserOrderManagement />} />
        {/*  */}
      </Routes>
      <Footer />
    </>
  );
}
