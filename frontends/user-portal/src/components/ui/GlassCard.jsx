import React from 'react';

export const GlassCard = ({ children, style = {}, className = "", ...props }) => {
  return (
    <div 
      className={`glass-panel ${className}`} 
      style={{ ...style }}
      {...props}
    >
      {children}
    </div>
  );
};
