import React from 'react';
import { Input } from '../input';
import { Label } from '../label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { cn } from '@/lib/utils';

/**
 * Represents a single option for a select input.
 */
interface SelectOption {
  id: string;
  name: string;
}

/**
 * Props for the FormField component.
 */
interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'select' | 'time' | 'number' | 'color';
  value: string;
  onChange: (value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}

/**
 * A legacy component for creating labeled form inputs, including text, password, select, and more.
 * It handles displaying labels, validation errors, and required field indicators.
 *
 * @param ff - The props for the FormField component.
 * @param ff.id - A unique identifier for the input, used for the `id` and `name` attributes.
 * @param ff.label - The text label displayed above the form field.
 * @param [ff.type] - The type of the input field.
 * @param ff.value - The current value of the form field.
 * @param ff.onChange - A callback function that is invoked when the field's value changes.
 * @param [ff.options] - An array of options for select inputs, each with an `id` and `name`.
 * @param [ff.placeholder] - Placeholder text for the input field.
 * @param [ff.required] - Whether the field is required.
 * @param [ff.error] - An error message to display below the field.
 * @param [ff.autoComplete] - The `autocomplete` attribute for the input, to help with browser autofill.
 * 
 * @returns The JSX element for the FormField component.
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

  return (
    <div className="mb-4">
      <Label htmlFor={id} className={cn('block font-semibold mb-1', error && 'text-destructive')}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {type === 'select' ? (
        <Select value={value} onValueChange={onChange} required={required}>
          <SelectTrigger
            id={id}
            className={cn(error && 'border-destructive focus:ring-destructive')}
            aria-describedby={errorId}
          >
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={cn(error && 'border-destructive focus:ring-destructive')}
          aria-describedby={errorId}
        />
      )}

      {error && (
        <p id={errorId} className="text-destructive text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
