/**
 * File Manager Service
 * 
 * Handles file operations:
 * - Loading images from disk
 * - Saving images to disk
 * - Converting between formats
 * - Extracting images from PDF files
 */

import { v4 as uuidv4 } from 'uuid';
import { isValidImageFile } from '../utils/validators';
import { extractImagesFromPDF } from '../utils/imageHelpers';
import { FILE_TYPES } from '../utils/constants';

// Load an image file and return image data
export const loadImageFile = async (filePath) => {
  try {
    // Read file using the Electron bridge
    const imageData = await window.electron.readFile(filePath);
    
    if (!imageData) {
      throw new Error('Could not read file');
    }
    
    // Get file extension
    const extension = filePath.split('.').pop().toLowerCase();
    const fileName = filePath.split(/[\\/]/).pop();
    
    // Create image object
    const image = {
      id: `img-${uuidv4()}`,
      name: fileName,
      path: filePath,
      extension,
      data: `data:image/${extension === 'jpg' ? 'jpeg' : extension};base64,${imageData}`,
      isBookmarked: false,
      bookmarkLabel: '',
      width: 0, // Will be updated when loaded on canvas
      height: 0, // Will be updated when loaded on canvas
      size: 0, // Will be updated with file size
    };
    
    // Pre-load the image to get dimensions
    const dimensions = await getImageDimensions(image.data);
    image.width = dimensions.width;
    image.height = dimensions.height;
    image.originalWidth = dimensions.width;
    image.originalHeight = dimensions.height;
    
    return image;
  } catch (error) {
    console.error('Error loading image file:', error);
    throw error;
  }
};

// Save image data to disk
export const saveImageFile = async (imageData, filePath, format = 'png') => {
  try {
    // Convert format if needed
    let dataToSave = imageData;
    
    if (!dataToSave.startsWith('data:')) {
      dataToSave = `data:image/${format === 'jpg' ? 'jpeg' : format};base64,${dataToSave}`;
    }
    
    // If the data URL format doesn't match the target format, convert it
    const currentFormat = dataToSave.split(';')[0].split('/')[1];
    if (currentFormat !== format && currentFormat !== 'jpeg' && format !== 'jpg') {
      dataToSave = await convertImageFormat(dataToSave, format);
    }
    
    // Extract base64 data
    const base64Data = dataToSave.split(',')[1];
    
    // Write file using the Electron bridge
    const success = await window.electron.writeFile({
      filePath,
      data: base64Data,
      encoding: 'base64',
    });
    
    if (!success) {
      throw new Error('Failed to save file');
    }
    
    return {
      path: filePath,
      name: filePath.split(/[\\/]/).pop(),
    };
  } catch (error) {
    console.error('Error saving image file:', error);
    throw error;
  }
};

// Load multiple image files
export const loadImageFiles = async (filePaths) => {
  try {
    const imagePromises = filePaths.map(async (filePath) => {
      const extension = filePath.split('.').pop().toLowerCase();
      
      // Check if it's a PDF file
      if (extension === 'pdf') {
        return await handlePDFFile(filePath);
      }
      
      // Check if it's a valid image file
      if (isValidImageFile(filePath)) {
        return await loadImageFile(filePath);
      }
      
      return null;
    });
    
    const results = await Promise.all(imagePromises);
    
    // Flatten the array and filter out null values
    const images = results
      .flat()
      .filter(image => image !== null);
    
    return images;
  } catch (error) {
    console.error('Error loading image files:', error);
    throw error;
  }
};

// Handle PDF file and extract images
export const handlePDFFile = async (filePath) => {
  try {
    // Read the PDF file using the Electron bridge
    const pdfData = await window.electron.readFile(filePath);
    
    if (!pdfData) {
      throw new Error('Could not read PDF file');
    }
    
    // Extract images from the PDF
    const extractedImages = await extractImagesFromPDF(`data:application/pdf;base64,${pdfData}`);
    
    // Create image objects for each extracted image
    const images = extractedImages.map((imgData, index) => {
      const fileName = `${filePath.split(/[\\/]/).pop().replace('.pdf', '')}_image_${index + 1}.png`;
      
      return {
        id: `img-${uuidv4()}`,
        name: fileName,
        path: null, // Extracted images don't have a path until saved
        extension: 'png',
        data: imgData,
        isBookmarked: false,
        bookmarkLabel: '',
        size: 0,
        extractedFromPDF: true,
        pdfSource: filePath,
      };
    });
    
    return images;
  } catch (error) {
    console.error('Error extracting images from PDF:', error);
    throw error;
  }
};

// Convert image to a different format
export const convertImageFormat = async (imageData, targetFormat) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Convert to the target format
        const mimeType = targetFormat === 'jpg' ? 'image/jpeg' : `image/${targetFormat}`;
        const quality = targetFormat === 'jpg' || targetFormat === 'jpeg' ? 0.9 : 1.0;
        
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      
      img.onerror = (error) => {
        reject(new Error('Error loading image for format conversion'));
      };
      
      img.src = imageData;
    } catch (error) {
      reject(error);
    }
  });
};

// Get image dimensions
export const getImageDimensions = (imageData) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    
    img.onerror = () => {
      reject(new Error('Error loading image for dimension calculation'));
    };
    
    img.src = imageData;
  });
};

// Get supported file extensions for open dialog
export const getSupportedFileExtensions = () => {
  return [
    { name: 'Images', extensions: FILE_TYPES.IMAGE_EXTENSIONS },
    { name: 'PDF Documents', extensions: ['pdf'] },
    { name: 'All Files', extensions: ['*'] }
  ];
};

// Get supported file extensions for save dialog
export const getSaveFileExtensions = () => {
  return [
    { name: 'PNG Image', extensions: ['png'] },
    { name: 'JPEG Image', extensions: ['jpg', 'jpeg'] },
    { name: 'WebP Image', extensions: ['webp'] },
    { name: 'BMP Image', extensions: ['bmp'] },
  ];
};