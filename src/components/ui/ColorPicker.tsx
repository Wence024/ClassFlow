import React from 'react';

/**
 * Props for the ColorPicker component.
 */
interface ColorPickerProps {
  /** A unique identifier for the input. Essential for accessibility. */
  id: string;

  /** The text label displayed above the color picker. */
  label: string;

  /** The current hex color value (e.g., '#4f46e5'). */
  value: string;

  /** A callback function that is invoked when the color value changes. */
  onChange: (value: string) => void;

  /** An optional error message to display. */
  error?: string;

  /** Additional CSS classes for the container. */
  className?: string;
}

/**
 * A user-friendly color picker component that provides an improved user experience.
 * It features a large, clickable area containing a visual color swatch and the current
 * hex code. Clicking this area triggers the native browser color input.
 *
 * This is achieved by wrapping the visual elements in a `<label>` tag that is
 * associated with a visually hidden but functional `<input type="color">`.
 */
const ColorPicker: React.FC<ColorPickerProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  className = '',
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const errorClasses = error
    ? 'border-red-500 focus-within:ring-red-400'
    : 'border-gray-300 focus-within:ring-blue-400';

  return (
    <div className={`mb-4 ${className}`}>
      {/* This is the main, non-clickable label for the component */}
      <label htmlFor={id} className="block font-semibold mb-1">
        {label}
      </label>

      {/* This second label remains as the large, clickable swatch area. */}
      <label
        htmlFor={id}
        className={`flex items-center gap-3 p-2 border rounded-lg cursor-pointer transition-shadow focus-within:ring-2 ${errorClasses}`}
      >
        <div
          className="w-8 h-8 rounded-md border border-gray-200 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        <span className="font-mono text-gray-700">{value.toUpperCase()}</span>
      </label>

      {/* The input itself is hidden but now correctly associated with its visible text label. */}
      <input
        id={id}
        type="color"
        value={value}
        className="w-0 h-0 absolute opacity-0"
        onChange={(e) => onChange(e.target.value)}
        // Associate the error message with the input for screen readers
        aria-describedby={errorId}
      />

      {error && (
        <p id={errorId} className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ColorPicker;
