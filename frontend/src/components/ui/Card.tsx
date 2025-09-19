import React from 'react';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  variant = 'default',
  className = '',
  children,
}) => {
  const baseClass = 'card';
  const variantClass = `card--${variant}`;
  
  const classes = [baseClass, variantClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

// Card subcomponents
const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`card__header ${className}`}>
    {children}
  </div>
);

const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`card__body ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`card__footer ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h3 className={`card__title ${className}`}>
    {children}
  </h3>
);

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <p className={`card__description ${className}`}>
    {children}
  </p>
);

// Create compound component
interface CardCompound extends React.FC<CardProps> {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
}

const CardCompound = Card as CardCompound;
CardCompound.Header = CardHeader;
CardCompound.Body = CardBody;
CardCompound.Footer = CardFooter;
CardCompound.Title = CardTitle;
CardCompound.Description = CardDescription;

export default CardCompound;