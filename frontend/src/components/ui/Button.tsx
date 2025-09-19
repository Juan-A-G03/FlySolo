import React from 'react';
import { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  children,
  className = '',
}) => {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    disabled && 'btn--disabled',
    loading && 'btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && (
        <div className="spinner spinner--sm" aria-hidden="true" />
      )}
      <span className={loading ? 'sr-only' : undefined}>
        {children}
      </span>
    </button>
  );
};

export default Button;