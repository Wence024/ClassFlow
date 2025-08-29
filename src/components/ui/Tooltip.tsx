import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Props for the Tooltip component.
 */
interface TooltipProps {
  /** The content to be displayed inside the tooltip. */
  content: React.ReactNode;

  /** The position object for placing the tooltip. */
  position: { top: number; left: number };
}

/**
 * A portal-based tooltip component that renders its content at the root of the document body.
 *
 * This component is designed to solve clipping issues where a tooltip would be truncated by
 * a parent container with `overflow: hidden`. By using a React Portal, it teleports the
 * tooltip's DOM node to the `document.body`, ensuring it always renders on top of all other content.
 *
 * @param {TooltipProps} props - The props for the component.
 */
const Tooltip: React.FC<TooltipProps> = ({ content, position }: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Use useLayoutEffect to calculate position before the browser paints, preventing flicker.
  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const { width } = tooltipRef.current.getBoundingClientRect();
      // Adjust the left position to center the tooltip above the target element.
      setAdjustedPosition({
        top: position.top,
        left: position.left - width / 2,
      });
    }
  }, [content, position]);

  // Render the tooltip into a portal attached to the document body.
  return createPortal(
    <div
      ref={tooltipRef}
      role="tooltip"
      className="fixed z-50 w-max max-w-xs bg-gray-800 text-white text-xs rounded-md shadow-lg p-3 transition-opacity duration-300 pointer-events-none"
      style={{
        top: `${adjustedPosition.top}px`,
        left: `${adjustedPosition.left}px`,
        // The transform positions the tooltip to be perfectly centered and above the cursor.
        transform: 'translateY(calc(-100% - 8px))',
      }}
    >
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-gray-800"></div>
    </div>,
    document.body
  );
};

export default Tooltip;
