/**
 * Image Processing Service
 * 
 * Provides functions for various image processing operations:
 * - Applying filters (brightness, contrast, grayscale, etc.)
 * - Resizing images
 * - Rotating images
 * - Cropping images
 */

// Apply image filters (brightness, contrast, saturation, etc.)
export const applyFilter = async (imageData, filterType, value = 0) => {
    // Create a canvas to work with the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Load the image
    const image = new Image();
    
    // Wait for the image to load
    await new Promise((resolve) => {
      image.onload = resolve;
      image.src = imageData;
    });
    
    // Set canvas dimensions
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0);
    
    // Get image data
    const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageDataObj.data;
    
    // Apply the selected filter
    switch (filterType) {
      case 'brightness':
        // Convert value from -100..100 to -1..1
        const brightnessValue = value / 100;
        
        for (let i = 0; i < pixels.length; i += 4) {
          pixels[i] = Math.min(255, Math.max(0, pixels[i] + 255 * brightnessValue)); // Red
          pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + 255 * brightnessValue)); // Green
          pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + 255 * brightnessValue)); // Blue
        }
        break;
        
      case 'contrast':
        // Convert value from -100..100 to -1..1
        const contrastValue = value / 100;
        const factor = (259 * (contrastValue + 1)) / (255 * (1 - contrastValue));
        
        for (let i = 0; i < pixels.length; i += 4) {
          pixels[i] = Math.min(255, Math.max(0, factor * (pixels[i] - 128) + 128)); // Red
          pixels[i + 1] = Math.min(255, Math.max(0, factor * (pixels[i + 1] - 128) + 128)); // Green
          pixels[i + 2] = Math.min(255, Math.max(0, factor * (pixels[i + 2] - 128) + 128)); // Blue
        }
        break;
        
      case 'saturation':
        // Convert value from -100..100 to 0..2
        const saturationValue = value / 100 + 1;
        
        for (let i = 0; i < pixels.length; i += 4) {
          // Convert RGB to HSL
          const r = pixels[i] / 255;
          const g = pixels[i + 1] / 255;
          const b = pixels[i + 2] / 255;
          
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h, s, l = (max + min) / 2;
          
          if (max === min) {
            h = s = 0; // achromatic
          } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
              case g:
                h = (b - r) / d + 2;
                break;
              case b:
                h = (r - g) / d + 4;
                break;
            }
            
            h /= 6;
          }
          
          // Adjust saturation
          s = Math.min(1, Math.max(0, s * saturationValue));
          
          // Convert back to RGB
          let r1, g1, b1;
          
          if (s === 0) {
            r1 = g1 = b1 = l; // achromatic
          } else {
            const hue2rgb = (p, q, t) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r1 = hue2rgb(p, q, h + 1 / 3);
            g1 = hue2rgb(p, q, h);
            b1 = hue2rgb(p, q, h - 1 / 3);
          }
          
          pixels[i] = Math.round(r1 * 255);
          pixels[i + 1] = Math.round(g1 * 255);
          pixels[i + 2] = Math.round(b1 * 255);
        }
        break;
        
      case 'grayscale':
        for (let i = 0; i < pixels.length; i += 4) {
          const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          pixels[i] = avg; // Red
          pixels[i + 1] = avg; // Green
          pixels[i + 2] = avg; // Blue
        }
        break;
        
      case 'sepia':
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          
          pixels[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189)); // Red
          pixels[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // Green
          pixels[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // Blue
        }
        break;
        
      case 'invert':
        for (let i = 0; i < pixels.length; i += 4) {
          pixels[i] = 255 - pixels[i]; // Red
          pixels[i + 1] = 255 - pixels[i + 1]; // Green
          pixels[i + 2] = 255 - pixels[i + 2]; // Blue
        }
        break;
        
      default:
        break;
    }
    
    // Put the modified pixels back on the canvas
    ctx.putImageData(imageDataObj, 0, 0);
    
    // Return the data URL of the modified image
    return canvas.toDataURL();
  };
  
  // Resize image
  export const applyResize = async (imageData, width, height, maintainAspectRatio = true) => {
    // Create a canvas to work with the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Load the image
    const image = new Image();
    
    // Wait for the image to load
    await new Promise((resolve) => {
      image.onload = resolve;
      image.src = imageData;
    });
    
    // Calculate new dimensions if maintaining aspect ratio
    if (maintainAspectRatio) {
      const aspectRatio = image.width / image.height;
      
      if (width && !height) {
        height = Math.round(width / aspectRatio);
      } else if (height && !width) {
        width = Math.round(height * aspectRatio);
      } else if (width && height) {
        // Both dimensions provided, use the one that results in a smaller image
        const widthRatio = width / image.width;
        const heightRatio = height / image.height;
        
        if (widthRatio < heightRatio) {
          height = Math.round(width / aspectRatio);
        } else {
          width = Math.round(height * aspectRatio);
        }
      }
    }
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // For smoother image quality when downscaling, use a multi-step approach
    if (width < image.width || height < image.height) {
      // Use a high-quality resizing library if available
      try {
        // Try to use Pica for high-quality resizing
        const pica = require('pica')();
        const result = await pica.resize(image, canvas);
        return result.toDataURL();
      } catch (error) {
        // Fallback to canvas resizing
        ctx.drawImage(image, 0, 0, width, height);
      }
    } else {
      // For upscaling, the default canvas resizing is fine
      ctx.drawImage(image, 0, 0, width, height);
    }
    
    // Return the data URL of the resized image
    return canvas.toDataURL();
  };
  
  // Rotate image
  export const applyRotation = async (imageData, angle) => {
    // Create a canvas to work with the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Load the image
    const image = new Image();
    
    // Wait for the image to load
    await new Promise((resolve) => {
      image.onload = resolve;
      image.src = imageData;
    });
    
    // Convert angle to radians
    const radians = (angle * Math.PI) / 180;
    
    // Calculate new dimensions after rotation
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));
    const newWidth = Math.floor(image.width * cos + image.height * sin);
    const newHeight = Math.floor(image.width * sin + image.height * cos);
    
    // Set canvas dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Move to center of canvas
    ctx.translate(newWidth / 2, newHeight / 2);
    
    // Rotate the canvas
    ctx.rotate(radians);
    
    // Draw the image centered and rotated
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    
    // Return the data URL of the rotated image
    return canvas.toDataURL();
  };
  
  // Crop image
  export const applyCrop = async (imageData, cropRect) => {
    // Create a canvas to work with the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Load the image
    const image = new Image();
    
    // Wait for the image to load
    await new Promise((resolve) => {
      image.onload = resolve;
      image.src = imageData;
    });
    
    // Set canvas dimensions to crop size
    canvas.width = cropRect.width;
    canvas.height = cropRect.height;
    
    // Draw the cropped portion of the image
    ctx.drawImage(
      image,
      cropRect.x, cropRect.y, cropRect.width, cropRect.height, // Source rectangle
      0, 0, cropRect.width, cropRect.height // Destination rectangle
    );
    
    // Return the data URL of the cropped image
    return canvas.toDataURL();
  };
  
  // Resize image by file size (KB)
  export const resizeByFileSize = async (imageData, targetSizeKB) => {
    // Convert target size to bytes
    const targetSize = targetSizeKB * 1024;
    
    // Create a canvas to work with the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Load the image
    const image = new Image();
    
    // Wait for the image to load
    await new Promise((resolve) => {
      image.onload = resolve;
      image.src = imageData;
    });
    
    // Set initial canvas dimensions to match the image
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Draw the original image
    ctx.drawImage(image, 0, 0);
    
    // Start with quality 0.9
    let quality = 0.9;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    let currentSize = (dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75; // Approximate base64 size
    
    // Binary search for the right quality level
    let minQuality = 0.1;
    let maxQuality = 1.0;
    const maxIterations = 10;
    let iteration = 0;
    
    while (Math.abs(currentSize - targetSize) > 1024 && iteration < maxIterations) {
      if (currentSize > targetSize) {
        // Too big, reduce quality
        maxQuality = quality;
        quality = (minQuality + quality) / 2;
      } else {
        // Too small, increase quality
        minQuality = quality;
        quality = (quality + maxQuality) / 2;
      }
      
      dataUrl = canvas.toDataURL('image/jpeg', quality);
      currentSize = (dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75;
      
      iteration++;
    }
    
    // If we still can't achieve the target size by adjusting quality, 
    // start reducing dimensions
    if (currentSize > targetSize) {
      let scale = 0.9;
      
      while (currentSize > targetSize && scale > 0.1) {
        // Resize the image
        const newWidth = Math.floor(image.width * scale);
        const newHeight = Math.floor(image.height * scale);
        
        // Create a new canvas for the resized image
        const resizeCanvas = document.createElement('canvas');
        const resizeCtx = resizeCanvas.getContext('2d');
        
        resizeCanvas.width = newWidth;
        resizeCanvas.height = newHeight;
        
        // Draw the resized image
        resizeCtx.drawImage(image, 0, 0, newWidth, newHeight);
        
        // Get the data URL with reduced dimensions
        dataUrl = resizeCanvas.toDataURL('image/jpeg', quality);
        currentSize = (dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75;
        
        // Reduce scale for next iteration if needed
        scale -= 0.1;
      }
    }
    
    return dataUrl;
  };