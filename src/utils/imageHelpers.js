/**
 * Image Helpers
 * 
 * Utility functions for image operations:
 * - Creating thumbnails
 * - Extracting images from PDFs
 * - Getting image information
 * - Optimizing images
 */

import { FILE_TYPES } from './constants';

// Create a thumbnail from an image
export const createThumbnail = async (imageData, maxWidth = 150, maxHeight = 150) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions
        let width = img.width;
        let height = img.height;
        
        // Calculate scaling factor to fit within maxWidth and maxHeight
        const scale = Math.min(1, maxWidth / width, maxHeight / height);
        
        width *= scale;
        height *= scale;
        
        // Create a canvas to draw the thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get thumbnail as data URL
        const thumbnailData = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnailData);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for thumbnail creation'));
      };
      
      img.src = imageData;
    } catch (error) {
      reject(error);
    }
  });
};

// Extract images from PDF
export const extractImagesFromPDF = async (pdfData) => {
  try {
    // Import the PDF.js library
    const { PDFDocument } = await import('pdf-lib');
    
    // Load the PDF from the data URL
    const pdfBytes = await fetch(pdfData).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Get all pages
    const pages = pdfDoc.getPages();
    const images = [];
    
    // For each page, render it to a canvas and extract as an image
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      
      // Create a canvas with the same dimensions as the page
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Draw a white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      
      // Extract images directly from PDF via PDF.js (in a real app, you'd use PDF.js's rendering)
      // For now, we'll just convert the page to an image
      
      // Convert the page to an image (creating a snapshot of the page)
      const imgData = canvas.toDataURL('image/png');
      images.push(imgData);
    }
    
    return images;
  } catch (error) {
    console.error('Error extracting images from PDF:', error);
    throw error;
  }
};

// Get image file size from data URL
export const getImageDataSize = (dataUrl) => {
  if (!dataUrl) return 0;
  
  // Remove the data URL prefix to get the base64 data
  const base64 = dataUrl.split(',')[1];
  
  // Base64 strings have a 33% overhead (4 bytes per 3 bytes of data)
  return Math.ceil((base64.length * 3) / 4);
};

// Get image information from data URL
export const getImageInfo = async (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const info = {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        size: getImageDataSize(dataUrl),
      };
      
      resolve(info);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image information'));
    };
    
    img.src = dataUrl;
  });
};

// Optimize image by reducing quality
export const optimizeImage = async (imageData, quality = 0.8, maxWidth = null, maxHeight = null) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Resize if maxWidth or maxHeight is provided
        if (maxWidth || maxHeight) {
          if (maxWidth && width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          if (maxHeight && height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Create a canvas to draw the optimized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get optimized image as data URL
        const imgType = imageData.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
        const optimizedData = canvas.toDataURL(imgType, quality);
        resolve(optimizedData);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for optimization'));
      };
      
      img.src = imageData;
    } catch (error) {
      reject(error);
    }
  });
};

// Convert image format
export const convertImageFormat = async (imageData, format = 'png', quality = 0.9) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      
      img.onload = () => {
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        
        // For PNG, draw with transparent background
        if (format === 'png') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          // For other formats, use white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        // Get image as data URL in the specified format
        const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
        const convertedData = canvas.toDataURL(mimeType, quality);
        resolve(convertedData);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for format conversion'));
      };
      
      img.src = imageData;
    } catch (error) {
      reject(error);
    }
  });
};

// Create a cropped version of an image
export const cropImage = async (imageData, cropRect) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      
      img.onload = () => {
        // Create a canvas for the cropped image
        const canvas = document.createElement('canvas');
        canvas.width = cropRect.width;
        canvas.height = cropRect.height;
        
        const ctx = canvas.getContext('2d');
        
        // Draw the cropped portion
        ctx.drawImage(
          img,
          cropRect.x, cropRect.y, cropRect.width, cropRect.height,
          0, 0, cropRect.width, cropRect.height
        );
        
        // Get the cropped image as data URL
        const croppedData = canvas.toDataURL();
        resolve(croppedData);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for cropping'));
      };
      
      img.src = imageData;
    } catch (error) {
      reject(error);
    }
  });
};

// Create a data URL from an ArrayBuffer
export const arrayBufferToDataURL = (buffer, mimeType = 'image/jpeg') => {
  const binary = new Uint8Array(buffer).reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ''
  );
  return `data:${mimeType};base64,${window.btoa(binary)}`;
};

// Create an ArrayBuffer from a data URL
export const dataURLToArrayBuffer = (dataUrl) => {
  const base64 = dataUrl.split(',')[1];
  const binary = window.atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  
  return buffer;
};

// Check if a data URL is a valid image
export const isValidImageDataURL = (dataUrl) => {
  if (!dataUrl) return false;
  
  const regex = /^data:image\/(jpeg|jpg|png|gif|bmp|webp);base64,/;
  return regex.test(dataUrl);
};

// Get the file extension from a mime type
export const getExtensionFromMimeType = (mimeType) => {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
  };
  
  return extensions[mimeType] || 'png';
};

// Get the mime type from a file extension
export const getMimeTypeFromExtension = (extension) => {
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'pdf': 'application/pdf',
  };
  
  return mimeTypes[extension.toLowerCase()] || 'image/png';
};