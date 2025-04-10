import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImagesSidebar = ({
  images,
  activeImage,
  onSelectImage,
  onDeleteImage,
  onToggleBookmark,
  onOpenFiles,
  bookmarks
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('images'); // 'images' or 'bookmarks'
  const [bookmarkLabel, setBookmarkLabel] = useState('');
  const [showBookmarkInput, setShowBookmarkInput] = useState(null);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Handle bookmark save
  const handleSaveBookmark = (imageId) => {
    onToggleBookmark(imageId, bookmarkLabel);
    setShowBookmarkInput(null);
    setBookmarkLabel('');
  };
  
  // Filter bookmarked images
  const bookmarkedImages = images.filter(img => img.isBookmarked);
  
  // Get images to display based on active tab
  const displayedImages = activeTab === 'bookmarks' ? bookmarkedImages : images;
  
  return (
    <motion.div
      className="sidebar bg-gray-800 border-l border-gray-700"
      initial={{ width: 300 }}
      animate={{ width: isCollapsed ? 80 : 300 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        {!isCollapsed ? (
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'images' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('images')}
            >
              All Images
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'bookmarks' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('bookmarks')}
            >
              Bookmarks
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <button
              className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600"
              onClick={() => setActiveTab(activeTab === 'images' ? 'bookmarks' : 'images')}
              title={activeTab === 'images' ? 'Switch to Bookmarks' : 'Switch to All Images'}
            >
              {activeTab === 'images' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>
          </div>
        )}
        
        <button
          className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      
      {/* Image thumbnails */}
      <div className="flex-1 overflow-y-auto p-3">
        {displayedImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mb-4">
              {activeTab === 'images' ? 'No images found' : 'No bookmarked images'}
            </p>
            {activeTab === 'images' && (
              <button
                className="btn btn-primary text-sm"
                onClick={onOpenFiles}
              >
                Open Images
              </button>
            )}
          </div>
        ) : (
          <div className={`grid gap-3 ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {displayedImages.map((img) => (
              <div
                key={img.id}
                className={`image-thumbnail group ${activeImage && activeImage.id === img.id ? 'selected' : ''}`}
                onClick={() => onSelectImage(img)}
              >
                <div className="relative pb-[100%]">
                  <img
                    src={img.data}
                    alt={img.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {!isCollapsed && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (img.isBookmarked) {
                              onToggleBookmark(img.id);
                            } else {
                              setShowBookmarkInput(img.id);
                            }
                          }}
                          title={img.isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={img.isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                        
                        <button
                          className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteImage(img.id);
                          }}
                          title="Delete Image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Bookmark label badge */}
                  {img.isBookmarked && img.bookmarkLabel && !isCollapsed && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary-600 bg-opacity-90 text-white text-xs py-1 px-2 truncate">
                      {img.bookmarkLabel}
                    </div>
                  )}
                </div>
                
                {/* Bookmark dialog */}
                <AnimatePresence>
                  {showBookmarkInput === img.id && (
                    <motion.div
                      className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-full">
                        <h3 className="text-white text-sm font-medium mb-2">Add Bookmark</h3>
                        <input
                          type="text"
                          className="w-full bg-gray-700 text-white rounded p-2 mb-2 text-sm"
                          placeholder="Enter label..."
                          value={bookmarkLabel}
                          onChange={(e) => setBookmarkLabel(e.target.value)}
                          autoFocus
                        />
                        <div className="flex justify-between">
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setShowBookmarkInput(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSaveBookmark(img.id)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Images Button */}
      <div className="p-3 border-t border-gray-700">
        <button
          className={`btn btn-primary w-full flex items-center justify-center ${isCollapsed ? 'p-2' : ''}`}
          onClick={onOpenFiles}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {!isCollapsed && <span className="ml-2">Add Images</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default ImagesSidebar;