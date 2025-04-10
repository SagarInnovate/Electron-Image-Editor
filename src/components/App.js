import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TitleBar from './UI/TitleBar';
import ToolsSidebar from './Sidebar/ToolsSidebar';
import ImagesSidebar from './Sidebar/ImagesSidebar';
import ImageCanvas from './Canvas/ImageCanvas';
import StatusBar from './UI/StatusBar';
import WelcomeScreen from './UI/WelcomeScreen';
import { registerMenuActions } from '../services/menuManager';

// Import services
import { loadImageFiles, saveImageFile } from '../services/fileManager';
import { bookmarkImage, removeBookmark, getBookmarkCategories } from '../services/bookmarkManager';
import historyManager, { addHistoryState, undoHistory, redoHistory, canUndo, canRedo } from '../services/historyManager';

// Import utilities
import { UI } from '../utils/constants';
import { createThumbnail } from '../utils/imageHelpers';

const App = () => {
  // State
  const [activeImage, setActiveImage] = useState(null);
  const [images, setImages] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [toolSettings, setToolSettings] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [bookmarkCategories, setBookmarkCategories] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  
  // Load bookmark categories on mount
  useEffect(() => {
    const categories = getBookmarkCategories();
    setBookmarkCategories(categories);
  }, []);
  
  // Handle opening files
  const handleOpenFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Open file dialog through Electron
      const filePaths = await window.electron.openFileDialog();
      
      if (filePaths && filePaths.length > 0) {
        // Load the image files
        const newImages = await loadImageFiles(filePaths);
        
        // Add the new images to the state
        setImages((prevImages) => [...prevImages, ...newImages]);
        
        // Set active image to the first new image if no image is active
        if (!activeImage && newImages.length > 0) {
          setActiveImage(newImages[0]);
        }
      }
    } catch (error) {
      console.error('Error opening files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeImage]);
  
  // Save current image
  const handleSaveImage = useCallback(async () => {
    if (!activeImage) return;
    
    try {
      setIsLoading(true);
      
      // Get the current data URL from canvas
      const canvas = document.getElementById('main-canvas');
      const dataUrl = canvas.toDataURL('image/png');
      
      // Show save dialog
      const filePath = await window.electron.saveFileDialog({
        defaultPath: activeImage.name,
        filters: [
          { name: 'PNG Image', extensions: ['png'] },
          { name: 'JPEG Image', extensions: ['jpg', 'jpeg'] },
          { name: 'WebP Image', extensions: ['webp'] },
        ],
      });
      
      if (filePath) {
        // Determine format from the chosen file extension
        const extension = filePath.split('.').pop().toLowerCase();
        
        // Save the file
        const result = await saveImageFile(dataUrl, filePath, extension);
        
        if (result) {
          // Update the image in the state
          setImages((prevImages) =>
            prevImages.map((img) =>
              img.id === activeImage.id
                ? { ...img, path: filePath, name: result.name }
                : img
            )
          );
          
          setActiveImage((prev) => ({
            ...prev,
            path: filePath,
            name: result.name,
          }));
        }
      }
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeImage]);
  
  // Delete current image
  const handleDeleteImage = useCallback((imageId) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
    
    if (activeImage && activeImage.id === imageId) {
      // Set the next image as active, or the previous if there is no next
      const index = images.findIndex((img) => img.id === imageId);
      const nextImage = images[index + 1] || images[index - 1] || null;
      setActiveImage(nextImage);
      
      // Clear history when changing images
      historyManager.clear();
    }
  }, [activeImage, images]);
  
  // Toggle bookmark
  const handleToggleBookmark = useCallback((imageId, label = "") => {
    // Update the images state
    setImages((prevImages) =>
      prevImages.map((img) => {
        if (img.id === imageId) {
          const newBookmarkState = !img.isBookmarked;
          
          // Update the bookmark in the service
          if (newBookmarkState) {
            bookmarkImage(img, label);
          } else {
            removeBookmark(imageId);
          }
          
          return {
            ...img,
            isBookmarked: newBookmarkState,
            bookmarkLabel: newBookmarkState ? label || img.bookmarkLabel || img.name : '',
          };
        }
        return img;
      })
    );
    
    // Also update the active image if it's the one being bookmarked
    if (activeImage && activeImage.id === imageId) {
      setActiveImage((prev) => {
        const newBookmarkState = !prev.isBookmarked;
        return {
          ...prev,
          isBookmarked: newBookmarkState,
          bookmarkLabel: newBookmarkState ? label || prev.bookmarkLabel || prev.name : '',
        };
      });
    }
  }, [activeImage]);
  
  // Add history state
  const handleAddHistoryState = useCallback((state) => {
    addHistoryState(state);
  }, []);
  
  // Undo
  const handleUndo = useCallback(() => {
    const previousState = undoHistory();
    if (previousState) {
      // Apply the previous state
      if (activeImage) {
        setActiveImage((prev) => ({
          ...prev,
          data: previousState.imageData,
          width: previousState.width,
          height: previousState.height,
        }));
      }
    }
  }, [activeImage]);
  
  // Redo
  const handleRedo = useCallback(() => {
    const nextState = redoHistory();
    if (nextState) {
      // Apply the next state
      if (activeImage) {
        setActiveImage((prev) => ({
          ...prev,
          data: nextState.imageData,
          width: nextState.width,
          height: nextState.height,
        }));
      }
    }
  }, [activeImage]);
  
  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode]);
  
  // Update image after edits
  const handleImageChange = useCallback((updatedImageData) => {
    if (activeImage) {
      // Update the active image
      setActiveImage((prev) => ({
        ...prev,
        ...updatedImageData,
      }));
      
      // Also update the image in the images array
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === activeImage.id
            ? { ...img, ...updatedImageData }
            : img
        )
      );
      
      // Create thumbnail for the updated image
      if (updatedImageData.data) {
        createThumbnail(updatedImageData.data).then((thumbnailData) => {
          setImages((prevImages) =>
            prevImages.map((img) =>
              img.id === activeImage.id
                ? { ...img, thumbnail: thumbnailData }
                : img
            )
          );
        });
      }
    }
  }, [activeImage]);
  
  // Register electron menu actions
  useEffect(() => {
    registerMenuActions({
      openFiles: handleOpenFiles,
      saveImage: handleSaveImage,
    });
  }, [handleOpenFiles, handleSaveImage]);
  
  return (
    <div className={`flex flex-col h-full ${darkMode ? 'dark' : ''}`}>
      {/* Title Bar */}
      <TitleBar />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tools Sidebar */}
        <ToolsSidebar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          toolSettings={toolSettings}
          setToolSettings={setToolSettings}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo()}
          canRedo={canRedo()}
        />
        
        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-background-dark bg-pattern overflow-hidden">
          <AnimatePresence>
            {activeImage ? (
              <motion.div
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ImageCanvas
                  image={activeImage}
                  activeTool={activeTool}
                  toolSettings={toolSettings}
                  zoomLevel={zoomLevel}
                  setZoomLevel={setZoomLevel}
                  addHistoryState={handleAddHistoryState}
                  historyState={historyManager.getCurrentState()}
                  onImageChange={handleImageChange}
                />
              </motion.div>
            ) : (
              <WelcomeScreen onOpenFiles={handleOpenFiles} />
            )}
          </AnimatePresence>
          
          {isLoading && (
            <div className="absolute inset-0 bg-background-dark bg-opacity-75 flex items-center justify-center z-50">
              <div className="loading-spinner"></div>
              <span className="ml-3">Processing...</span>
            </div>
          )}
        </div>
        
        {/* Right Images Sidebar */}
        <ImagesSidebar
          images={images}
          activeImage={activeImage}
          onSelectImage={setActiveImage}
          onDeleteImage={handleDeleteImage}
          onToggleBookmark={handleToggleBookmark}
          onOpenFiles={handleOpenFiles}
          bookmarks={bookmarkCategories}
        />
      </div>
      
      {/* Status Bar */}
      <StatusBar
        activeImage={activeImage}
        zoomLevel={zoomLevel}
        activeTool={activeTool}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    </div>
  );
};

export default App;