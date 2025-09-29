import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getRandomPresetColor, PRESET_COLORS_DATA, getColorName } from '../../../lib/colorUtils';
import { Button } from '../button/button';
import { Label } from '../label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { cn } from '@/lib/utils';

/**
 * Props for the ColorPicker component.
 */
interface ColorPickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

/**
 * A user-friendly color picker component using shadcn Popover.
 * It features a popover for selecting preset or custom colors.
 *
 * @param cp The props for the component.
 * @param cp.id A unique identifier for the input. Essential for accessibility.
 * @param cp.label The text label displayed above the color picker.
 * @param cp.value The current hex color value (e.g., '#4f46e5').
 * @param cp.onChange A callback function that is invoked when the color value changes.
 * @param [cp.error] An optional error message to display.
 * @param [cp.className] Additional CSS classes for the container.
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

  const handleRandomClick = () => {
    const randomColor = getRandomPresetColor();
    onChange(randomColor);
  };

  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn('mb-4', className)}>
      <Label htmlFor={id} className={cn('block font-semibold mb-1', error && 'text-destructive')}>
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'flex-grow justify-start gap-3 h-auto p-2',
                error && 'border-destructive focus:ring-destructive'
              )}
              aria-expanded={isOpen}
              aria-describedby={errorId}
            >
              <div
                className="w-8 h-8 rounded-md border border-input flex-shrink-0"
                style={{ backgroundColor: value }}
              />
              <span className="text-foreground flex-1 text-left">{getColorName(value)}</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80" align="start">
            {/* Preset Colors Section */}
            <div className="space-y-3">
              <h4 className="font-medium leading-none">Preset Colors</h4>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS_DATA.map((color) => (
                  <Button
                    key={color.hex}
                    variant="outline"
                    className={cn(
                      'w-full h-8 p-0 border-2 transition-all hover:scale-110',
                      value.toLowerCase() === color.hex.toLowerCase()
                        ? 'ring-2 ring-primary ring-offset-2'
                        : ''
                    )}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => {
                      onChange(color.hex);
                      setIsOpen(false);
                    }}
                    aria-label={`Select color ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Section */}
            <div className="space-y-3 mt-4">
              <h4 className="font-medium leading-none">Custom Color</h4>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md border border-input flex-shrink-0"
                  style={{ backgroundColor: value }}
                />
                <span className="flex-1 text-sm">{getColorName(value)}</span>
                <input
                  id={id}
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-12 h-8 rounded border border-input cursor-pointer"
                  aria-describedby={errorId}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleRandomClick}
          aria-label="Select a random preset color"
          title="Select a random preset color"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </Button>
      </div>

      {error && (
        <p id={errorId} className="text-destructive text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ColorPicker;
