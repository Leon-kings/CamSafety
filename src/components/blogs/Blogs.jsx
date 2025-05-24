/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import hero from "../../assets/images/hero.webp";

// Local blog data object
const blogData = {
  blogs: [
    {
      id: 1,
      title: "Getting Started with React",
      excerpt:
        "Learn the basics of React in this comprehensive guide for beginners.",
      content: "Full content about React basics...",
      slug: "getting-started-with-react",
      date: "2023-05-15",
      category: "React",
      readTime: "5 min",
      image: hero,
      authorId: "auth1",
    },
    {
      id: 2,
      title: "Advanced CSS Techniques",
      excerpt:
        "Explore modern CSS features that will take your styling to the next level.",
      content: "Full content about CSS techniques...",
      slug: "advanced-css-techniques",
      date: "2023-06-22",
      category: "CSS",
      readTime: "8 min",
      image: hero,
      authorId: "auth2",
    },
    {
      id: 3,
      title: "JavaScript Performance Optimization",
      excerpt:
        "Tips and tricks to make your JavaScript code run faster and smoother.",
      content: "Full content about JS optimization...",
      slug: "javascript-performance",
      date: "2023-07-10",
      category: "JavaScript",
      readTime: "10 min",
      image: hero,
      authorId: "auth1",
    },
    {
      id: 4,
      title: "Building Accessible Web Applications",
      excerpt:
        "Learn how to create web apps that everyone can use regardless of ability.",
      content: "Full content about accessibility...",
      slug: "web-accessibility",
      date: "2023-08-05",
      category: "Accessibility",
      readTime: "7 min",
      image: hero,
      authorId: "auth3",
    },
    {
      id: 5,
      title: "State Management in 2023",
      excerpt:
        "Comparing different state management solutions for modern web apps.",
      content: "Full content about state management...",
      slug: "state-management-2023",
      date: "2023-09-18",
      category: "React",
      readTime: "12 min",
      image: hero,
      authorId: "auth2",
    },
    {
      id: 6,
      title: "State Management in 2023",
      excerpt:
        "Comparing different state management solutions for modern web apps.",
      content: "Full content about state management...",
      slug: "state-management-2023",
      date: "2023-09-18",
      category: "React",
      readTime: "12 min",
      image: hero,
      authorId: "auth2",
    },
  ],
};

export const Blogs = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  // Safe data access methods
  const getVisibleBlogs = () => {
    return blogData.blogs.slice(0, visibleCount);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const visibleBlogs = getVisibleBlogs();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=" mx-auto px-4 mt-4 bg-white text-black rounded-2xl py-8"
    >
      {/* Featured Blog */}
      {blogData.featured && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 bg-gray-50 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={blogData.featured.image || "/images/default-featured.jpg"}
                alt={blogData.featured.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/images/default-featured.jpg";
                }}
              />
            </div>
            <div className="p-8 md:w-1/2">
              <div className="uppercase text-sm font-semibold text-blue-600 mb-2">
                Featured Post
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {blogData.featured.title}
              </h1>
              <p className="text-gray-600 mb-6">{blogData.featured.excerpt}</p>
              <div className="flex items-center">
                <div>
                  <p className="text-xs text-gray-500">
                    {new Date(blogData.featured.date).toLocaleDateString()} ·{" "}
                    {blogData.featured.readTime} read
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Blog List */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Articles</h2>

      {visibleBlogs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No blog posts available</h3>
          <p className="text-gray-500 mt-2">
            Our writers are working on new content
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={blog.image || "/images/default-blog.jpg"}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/images/default-blog.jpg";
                  }}
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      Read more
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {blogData.blogs.length > visibleCount && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Load More ({blogData.blogs.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
