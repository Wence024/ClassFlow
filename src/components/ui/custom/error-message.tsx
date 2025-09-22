import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { Alert, AlertDescription } from '../alert';
import { Button } from '../button';

/**
 * Props for the ErrorMessage component.
 */
interface ErrorMessageProps {
  /** The error message to display. */
  message: string;

  /** An optional callback to be executed when the user clicks the retry button. */
  onRetry?: () => void;

  /** An optional callback to be executed when the user clicks the dismiss button. */
  onDismiss?: () => void;

  /** Additional CSS classes to apply to the component's root element. */
  className?: string;
}

/**
 * A component to display a standardized error message using shadcn Alert.
 * It can optionally include "Retry" and "Dismiss" actions.
 *
 * @param e The props for the component.
 * @param e.message The error message to display.
 * @param e.onRetry An optional callback to be executed when the user clicks the retry button.
 * @param e.onDismiss An optional callback to be executed when the user clicks the dismiss button.
 * @param e.className Additional CSS classes to apply to the component's root element.
 * @returns A component that displays a standardized error message.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onDismiss,
  className = '',
}) => {
  // If no message is provided, render nothing.
  if (!message) return null;

  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="flex-1">{message}</span>
        <div className="flex gap-2 ml-4">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-8 w-8 p-0"
              aria-label="Retry"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
              className="h-8 w-8 p-0"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;
