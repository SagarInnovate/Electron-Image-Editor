import React from 'react';

const StatusBar = ({ activeImage, zoomLevel, activeTool, darkMode, onToggleDarkMode }) => {
  // Format file size
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
  
  // Get active tool name
  const getToolName = () => {
    if (!activeTool) return '';
    
    // Convert tool ID to readable name
    const toolNames = {
      'selection': 'Selection',
      'crop': 'Crop',
      'resize': 'Resize',
      'rotate': 'Rotate',
      'flip-horizontal': 'Flip Horizontal',
      'flip-vertical': 'Flip Vertical',
      'brightness': 'Brightness',
      'contrast': 'Contrast',
      'saturation': 'Saturation',
      'grayscale': 'Grayscale',
      'sepia': 'Sepia',
      'invert': 'Invert',
    };
    
    return toolNames[activeTool] || activeTool;
  };
  
  return (
    <div className="status-bar">
      <div className="flex items-center space-x-4">
        {/* Image info */}
        {activeImage && (
          <>
            <div title={activeImage.name}>
              <span className="font-medium">File:</span> {activeImage.name.length > 20 ? activeImage.name.substring(0, 20) + '...' : activeImage.name}
            </div>
            
            <div>
              <span className="font-medium">Dimensions:</span> {activeImage.width} × {activeImage.height}px
            </div>
            
            {activeImage.size && (
              <div>
                <span className="font-medium">Size:</span> {formatFileSize(activeImage.size)}
              </div>
            )}
          </>
        )}
        
        {/* Active tool */}
        {activeTool && (
          <div className="font-medium text-primary-400">
            Tool: {getToolName()}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Zoom level */}
        <div>
          <span className="font-medium">Zoom:</span> {Math.round(zoomLevel * 100)}%
        </div>
        
        {/* Theme toggle */}
        <button
          className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
          onClick={onToggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        
        {/* App version */}
        <div className="text-gray-500">
          v{window.electron.getAppVersion()}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;