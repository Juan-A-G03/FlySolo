import React, { forwardRef } from 'react';
import { InputProps } from '../../types';

interface ExtendedInputProps extends InputProps, 
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {}

const Input = forwardRef<HTMLInputElement, ExtendedInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required = false, 
    className = '', 
    ...props 
  }, ref) => {
    const inputId = props.id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const inputClasses = [
      'input',
      error && 'input--error',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="form-field">
        {label && (
          <label htmlFor={inputId} className="form-field__label">
            {label}
            {required && (
              <span className="form-field__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        <input
          {...props}
          ref={ref}
          id={inputId}
          className={inputClasses}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined
          }
        />
        
        {error && (
          <div id={`${inputId}-error`} className="form-field__error" role="alert">
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={`${inputId}-help`} className="form-field__help">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;