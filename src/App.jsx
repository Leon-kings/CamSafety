import React from "react";
import "./App.css";
import { Navbar } from "./components/navbar/Navbar";
import { Hero } from "./components/hero/Hero";
import { About } from "./pages/about/About";
import { Services } from "./pages/services/Services";
import { PricingPlan } from "./pages/pricing/PricePlan";
import { Offer } from "./pages/offer/Offers";
import { Team } from "./pages/team/Team";
import { Testimonials } from "./pages/testimony/Testimony";
import { Blogs } from "./components/blogs/Blogs";
import { Contact } from "./pages/contact/Contact";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import NotFound from "./components/not found/Notfound";
import { Footer } from "./components/footer/Footer";



export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/6272/738A" element={<About />} />
        <Route path="/7812/18u91" element={<Services />} />
        <Route path="/7329832" element={<Blogs />} />
        <Route path="/782130/93en032" element={<Contact />} />
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </>
  );
}