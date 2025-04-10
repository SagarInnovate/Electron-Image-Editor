import React from 'react';
import { motion } from 'framer-motion';

const TitleBar = () => {
  // Window control handlers
  const handleMinimize = () => {
    window.electron.minimizeWindow();
  };
  
  const handleMaximize = () => {
    window.electron.maximizeWindow();
  };
  
  const handleClose = () => {
    window.electron.closeWindow();
  };
  
  return (
    <div className="title-bar bg-gray-900 border-b border-gray-700">
      <div className="flex items-center">
        <motion.div
          className="h-6 w-6 mr-2"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-500"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </motion.div>
        <h1 className="text-white font-medium">Electron Image Editor</h1>
      </div>
      
      <div className="title-bar-controls flex space-x-2">
        <button
          className="w-6 h-6 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center"
          onClick={handleMinimize}
          title="Minimize"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-900" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center"
          onClick={handleMaximize}
          title="Maximize"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-900" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1V4zm4 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center"
          onClick={handleClose}
          title="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-900" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TitleBar;