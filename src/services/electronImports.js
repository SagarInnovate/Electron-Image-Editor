/**
 * Electron Imports
 * 
 * This file provides a consistent way to import Electron-specific modules
 * in both development (Vite) and production environments.
 */

// Helper to check if we're in Electron context or browser
export const isElectron = () => {
    return window && window.electron !== undefined;
  };
  
  // Safely get the Electron API
  export const getElectron = () => {
    if (isElectron()) {
      return window.electron;
    }
    
    // Return a mock implementation for development in browser
    return {
      // Window controls
      minimizeWindow: () => console.log('Mock: Minimize window'),
      maximizeWindow: () => console.log('Mock: Maximize window'),
      closeWindow: () => console.log('Mock: Close window'),
      
      // File operations
      openFileDialog: () => {
        console.log('Mock: Open file dialog');
        return Promise.resolve([]);
      },
      saveFileDialog: () => {
        console.log('Mock: Save file dialog');
        return Promise.resolve(null);
      },
      readFile: () => {
        console.log('Mock: Read file');
        return Promise.resolve(null);
      },
      writeFile: () => {
        console.log('Mock: Write file');
        return Promise.resolve(false);
      },
      
      // App info
      appInfo: {
        platform: 'browser',
        release: 'development',
        arch: 'web',
        cpus: 4,
        totalMemory: 8 * 1024 * 1024 * 1024
      },
      
      // Menu handlers
      onMenuAction: () => console.log('Mock: Register menu action'),
      
      // Version information
      getAppVersion: () => '1.0.0-dev'
    };
  };
  
  // Safely get the Node.js versions
  export const getVersions = () => {
    if (isElectron() && window.versions) {
      return window.versions;
    }
    
    // Return mock versions for development in browser
    return {
      node: () => 'N/A',
      chrome: () => 'N/A',
      electron: () => 'N/A'
    };
  };
  
  // Get the Electron API
  export const electron = getElectron();
  
  // Get the versions
  export const versions = getVersions();