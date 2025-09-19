import React from 'react';
import { AlertProps } from '../../types';

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  className = '',
}) => {
  const baseClass = 'alert';
  const typeClass = `alert--${type}`;
  
  const classes = [baseClass, typeClass, className]
    .filter(Boolean)
    .join(' ');

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={classes} role="alert">
      <div className="alert__icon" aria-hidden="true">
        {getIcon()}
      </div>
      
      <div className="alert__content">
        {title && (
          <div className="alert__title">{title}</div>
        )}
        <div className="alert__message">{message}</div>
      </div>
      
      {onClose && (
        <button
          className="alert__close"
          onClick={onClose}
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;