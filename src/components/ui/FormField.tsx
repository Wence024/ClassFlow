// Note: Only pass a valid, non-empty autocomplete string to the input for accessibility compliance.
import React from 'react';

interface FormFieldProps {
  id: string; // Make id mandatory for accessibility
  label: string;
  type?: 'text' | 'email' | 'password' | 'select' | 'time';
  value: string;
  onChange: (value: string) => void;
  options?: Array<{ id: string; name: string }>;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}

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
