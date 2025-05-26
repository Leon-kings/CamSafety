import hero from "../images/hero.webp";
import hero1 from "../images/carousel-2.jpg";
import hero2 from "../images/carousel-1.jpg";
import hero3 from "../images/carousel-3.jpg";
// team
import team from "../images/team-1.jpg";
import team1 from "../images/team-2.jpg";
import team2 from "../images/team-3.jpg";
// testimony
import testimony from "../images/testimonial-3.jpg";
import testimony1 from "../images/testimonial-4.jpg";
//
import { Security, Star, WorkspacePremium, Check } from "@mui/icons-material";
export const slides = [
  {
    id: 1,
    image: hero,
    title: "Safe & Secure Home For Your Family",
    subtitle: "Best Security Services",
  },
  {
    id: 2,
    image: hero1,
    title: "Advanced Protection Solutions",
    subtitle: "Best Security Services",
  },
  {
    id: 3,
    image: hero2,
    title: "24/7 Monitoring For Your Peace",
    subtitle: "Best Security Services",
  },
  {
    id: 4,
    image: hero3,
    title: "24/7 Monitoring For Your Peace",
    subtitle: "Best Security Services",
  },
];
export const pricingPlans = [
  {
    id: 1,
    name: "Basic Plan",
    price: 49,
    features: [
      "1 Camera Installation",
      "24/7 Basic Monitoring",
      "Mobile App Access",
      "Cloud Storage (7 days)",
      "Email Alerts",
    ],
    delay: 0.3,
    borderColor: "border-blue-500",
    bgColor: "bg-blue-600",
    btnColor: "bg-blue-600 hover:bg-blue-700",
    icon: Security,
  },
  {
    id: 2,
    name: "Standard Plan",
    price: 99,
    features: [
      "3 Camera Installation",
      "24/7 Advanced Monitoring",
      "Mobile + Desktop Access",
      "Cloud Storage (14 days)",
      "SMS & Email Alerts",
    ],
    delay: 0.6,
    borderColor: "border-gray-600",
    bgColor: "bg-gray-700",
    btnColor: "bg-gray-700 hover:bg-gray-800",
    icon: Star,
  },
  {
    id: 3,
    name: "Extended Plan",
    price: 149,
    features: [
      "6 Camera Installation",
      "24/7 Premium Monitoring",
      "Multi-Device Access",
      "Cloud Storage (30 days)",
      "Instant Call Alerts",
    ],
    delay: 0.9,
    borderColor: "border-blue-500",
    bgColor: "bg-blue-600",
    btnColor: "bg-blue-600 hover:bg-blue-700",
    icon: WorkspacePremium,
  },
];
export const teamData = [
  {
    id: 1,
    name: "John Doe",
    position: "CEO",
    image: team,
    delay: 0.1,
    department: "Executive",
    email: "john@example.com",
    phoneNumbers: [
      { type: "Mobile", number: "+1234567890" },
      { type: "Office", number: "+0987654321" },
    ],
    location: "New York, USA",
    skills: ["Leadership", "Strategy", "Management"],
    bio: "John has over 15 years of experience in...",
    social: {
      twitter: "https://twitter.com/johndoe",
      facebook: "https://facebook.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      instagram: "https://instagram.com/johndoe",
    },
  },
  {
    id: 2,
    name: "John Doe",
    position: "CEO",
    image: team1,
    delay: 0.1,
    department: "Executive",
    email: "john@example.com",
    phoneNumbers: [
      { type: "Mobile", number: "+1234567890" },
      { type: "Office", number: "+0987654321" },
    ],
    location: "New York, USA",
    skills: ["Leadership", "Strategy", "Management"],
    bio: "John has over 15 years of experience in...",
    social: {
      twitter: "https://twitter.com/johndoe",
      facebook: "https://facebook.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      instagram: "https://instagram.com/johndoe",
    },
  },
  {
    id: 3,
    name: "John Doe",
    position: "CEO",
    image: team2,
    delay: 0.1,
    department: "Executive",
    email: "john@example.com",
    phoneNumbers: [
      { type: "Mobile", number: "+1234567890" },
      { type: "Office", number: "+0987654321" },
    ],
    location: "New York, USA",
    skills: ["Leadership", "Strategy", "Management"],
    bio: "John has over 15 years of experience in...",
    social: {
      twitter: "https://twitter.com/johndoe",
      facebook: "https://facebook.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      instagram: "https://instagram.com/johndoe",
    },
  },
];
export const testimonials = [
  {
    id: 1,
    name: "John Smith",
    profession: "Business Owner",
    text: "Dolor et eos labore, stet justo sed est sed. Diam sed sed dolor stet amet eirmod eos labore diam",
    image: testimony,
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    profession: "Homeowner",
    text: "Excellent service! The team was professional and the installation was flawless.",
    image: testimony1,
    rating: 4,
  },
  {
    id: 3,
    name: "Michael Brown",
    profession: "Office Manager",
    text: "Our security system has never been better. Highly recommend their services.",
    image: testimony,
    rating: 5,
  },
  {
    id: 4,
    name: "Emily Davis",
    profession: "Store Manager",
    text: "Quick response time and excellent customer support. Very satisfied!",
    image: testimony1,
    rating: 4,
  },
  {
    id: 5,
    name: "Michael Brown",
    profession: "Office Manager",
    text: "Our security system has never been better. Highly recommend their services.",
    image: testimony,
    rating: 5,
  },
  {
    id: 6,
    name: "Emily Davis",
    profession: "Store Manager",
    text: "Quick response time and excellent customer support. Very satisfied!",
    image: testimony1,
    rating: 4,
  },
];

