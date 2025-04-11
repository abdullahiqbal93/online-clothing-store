import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8">
          <motion.h1 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-9xl font-extrabold text-gray-900"
          >
            404
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ delay: 0.3 }}
            className="h-1.5 bg-black mx-auto my-6"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            We're sorry, the page you requested could not be found.
            Please check the URL or go back to the homepage.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition duration-300 ease-in-out"
          >
            Back to Home
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          If you believe this is an error, please contact our support team.
        </p>
      </motion.div>
    </div>
  )
}

export default NotFound