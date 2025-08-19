import React from 'react';

/**
 * Props for the ActionButton component.
 */
interface ActionButtonProps {
  /** The content to be displayed inside the button. */
  children: React.ReactNode;
  /** Optional click handler. */
  onClick?: () => void;
  /** The visual style of the button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  /** The size of the button.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /** If true, the button will be disabled.
   * @default false
   */
  disabled?: boolean;
  /** If true, a loading indicator will be shown.
   * @default false
   */
  loading?: boolean;
  /** The native button type.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS classes to apply to the button. */
  className?: string;
}

/**
 * A versatile button component with consistent styling for various actions.
 * It supports different visual variants, sizes, and loading/disabled states.
 *
 * @example
 * <ActionButton
 *   onClick={() => console.log('Clicked!')}
 *   variant="primary"
 *   size="lg"
 * >
 *   Confirm
 * </ActionButton>
 */
const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
}) => {
  const baseClasses =
    'font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ActionButton;
