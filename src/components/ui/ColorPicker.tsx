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
    <div className={`mb-4 pt-3 ${className}`}>
      {/* This is the main, non-clickable label for the component */}
      <label className="block font-semibold mb-1">{label}</label>

      {/* This <label> IS the clickable button. It is associated with the hidden input via `htmlFor`. */}
      <label
        htmlFor={id}
        className={`flex bg-[#222] items-center gap-3 p-2 border rounded-md cursor-pointer transition-shadow focus-within:ring-2 ${errorClasses}`}
        aria-describedby={errorId}
      >
        {/* The visual swatch */}
        <div
          className="w-8 h-8 rounded-md border border-gray-600 flex-shrink-0 "
          style={{ backgroundColor: value }}
        />

        {/* The text part of the clickable label */}
        <span className="font-mono text-gray-200">{value.toUpperCase()}</span>

        {/* The actual input, now functionally linked but visually hidden */}
        <input
          id={id}
          type="color"
          value={value}
          // This combination of classes makes the input completely invisible
          // and removes it from the layout flow, but keeps it functional for the label.
          className="w-0 h-0 absolute opacity-0"
          onChange={(e) => onChange(e.target.value)}
        />
      </label>

      {/* Error message display */}
      {error && (
        <p id={errorId} className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ColorPicker;
