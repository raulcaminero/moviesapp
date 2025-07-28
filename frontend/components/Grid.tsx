import React from 'react';

interface GridProps {
  children: React.ReactNode;
}

const Grid: React.FC<GridProps> = ({ children }) => (
  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
    {children}
  </ul>
);

export default Grid;