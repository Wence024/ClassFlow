import React from 'react';

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
 * A component to display a standardized error message.
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
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {/* Error Icon */}
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="flex space-x-2">
            {onRetry && (
              <button
                type="button"
                className="bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={onRetry}
                aria-label="Retry"
              >
                {/* Retry Icon */}
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            {onDismiss && (
              <button
                type="button"
                className="bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={onDismiss}
                aria-label="Dismiss"
              >
                {/* Dismiss Icon */}
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
