/**
 * Validators
 * 
 * Validation utility functions:
 * - Validating file types
 * - Validating dimensions
 * - Validating user input
 */

import { FILE_TYPES } from './constants';

// Check if a file is a valid image file
export const isValidImageFile = (filePath) => {
  if (!filePath) return false;
  
  const extension = filePath.split('.').pop().toLowerCase();
  return FILE_TYPES.IMAGE_EXTENSIONS.includes(extension);
};

// Check if a file is a PDF
export const isPDFFile = (filePath) => {
  if (!filePath) return false;
  
  const extension = filePath.split('.').pop().toLowerCase();
  return extension === 'pdf';
};

// Check if file size is within limits
export const isFileSizeValid = (size) => {
  return size > 0 && size <= FILE_TYPES.MAX_FILE_SIZE;
};

// Validate image dimensions
export const validateDimensions = (width, height, minWidth = 1, minHeight = 1, maxWidth = 10000, maxHeight = 10000) => {
  // Check if dimensions are numbers
  if (typeof width !== 'number' || typeof height !== 'number') {
    return {
      valid: false,
      error: 'Dimensions must be numbers',
    };
  }
  
  // Check if dimensions are integers
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    return {
      valid: false,
      error: 'Dimensions must be integers',
    };
  }
  
  // Check if dimensions are positive
  if (width <= 0 || height <= 0) {
    return {
      valid: false,
      error: 'Dimensions must be positive',
    };
  }
  
  // Check if dimensions are within limits
  if (width < minWidth || height < minHeight) {
    return {
      valid: false,
      error: `Dimensions must be at least ${minWidth}x${minHeight}`,
    };
  }
  
  if (width > maxWidth || height > maxHeight) {
    return {
      valid: false,
      error: `Dimensions must not exceed ${maxWidth}x${maxHeight}`,
    };
  }
  
  return {
    valid: true,
  };
};

// Validate rotation angle
export const validateRotationAngle = (angle) => {
  // Check if angle is a number
  if (typeof angle !== 'number') {
    return {
      valid: false,
      error: 'Angle must be a number',
    };
  }
  
  // Check if angle is finite
  if (!Number.isFinite(angle)) {
    return {
      valid: false,
      error: 'Angle must be a finite number',
    };
  }
  
  // Return valid result
  return {
    valid: true,
  };
};

// Validate crop rectangle
export const validateCropRect = (rect, imageWidth, imageHeight) => {
  // Check if rect has all required properties
  if (!rect || typeof rect !== 'object' || !('x' in rect) || !('y' in rect) || !('width' in rect) || !('height' in rect)) {
    return {
      valid: false,
      error: 'Invalid crop rectangle',
    };
  }
  
  const { x, y, width, height } = rect;
  
  // Check if all properties are numbers
  if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
    return {
      valid: false,
      error: 'Crop rectangle properties must be numbers',
    };
  }
  
  // Check if position is within image bounds
  if (x < 0 || y < 0 || x > imageWidth || y > imageHeight) {
    return {
      valid: false,
      error: 'Crop position is outside image bounds',
    };
  }
  
  // Check if dimensions are positive
  if (width <= 0 || height <= 0) {
    return {
      valid: false,
      error: 'Crop dimensions must be positive',
    };
  }
  
  // Check if crop area is within image bounds
  if (x + width > imageWidth || y + height > imageHeight) {
    return {
      valid: false,
      error: 'Crop area exceeds image bounds',
    };
  }
  
  return {
    valid: true,
  };
};

// Validate file name
export const validateFileName = (fileName) => {
  // Check if file name is a string
  if (typeof fileName !== 'string') {
    return {
      valid: false,
      error: 'File name must be a string',
    };
  }
  
  // Check if file name is empty
  if (fileName.trim() === '') {
    return {
      valid: false,
      error: 'File name cannot be empty',
    };
  }
  
  // Check if file name contains invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
  if (invalidChars.test(fileName)) {
    return {
      valid: false,
      error: 'File name contains invalid characters',
    };
  }
  
  return {
    valid: true,
  };
};

// Validate bookmark label
export const validateBookmarkLabel = (label) => {
  // Check if label is a string
  if (typeof label !== 'string') {
    return {
      valid: false,
      error: 'Bookmark label must be a string',
    };
  }
  
  // Empty labels are allowed
  if (label.trim() === '') {
    return {
      valid: true,
    };
  }
  
  // Check if label is too long
  if (label.length > 50) {
    return {
      valid: false,
      error: 'Bookmark label cannot exceed 50 characters',
    };
  }
  
  return {
    valid: true,
  };
};

// Validate image filter value
export const validateFilterValue = (value, min = -100, max = 100) => {
  // Check if value is a number
  if (typeof value !== 'number') {
    return {
      valid: false,
      error: 'Filter value must be a number',
    };
  }
  
  // Check if value is finite
  if (!Number.isFinite(value)) {
    return {
      valid: false,
      error: 'Filter value must be a finite number',
    };
  }
  
  // Check if value is within range
  if (value < min || value > max) {
    return {
      valid: false,
      error: `Filter value must be between ${min} and ${max}`,
    };
  }
  
  return {
    valid: true,
  };
};

// Validate image quality value
export const validateQuality = (quality) => {
  // Check if quality is a number
  if (typeof quality !== 'number') {
    return {
      valid: false,
      error: 'Quality must be a number',
    };
  }
  
  // Check if quality is between 0 and 1
  if (quality < 0 || quality > 1) {
    return {
      valid: false,
      error: 'Quality must be between 0 and 1',
    };
  }
  
  return {
    valid: true,
  };
};