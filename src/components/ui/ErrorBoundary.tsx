import React, { Component, type ReactNode } from 'react';
import ActionButton from './ActionButton';

/**
 * Props for the ErrorBoundary component.
 */
interface Props {
  /** The child components that the error boundary will wrap. */
  children: ReactNode;

  /** A custom message to display in the fallback UI. */
  fallbackMessage?: string;
}

/**
 * Internal state for the ErrorBoundary component.
 */
interface State {
  /** A boolean flag indicating if an error has been caught. */
  hasError: boolean;
}

/**
 * A React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * This prevents the entire application from crashing due to a single component's error.
 */
class ErrorBoundary extends Component<Props, State> {
  /**
   * The current state of the error boundary.
   */
  public state: State = {
    hasError: false,
  };

  /**
   * A static lifecycle method that is invoked after an error has been thrown by a descendant component.
   * It receives the error that was thrown as a parameter and should return a value to update state.
   * @returns {State} An object representing the updated state.
   */
  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /**
   * A lifecycle method that is invoked after an error has been thrown by a descendant component.
   * It is used for side effects like logging the error to a reporting service.
   * @param {Error} error - The error that was thrown.
   * @param {React.ErrorInfo} errorInfo - An object with a `componentStack` key containing information about which component threw the error.
   */
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error('Uncaught error:', error, errorInfo);
  }

  /**
   * Resets the error state, allowing the user to attempt to re-render the child components.
   */
  private handleReset = () => {
    this.setState({ hasError: false });
  };

  /**
   * Renders the component. If an error has been caught, it displays the fallback UI.
   * Otherwise, it renders the child components as normal.
   * @returns {ReactNode} The rendered component tree.
   */
  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-red-50 border border-red-200 rounded-lg text-center">
          <h2 className="text-2xl font-semibold text-red-800 mb-4">Something went wrong.</h2>
          <p className="text-red-700 mb-6">
            {this.props.fallbackMessage || 'An unexpected error occurred. Please try again.'}
          </p>
          <ActionButton onClick={this.handleReset} variant="danger">
            Try Again
          </ActionButton>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
