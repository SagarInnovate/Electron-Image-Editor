import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/main.css';

// Create root and render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log app version and environment info
console.log(`Electron Image Editor v${window.electron.getAppVersion()}`);
console.log(`Running on ${window.electron.appInfo.platform} (${window.electron.appInfo.arch})`);
console.log(`Node.js ${window.versions.node()}`);
console.log(`Chromium ${window.versions.chrome()}`);
console.log(`Electron ${window.versions.electron()}`);