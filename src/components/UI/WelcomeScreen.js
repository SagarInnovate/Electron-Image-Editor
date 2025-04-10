import React from 'react';
import { motion } from 'framer-motion';

const WelcomeScreen = ({ onOpenFiles }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-lg">
        <motion.div
          className="mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-32 w-32 mx-auto text-primary-500 opacity-80 mb-4"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <h1 className="text-4xl font-bold mb-2 text-white neon-text">Electron Image Editor</h1>
          <p className="text-gray-400 text-lg">A modern, full-featured image editing application</p>
        </motion.div>
        
        <motion.div
          className="mb-8 cyber-panel"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-medium mb-4 text-primary-400">Get Started</h2>
          
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={onOpenFiles}
              className="btn btn-primary mr-4 px-6 py-3 text-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Open Images
            </button>
            
            <div className="text-gray-400 text-sm">or drag and drop files here</div>
          </div>
          
          <div className="text-gray-400 text-sm">
            Supported formats: PNG, JPEG, GIF, WebP, BMP
          </div>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="futuristic-card p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <h3 className="text-white font-medium mb-1">Edit & Transform</h3>
            <p className="text-gray-400 text-sm">Crop, resize, rotate, and apply filters</p>
          </div>
          
          <div className="futuristic-card p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-white font-medium mb-1">Work Offline</h3>
            <p className="text-gray-400 text-sm">No internet required for full functionality</p>
          </div>
          
          <div className="futuristic-card p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-white font-medium mb-1">Bookmark & Index</h3>
            <p className="text-gray-400 text-sm">Save images under custom indexed categories</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;