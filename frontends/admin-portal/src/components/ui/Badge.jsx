import React from 'react';

export const Badge = ({ type = "info", children, style = {} }) => {
  const badgeClass = `badge badge-${type}`;
  return (
    <span className={badgeClass} style={style}>
      {children}
    </span>
  );
};
