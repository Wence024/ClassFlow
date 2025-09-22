import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the LoadingSpinner component.
 */
interface LoadingSpinnerProps {
  /**
   * The size of the spinner.
   *
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /** Optional text to display below the spinner. */
  text?: string;

  /** Additional CSS classes to apply to the component's root element. */
  className?: string;
}

/**
 * A simple, reusable loading spinner component using semantic tokens.
 * It can be customized with different sizes and optional text.
 *
 * @param l The props for the component.
 * @param l.size The size of the spinner.
 * @param l.text Optional text to display below the spinner.
 * @param l.className Additional CSS classes to apply to the component's root element.
 * @returns A loading spinner component.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2
        className={cn("animate-spin text-primary", sizeClasses[size])}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
