const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  
  // File operations
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveFileDialog: (options) => ipcRenderer.invoke('save-file-dialog', options),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (options) => ipcRenderer.invoke('write-file', options),
  
  // App info
  appInfo: {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: os.totalmem()
  },
  
  // Menu handlers
  onMenuAction: (channel, callback) => {
    const validChannels = [
      'menu-open-image', 
      'menu-save-image', 
      'menu-show-about'
    ];
    if (validChannels.includes(channel)) {
      // Remove old listener to avoid multiple triggers
      ipcRenderer.removeAllListeners(channel);
      // Register the new listener
      ipcRenderer.on(channel, callback);
    }
  },
  
  // Version information
  getAppVersion: () => process.env.npm_package_version || '1.0.0'
});

// Expose node process versions
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
});