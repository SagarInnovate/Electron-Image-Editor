/**
 * Application Constants
 * 
 * Defines constants used throughout the application
 */

// File types
export const FILE_TYPES = {
    IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'tif'],
    PDF_EXTENSIONS: ['pdf'],
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    DEFAULT_QUALITY: 0.9,
  };
  
  // Canvas settings
  export const CANVAS = {
    DEFAULT_BACKGROUND: '#1a1a2e',
    MIN_ZOOM: 0.1,
    MAX_ZOOM: 5,
    DEFAULT_ZOOM: 1,
    ZOOM_STEP: 0.1,
  };
  
  // History settings
  export const DEFAULT_HISTORY_LIMIT = 20;
  
  // Tool definitions
  export const TOOLS = {
    TRANSFORM: {
      SELECTION: {
        id: 'selection',
        name: 'Selection',
        icon: 'selection',
        cursor: 'crosshair',
      },
      CROP: {
        id: 'crop',
        name: 'Crop',
        icon: 'crop',
        cursor: 'crosshair',
        types: {
          RECTANGLE: 'rectangle',
          EDGE: 'edge',
        },
      },
      RESIZE: {
        id: 'resize',
        name: 'Resize',
        icon: 'resize',
      },
      ROTATE: {
        id: 'rotate',
        name: 'Rotate',
        icon: 'rotate',
        defaultAngle: 90,
      },
      FLIP_HORIZONTAL: {
        id: 'flip-horizontal',
        name: 'Flip Horizontal',
        icon: 'flip-horizontal',
      },
      FLIP_VERTICAL: {
        id: 'flip-vertical',
        name: 'Flip Vertical',
        icon: 'flip-vertical',
      },
    },
    ADJUST: {
      BRIGHTNESS: {
        id: 'brightness',
        name: 'Brightness',
        icon: 'brightness',
        defaultValue: 0,
        min: -100,
        max: 100,
      },
      CONTRAST: {
        id: 'contrast',
        name: 'Contrast',
        icon: 'contrast',
        defaultValue: 0,
        min: -100,
        max: 100,
      },
      SATURATION: {
        id: 'saturation',
        name: 'Saturation',
        icon: 'saturation',
        defaultValue: 0,
        min: -100,
        max: 100,
      },
      GRAYSCALE: {
        id: 'grayscale',
        name: 'Grayscale',
        icon: 'grayscale',
      },
      SEPIA: {
        id: 'sepia',
        name: 'Sepia',
        icon: 'sepia',
      },
      INVERT: {
        id: 'invert',
        name: 'Invert',
        icon: 'invert',
      },
    },
    HISTORY: {
      UNDO: {
        id: 'undo',
        name: 'Undo',
        icon: 'undo',
        shortcut: 'Ctrl+Z',
      },
      REDO: {
        id: 'redo',
        name: 'Redo',
        icon: 'redo',
        shortcut: 'Ctrl+Y',
      },
    },
  };
  
  // UI settings
  export const UI = {
    SIDEBAR: {
      DEFAULT_WIDTH: 240,
      COLLAPSED_WIDTH: 80,
      ANIMATION_DURATION: 0.3,
    },
    THEME: {
      DARK: 'dark',
      LIGHT: 'light',
      DEFAULT: 'dark',
    },
    DIALOG: {
      ANIMATION_DURATION: 0.2,
    },
  };
  
  // Default settings
  export const DEFAULT_SETTINGS = {
    theme: UI.THEME.DEFAULT,
    showTooltips: true,
    autoSave: false,
    autoSaveInterval: 5, // minutes
    maxHistoryStates: DEFAULT_HISTORY_LIMIT,
    defaultSaveFormat: 'png',
    performanceMode: false, // Reduces quality for better performance
    useSmoothZoom: true,
    defaultExportQuality: 0.9,
    confirmBeforeDelete: true,
    userDocumentsPath: null, // Will be set by the app
  };