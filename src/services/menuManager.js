/**
 * Menu Manager Service
 * 
 * Handles Electron menu actions and registers callbacks
 */

// Register callback functions for menu actions
export const registerMenuActions = (actions) => {
    const { openFiles, saveImage } = actions;
    
    // Register menu-open-image handler
    if (openFiles) {
      window.electron.onMenuAction('menu-open-image', () => {
        openFiles();
      });
    }
    
    // Register menu-save-image handler
    if (saveImage) {
      window.electron.onMenuAction('menu-save-image', () => {
        saveImage();
      });
    }
    
    // Register menu-show-about handler
    window.electron.onMenuAction('menu-show-about', () => {
      // Create and show the about dialog
      const aboutInfo = {
        appName: 'Electron Image Editor',
        version: window.electron.getAppVersion(),
        description: 'A modern offline image editing application',
        copyright: `© ${new Date().getFullYear()}`,
        website: 'https://example.com',
      };
      
      const aboutDialog = document.createElement('div');
      aboutDialog.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center';
      aboutDialog.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div class="flex items-center mb-4">
            <div class="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">${aboutInfo.appName}</h2>
              <p class="text-gray-400">Version ${aboutInfo.version}</p>
            </div>
          </div>
          <p class="text-gray-300 mb-4">${aboutInfo.description}</p>
          <p class="text-gray-400 text-sm">${aboutInfo.copyright}</p>
          <div class="mt-6 flex justify-end">
            <button id="close-about" class="btn btn-primary">Close</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(aboutDialog);
      document.getElementById('close-about').addEventListener('click', () => {
        document.body.removeChild(aboutDialog);
      });
    });
  };