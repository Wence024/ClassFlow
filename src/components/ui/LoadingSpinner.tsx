import React from 'react';

/**
 * Props for the LoadingSpinner component.
 */
interface LoadingSpinnerProps {
  /** The size of the spinner.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /** The color of the spinner.
   * @default 'blue'
   */
  color?: 'blue' | 'gray' | 'white';
  /** Optional text to display below the spinner. */
  text?: string;
  /** Additional CSS classes to apply to the component's root element. */
  className?: string;
}

/**
 * A simple, reusable loading spinner component.
 * It can be customized with different sizes, colors, and optional text.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Loading"
      ></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
