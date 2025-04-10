import React from 'react';
import { motion } from 'framer-motion';

const CanvasControls = ({ zoomLevel, setZoomLevel, imageDetails }) => {
  // Function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };
  
  // Zoom in function
  const zoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.1, 5));
  };
  
  // Zoom out function
  const zoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.1, 0.1));
  };
  
  // Reset zoom function
  const resetZoom = () => {
    setZoomLevel(1);
  };
  
  return (
    <>
      {/* Zoom controls */}
      <motion.div
        className="zoom-control"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          className="w-8 h-8 rounded-l-lg bg-gray-800 text-gray-200 flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
          onClick={zoomOut}
          aria-label="Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 0 1 1-1h8a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          className="w-auto px-2 h-8 bg-gray-800 text-gray-200 flex items-center justify-center hover:text-white transition-colors duration-200"
          onClick={resetZoom}
          aria-label="Reset Zoom"
        >
          {(zoomLevel * 100).toFixed(0)}%
        </button>
        
        <button
          className="w-8 h-8 rounded-r-lg bg-gray-800 text-gray-200 flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
          onClick={zoomIn}
          aria-label="Zoom In"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </motion.div>
      
      {/* Image info panel */}
      <motion.div
        className="glass-panel absolute bottom-4 left-4 py-1 px-3 text-xs text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {imageDetails.width} × {imageDetails.height}px
        {imageDetails.fileSize > 0 && ` | ${formatFileSize(imageDetails.fileSize)}`}
      </motion.div>
      
      {/* Instructions */}
      <motion.div
        className="glass-panel absolute top-4 left-4 py-1 px-3 text-xs text-gray-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p>Alt + Drag to move | Scroll to zoom</p>
      </motion.div>
    </>
  );
};

export default CanvasControls;