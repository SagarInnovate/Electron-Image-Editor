import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ToolButton from '../UI/ToolButton';

const ToolsSidebar = ({
  activeTool,
  setActiveTool,
  toolSettings,
  setToolSettings,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Handle tool selection
  const handleToolSelect = (toolId) => {
    if (activeTool === toolId) {
      setActiveTool(null); // Deselect if already active
    } else {
      setActiveTool(toolId);
      
      // Set default settings for the tool
      switch (toolId) {
        case 'crop':
          setToolSettings({
            ...toolSettings,
            cropType: 'rectangle',
          });
          break;
          
        case 'resize':
          setToolSettings({
            ...toolSettings,
            maintainAspectRatio: true,
          });
          break;
          
        case 'rotate':
          setToolSettings({
            ...toolSettings,
            angle: 90,
          });
          break;
          
        case 'brightness':
        case 'contrast':
        case 'saturation':
          setToolSettings({
            ...toolSettings,
            value: 0,
          });
          break;
          
        default:
          break;
      }
    }
  };
  
  // Tool settings handlers
  const handleCropTypeChange = (type) => {
    setToolSettings({
      ...toolSettings,
      cropType: type,
    });
  };
  
  const handleRotationAngleChange = (angle) => {
    setToolSettings({
      ...toolSettings,
      angle: parseInt(angle, 10),
    });
  };
  
  const handleAdjustmentValueChange = (value) => {
    setToolSettings({
      ...toolSettings,
      value: parseFloat(value),
    });
  };
  
  const handleResizeDimensionsChange = (width, height) => {
    setToolSettings({
      ...toolSettings,
      width: parseInt(width, 10) || 0,
      height: parseInt(height, 10) || 0,
    });
  };
  
  const handleAspectRatioToggle = () => {
    setToolSettings({
      ...toolSettings,
      maintainAspectRatio: !toolSettings.maintainAspectRatio,
    });
  };
  
  // Conditional rendering of tool settings UI
  const renderToolSettings = () => {
    if (!activeTool) return null;
    
    switch (activeTool) {
      case 'crop':
        return (
          <div className="p-3 border-t border-gray-700">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Crop Type</div>
            <div className="flex gap-2">
              <button
                className={`btn btn-sm ${toolSettings.cropType === 'rectangle' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handleCropTypeChange('rectangle')}
              >
                Rectangle
              </button>
              <button
                className={`btn btn-sm ${toolSettings.cropType === 'edge' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handleCropTypeChange('edge')}
              >
                Edge
              </button>
            </div>
          </div>
        );
        
      case 'resize':
        return (
          <div className="p-3 border-t border-gray-700">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Dimensions</div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-xs text-gray-400">Width (px)</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 text-white rounded p-1"
                  value={toolSettings.width || ''}
                  onChange={(e) => handleResizeDimensionsChange(e.target.value, toolSettings.height)}
                  min="1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Height (px)</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 text-white rounded p-1"
                  value={toolSettings.height || ''}
                  onChange={(e) => handleResizeDimensionsChange(toolSettings.width, e.target.value)}
                  min="1"
                />
              </div>
            </div>
            
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="maintain-aspect-ratio"
                className="mr-2"
                checked={toolSettings.maintainAspectRatio}
                onChange={handleAspectRatioToggle}
              />
              <label htmlFor="maintain-aspect-ratio" className="text-xs">Maintain aspect ratio</label>
            </div>
          </div>
        );
        
      case 'rotate':
        return (
          <div className="p-3 border-t border-gray-700">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Angle</div>
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-ghost flex-1"
                  onClick={() => handleRotationAngleChange(90)}
                >
                  90°
                </button>
                <button
                  className="btn btn-sm btn-ghost flex-1"
                  onClick={() => handleRotationAngleChange(180)}
                >
                  180°
                </button>
                <button
                  className="btn btn-sm btn-ghost flex-1"
                  onClick={() => handleRotationAngleChange(270)}
                >
                  270°
                </button>
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Custom angle</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 text-white rounded p-1"
                  value={toolSettings.angle || 0}
                  onChange={(e) => handleRotationAngleChange(e.target.value)}
                  min="0"
                  max="360"
                />
              </div>
            </div>
          </div>
        );
        
      case 'brightness':
      case 'contrast':
      case 'saturation':
        return (
          <div className="p-3 border-t border-gray-700">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
              {activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}
            </div>
            
            <div className="flex flex-col gap-2">
              <input
                type="range"
                className="slider-control"
                min="-100"
                max="100"
                value={toolSettings.value || 0}
                onChange={(e) => handleAdjustmentValueChange(e.target.value)}
              />
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>-100</span>
                <span>{toolSettings.value || 0}</span>
                <span>+100</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Sidebar toggle button
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <motion.div
      className="sidebar"
      initial={{ width: 80 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sidebar header with collapse button */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        {!isCollapsed && (
          <h2 className="text-xl font-semibold text-white">Tools</h2>
        )}
        <button
          className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors duration-200"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      
      {/* Tools */}
      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {/* Transform tools */}
        <div className="tool-group">
          <div className="tool-group-title">Transform</div>
          <div className={`grid ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'} gap-1 px-2`}>
            <ToolButton
              id="selection"
              label="Selection"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              }
              isActive={activeTool === 'selection'}
              onClick={() => handleToolSelect('selection')}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="crop"
              label="Crop"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              }
              isActive={activeTool === 'crop'}
              onClick={() => handleToolSelect('crop')}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="resize"
              label="Resize"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              }
              isActive={activeTool === 'resize'}
              onClick={() => handleToolSelect('resize')}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="rotate"
              label="Rotate"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
              isActive={activeTool === 'rotate'}
              onClick={() => handleToolSelect('rotate')}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="flip-horizontal"
              label="Flip H"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
              isActive={activeTool === 'flip-horizontal'}
              onClick={() => handleToolSelect('flip-horizontal')}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="flip-vertical"
              label="Flip V"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              }
              isActive={activeTool === 'flip-vertical'}
              onClick={() => handleToolSelect('flip-vertical')}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
        
        {/* Adjust tools */}
        <div className="tool-group">
          <div className="tool-group-title">Adjust</div>
          <div className={`grid ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'} gap-1 px-2`}>
            <ToolButton
              id="brightness"
              label="Brightness"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              isActive={activeTool === 'brightness'}
              onClick={() => handleToolSelect('brightness')}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="contrast"
              label="Contrast"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              }
              isActive={activeTool === 'contrast'}
              onClick={() => handleToolSelect('contrast')}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="saturation"
              label="Saturation"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
              isActive={activeTool === 'saturation'}
              onClick={() => handleToolSelect('saturation')}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="grayscale"
              label="Grayscale"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              isActive={activeTool === 'grayscale'}
              onClick={() => handleToolSelect('grayscale')}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="sepia"
              label="Sepia"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
              isActive={activeTool === 'sepia'}
              onClick={() => handleToolSelect('sepia')}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="invert"
              label="Invert"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              isActive={activeTool === 'invert'}
              onClick={() => handleToolSelect('invert')}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
        
        {/* History tools */}
        <div className="tool-group">
          <div className="tool-group-title">History</div>
          <div className={`grid ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'} gap-1 px-2`}>
            <ToolButton
              id="undo"
              label="Undo"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
              onClick={onUndo}
              isDisabled={!canUndo}
              isCollapsed={isCollapsed}
            />
            <ToolButton
              id="redo"
              label="Redo"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              }
              onClick={onRedo}
              isDisabled={!canRedo}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
      </div>
      
      {/* Tool Settings Panel */}
      {!isCollapsed && renderToolSettings()}
    </motion.div>
  );
};

export default ToolsSidebar;