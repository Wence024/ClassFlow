import React, { Component, type ReactNode } from 'react';
import ActionButton from './ActionButton'; // Assuming ActionButton is in the same UI folder

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    // Optional: You could also add a window reload as a more forceful reset
    // window.location.reload();
  };

  public render() {
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
