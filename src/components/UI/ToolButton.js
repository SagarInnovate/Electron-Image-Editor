import React from 'react';
import { motion } from 'framer-motion';

const ToolButton = ({
  id,
  label,
  icon,
  isActive = false,
  onClick,
  isDisabled = false,
  isCollapsed = false
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`tool-btn group ${isActive ? 'active' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={isDisabled ? undefined : onClick}
      title={label}
      disabled={isDisabled}
    >
      <div className="relative">
        {icon}
        {isActive && (
          <motion.div
            className="absolute -inset-1 rounded-md border border-primary-500"
            layoutId="toolHighlight"
            initial={false}
          />
        )}
      </div>
      {!isCollapsed && <span className="mt-1 text-xs">{label}</span>}
    </motion.button>
  );
};

export default ToolButton;