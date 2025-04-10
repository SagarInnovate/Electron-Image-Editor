import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import CanvasControls from './CanvasControls';
import { applyFilter, applyRotation, applyCrop, applyResize } from '../../services/imageProcessor';

const ImageCanvas = ({
  image,
  activeTool,
  toolSettings,
  zoomLevel,
  setZoomLevel,
  addHistoryState,
  historyState,
  onImageChange
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [imageDetails, setImageDetails] = useState({
    width: 0,
    height: 0,
    fileName: '',
    fileSize: 0
  });
  
  // Initialize Fabric.js Canvas
  useEffect(() => {
    if (!canvasRef.current || !image) return;
    
    // Clean up any existing Fabric canvas
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }
    
    // Create a new Fabric.js canvas
    const fabric = require('fabric').fabric;
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current);
    
    // Load the image
    fabric.Image.fromURL(image.data, (img) => {
      // Calculate dimensions to fit in the viewport
      const containerWidth = containerRef.current.offsetWidth - 100;
      const containerHeight = containerRef.current.offsetHeight - 100;
      
      const imgWidth = img.width;
      const imgHeight = img.height;
      
      let scaleFactor = 1;
      if (imgWidth > containerWidth || imgHeight > containerHeight) {
        const widthRatio = containerWidth / imgWidth;
        const heightRatio = containerHeight / imgHeight;
        scaleFactor = Math.min(widthRatio, heightRatio);
      }
      
      // Scale the canvas to match the image dimensions with the calculated scale factor
      fabricCanvasRef.current.setWidth(imgWidth * scaleFactor);
      fabricCanvasRef.current.setHeight(imgHeight * scaleFactor);
      
      // Scale the image
      img.scale(scaleFactor);
      
      // Clear canvas and add the image
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.add(img);
      fabricCanvasRef.current.centerObject(img);
      img.setCoords();
      fabricCanvasRef.current.renderAll();
      
      // Update image details
      const details = {
        width: imgWidth,
        height: imgHeight,
        fileName: image.name,
        fileSize: image.size || 0,
      };
      
      setImageDetails(details);
      
      // Update parent component with image dimensions
      onImageChange({
        width: imgWidth,
        height: imgHeight,
        originalWidth: imgWidth,
        originalHeight: imgHeight,
      });
      
      // Add to history
      addHistoryState({
        imageData: image.data,
        width: imgWidth,
        height: imgHeight,
      });
    });
    
    // Center the canvas in the container
    setCanvasPosition({ x: 0, y: 0 });
    
    return () => {
      // Clean up
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [image, addHistoryState, onImageChange]);
  
  // Apply history state when it changes
  useEffect(() => {
    if (!fabricCanvasRef.current || !historyState) return;
    
    // Load the image from the history state
    if (historyState.imageData) {
      const fabric = require('fabric').fabric;
      
      fabric.Image.fromURL(historyState.imageData, (img) => {
        // Update canvas dimensions
        fabricCanvasRef.current.setWidth(historyState.width);
        fabricCanvasRef.current.setHeight(historyState.height);
        
        // Clear canvas and add the image
        fabricCanvasRef.current.clear();
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.centerObject(img);
        img.setCoords();
        fabricCanvasRef.current.renderAll();
        
        // Update image details
        setImageDetails({
          width: historyState.width,
          height: historyState.height,
          fileName: image.name,
          fileSize: image.size || 0,
        });
        
        // Update parent component with image dimensions
        onImageChange({
          width: historyState.width,
          height: historyState.height,
        });
      });
    }
  }, [historyState, image.name, image.size, onImageChange]);
  
  // Apply active tool
  useEffect(() => {
    if (!fabricCanvasRef.current || !activeTool || !image) return;
    
    const canvas = fabricCanvasRef.current;
    
    const applyToolAction = async () => {
      let updatedImageData;
      
      switch (activeTool) {
        case 'crop':
          // Enable cropping mode in Fabric.js
          if (toolSettings.cropType === 'rectangle') {
            // Initialize the cropping tool
          }
          break;
          
        case 'resize':
          if (toolSettings.width && toolSettings.height) {
            updatedImageData = await applyResize(
              image.data,
              toolSettings.width,
              toolSettings.height,
              toolSettings.maintainAspectRatio
            );
          }
          break;
          
        case 'rotate':
          updatedImageData = await applyRotation(
            image.data,
            toolSettings.angle || 90
          );
          break;
          
        case 'flip-horizontal':
          // Flip the image horizontally
          canvas.getActiveObject() || canvas.getObjects()[0].toggle('flipX');
          canvas.renderAll();
          updatedImageData = canvas.toDataURL();
          break;
          
        case 'flip-vertical':
          // Flip the image vertically
          canvas.getActiveObject() || canvas.getObjects()[0].toggle('flipY');
          canvas.renderAll();
          updatedImageData = canvas.toDataURL();
          break;
          
        case 'brightness':
        case 'contrast':
        case 'saturation':
        case 'grayscale':
        case 'sepia':
        case 'invert':
          updatedImageData = await applyFilter(
            image.data,
            activeTool,
            toolSettings.value
          );
          break;
          
        default:
          break;
      }
      
      if (updatedImageData) {
        // Update the image
        const fabric = require('fabric').fabric;
        
        fabric.Image.fromURL(updatedImageData, (img) => {
          // Get new dimensions
          const newWidth = img.width;
          const newHeight = img.height;
          
          // Update canvas dimensions
          canvas.setWidth(newWidth);
          canvas.setHeight(newHeight);
          
          // Clear canvas and add the image
          canvas.clear();
          canvas.add(img);
          canvas.centerObject(img);
          img.setCoords();
          canvas.renderAll();
          
          // Update image details
          setImageDetails({
            width: newWidth,
            height: newHeight,
            fileName: image.name,
            fileSize: image.size || 0,
          });
          
          // Update parent component with image dimensions and data
          onImageChange({
            width: newWidth,
            height: newHeight,
            data: updatedImageData,
          });
          
          // Add to history
          addHistoryState({
            imageData: updatedImageData,
            width: newWidth,
            height: newHeight,
          });
        });
      }
    };
    
    applyToolAction();
  }, [activeTool, toolSettings, image, addHistoryState, onImageChange]);
  
  // Handle zooming with the mouse wheel
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newZoom = Math.min(Math.max(zoomLevel + delta, 0.1), 5);
      setZoomLevel(newZoom);
    }
  }, [zoomLevel, setZoomLevel]);
  
  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);
  
  // Handle canvas dragging
  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle button or Alt+Left click
      setIsDragging(true);
      setDragStart({
        x: e.clientX - canvasPosition.x,
        y: e.clientY - canvasPosition.y,
      });
    }
  }, [canvasPosition]);
  
  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setCanvasPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Add mouse event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);
  
  return (
    <div
      ref={containerRef}
      className="canvas-container w-full h-full select-none"
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
      <motion.div
        className="relative"
        style={{
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        <canvas
          id="main-canvas"
          ref={canvasRef}
          width={imageDetails.width}
          height={imageDetails.height}
          className="border border-gray-600 shadow-lg"
        />
      </motion.div>
      
      {/* Zoom controls */}
      <CanvasControls
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        imageDetails={imageDetails}
      />
    </div>
  );
};

export default ImageCanvas;