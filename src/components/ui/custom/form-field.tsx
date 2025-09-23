import React from 'react';
import { Input } from '../input';
import { Label } from '../label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { cn } from '@/lib/utils';

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

  /**
   * The type of the input field. 'select' renders a dropdown.
   *
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'select' | 'time' | 'number' | 'color';

  /** The current value of the form field. */
  value: string;

  /** A callback function that is invoked when the field's value changes. */
  onChange: (value: string) => void;

  /** An array of options for select inputs. Each option should have an `id` and `name`. */
  options?: SelectOption[];

  /** Placeholder text for the input field. */
  placeholder?: string;

  /**
   * Whether the field is required. Adds a visual indicator and the `required` attribute.
   *
   * @default false
   */
  required?: boolean;

  /** An error message to display below the field. If present, the field will be styled to indicate an error. */
  error?: string;

  /**
   * The `autocomplete` attribute for the input, to help with browser autofill.
   * Note: Only pass a valid, non-empty autocomplete string for accessibility compliance.
   */
  autoComplete?: string;
}

/**
 * A standardized component for creating labeled form inputs, including text, password, select, and more.
 * It handles displaying labels, validation errors, and required field indicators.
 *
 * @param ff
 * @param ff.id
 * @param ff.label
 * @param ff.type
 * @param ff.value
 * @param ff.onChange
 * @param ff.options
 * @param ff.placeholder
 * @param ff.required
 * @param ff.error
 * @param ff.autoComplete
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
