import React from 'react';

/**
 * Represents a single option for a select input.
 */
interface SelectOption {
  /** The unique identifier for the option (used as the value). */
  id: string;
  /** The human-readable text for the option. */
  name: string;
}

/**
 * Props for the FormField component.
 */
interface FormFieldProps {
  /** A unique identifier for the input, used for the `id` and `name` attributes. Essential for accessibility. */
  id: string;
  /** The text label displayed above the form field. */
  label: string;
  /** The type of the input field. 'select' renders a dropdown.
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'select' | 'time' | 'number';
  /** The current value of the form field. */
  value: string;
  /** A callback function that is invoked when the field's value changes. */
  onChange: (value: string) => void;
  /** An array of options for select inputs. Each option should have an `id` and `name`. */
  options?: SelectOption[];
  /** Placeholder text for the input field. */
  placeholder?: string;
  /** Whether the field is required. Adds a visual indicator and the `required` attribute.
   * @default false
   */
  required?: boolean;
  /** An error message to display below the field. If present, the field will be styled to indicate an error. */
  error?: string;
  /** The `autocomplete` attribute for the input, to help with browser autofill.
   * Note: Only pass a valid, non-empty autocomplete string for accessibility compliance.
   */
  autoComplete?: string;
}

/**
 * A standardized component for creating labeled form inputs, including text, password, select, and more.
 * It handles displaying labels, validation errors, and required field indicators.
 */
const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  options,
  placeholder,
  required = false,
  error,
  autoComplete,
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const baseClasses =
    'w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100';
  const errorClasses = error ? 'border-red-500 focus:ring-red-400' : '';

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-semibold mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'select' ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} ${errorClasses}`}
          required={required}
          aria-describedby={errorId}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClasses} ${errorClasses}`}
          required={required}
          {...(autoComplete ? { autoComplete } : {})}
          aria-describedby={errorId}
        />
      )}

      {error && (
        <p id={errorId} className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
