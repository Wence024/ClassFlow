import React, { useState, useRef, useEffect } from 'react';
import { getRandomPresetColor, PRESET_COLORS } from '../../lib/colorUtils';

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
 *
 * @param c The props for the component.
 * @returns A color picker component.
 */
const ColorPicker: React.FC<ColorPickerProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close popover on clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close popover on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleRandomClick = () => {
    const randomColor = getRandomPresetColor();
    onChange(randomColor);
  };

  const errorId = error ? `${id}-error` : undefined;
  const errorClasses = error
    ? 'border-red-500 focus:ring-red-400'
    : 'border-gray-300 focus:ring-blue-400';

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block font-semibold mb-1">{label}</label>
      <div className="relative">
        {/* Trigger Button */}
        <button
          ref={triggerRef}
          type="button"
          className={`w-full flex items-center gap-3 p-2 border rounded-lg transition-shadow focus:ring-2 ${errorClasses}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div
            className="w-8 h-8 rounded-md border border-gray-200 flex-shrink-0"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-gray-700">{value.toUpperCase()}</span>
        </button>

        {/* Popover */}
        {isOpen && (
          <div
            ref={popoverRef}
            className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4"
            role="dialog"
            aria-label="Color picker"
          >
            {/* Preset Colors Section */}
            <div className="grid grid-cols-8 gap-2 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-full h-8 rounded-md border transition-transform transform hover:scale-110 ${
                    value.toLowerCase() === color.toLowerCase()
                      ? 'ring-2 ring-offset-1 ring-blue-500'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onChange(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>

            {/* Custom Color Section */}
            <div className="flex items-center gap-2">
              <label
                htmlFor={id}
                className="flex-grow flex items-center gap-3 p-2 border rounded-lg cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-md border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: value }}
                />
                <span className="font-mono text-gray-700">{value.toUpperCase()}</span>
              </label>
              <input
                id={id}
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-0 h-0 absolute opacity-0"
                aria-describedby={errorId}
              />

              <button
                type="button"
                onClick={handleRandomClick}
                className="p-2 border rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Select a random preset color"
                title="Select a random preset color"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="16" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ColorPicker;