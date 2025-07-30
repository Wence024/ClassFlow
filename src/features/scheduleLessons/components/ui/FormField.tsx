import React from 'react';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'select';
  value: string;
  onChange: (value: string) => void;
  options?: Array<{ id: string; name: string }>;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  options,
  placeholder,
  required = false,
  error,
}) => {
  const baseClasses =
    'w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400';
  const errorClasses = error ? 'border-red-500 focus:ring-red-400' : '';

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}:
      </label>

      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} ${errorClasses}`}
          required={required}
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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClasses} ${errorClasses}`}
          required={required}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
