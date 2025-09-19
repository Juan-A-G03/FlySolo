import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'primary',
}) => {
  const baseClass = 'spinner';
  const sizeClass = `spinner--${size}`;
  const colorClass = `spinner--${color}`;
  
  const classes = [baseClass, sizeClass, colorClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;