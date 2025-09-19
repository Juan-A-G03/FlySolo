import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  fallback,
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);
  
  const baseClass = 'avatar';
  const sizeClass = `avatar--${size}`;
  
  const classes = [baseClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  const handleImageError = () => {
    setImageError(true);
  };

  const getFallback = () => {
    if (fallback) {
      return fallback.charAt(0).toUpperCase();
    }
    if (alt) {
      return alt.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <div className={classes}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={handleImageError}
          className="avatar__image"
        />
      ) : (
        <div className="avatar__fallback">
          {getFallback()}
        </div>
      )}
    </div>
  );
};

export default Avatar;