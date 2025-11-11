/**
 * Preset colors for the color picker component.
 * These colors are chosen for good accessibility and visual distinction.
 */
export const PRESET_COLORS_DATA = [
  { hex: '#4f46e5', name: 'Indigo' },
  { hex: '#0d9488', name: 'Teal' },
  { hex: '#db2777', name: 'Pink' },
  { hex: '#ca8a04', name: 'Amber' },
  { hex: '#65a30d', name: 'Lime' },
  { hex: '#0ea5e9', name: 'Sky' },
  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#d97706', name: 'Orange' },
  { hex: '#f43f5e', name: 'Rose' },
  { hex: '#d946ef', name: 'Fuchsia' },
  { hex: '#06b6d4', name: 'Cyan' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#f59e0b', name: 'Yellow' },
  { hex: '#78716c', name: 'Stone' },
  { hex: '#ef4444', name: 'Red' },
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#84cc16', name: 'Chartreuse' },
  { hex: '#22d3ee', name: 'Aqua' },
  { hex: '#a855f7', name: 'Purple' },
  { hex: '#fbbf24', name: 'Apricot' },
  { hex: '#f472b6', name: 'Blush' },
  { hex: '#34d399', name: 'Mint' },
  { hex: '#fcd34d', name: 'Gold' },
  { hex: '#64748b', name: 'Slate' },
  { hex: '#e11d48', name: 'Crimson' },
  { hex: '#0891b2', name: 'Cerulean' },
  { hex: '#16a34a', name: 'Forest' },
  { hex: '#fca5a5', name: 'Coral' },
  { hex: '#8d8d8d', name: 'Taupe' },
  { hex: '#1e40af', name: 'Royal' },
  { hex: '#f5d0fe', name: 'Lilac' },
  { hex: '#78350f', name: 'Bronze' },
];

/**
 * A neutral gray color to be used as a fallback when a specific color is not available.
 */
export const DEFAULT_FALLBACK_COLOR = '#9CA3AF'; // gray-400

/**
 * Gets the name of a color from its hex code.
 *
 * @param hex The hex code of the color.
 * @returns The name of the color, or the hex code if no name is found.
 */
export const getColorName = (hex: string): string => {
  const color = PRESET_COLORS_DATA.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
  return color ? color.name : hex.toUpperCase();
};

/**
 * Generates a random color from a predefined set of accessible pastel colors.
 * This provides visual variety for new items without requiring user input.
 *
 * @returns A random hex color code (e.g., '#4f46e5').
 */
export const getRandomPresetColor = (): string => {
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * PRESET_COLORS_DATA.length);
  return PRESET_COLORS_DATA[randomIndex].hex;
};

/**
 * Determines if a color is light or dark based on YIQ formula.
 *
 * @param color The color in 6-digit hex format.
 * @returns `true` if the color is light, `false` if dark.
 */
export const isColorLight = (color: string | null): boolean => {
  const hexColor = color || DEFAULT_FALLBACK_COLOR;
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
};

/**
 * Appends an alpha value to a 6-digit hex color code to create an 8-digit hex code.
 *
 * @param hex The 6-digit hex color (e.g., '#RRGGBB').
 * @param alpha The alpha transparency value (0-1).
 * @returns The 8-digit hex color including alpha (e.g., '#RRGGBBAA').
 */
export const hexWithAlpha = (hex: string | null, alpha: number): string => {
  const hexColor = hex || DEFAULT_FALLBACK_COLOR;
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hexColor}${alphaHex}`;
};

// --- Session Cell Style Logic ---

const NORMAL_OPACITY = 0.8;
const DRAGGED_OPACITY = 0.4;
const BORDER_OPACITY = 1.0;

/**
 * Calculates the background color for a session cell.
 *
 * @param hex The base 6-digit hex color.
 * @param isDragged Whether the cell is currently being dragged.
 * @returns An 8-digit hex color string for the background.
 */
export const getSessionCellBgColor = (hex: string | null, isDragged: boolean): string => {
  const opacity = isDragged ? DRAGGED_OPACITY : NORMAL_OPACITY;
  return hexWithAlpha(hex, opacity);
};

/**
 * Calculates the border style for a session cell.
 *
 * @param hex The base 6-digit hex color.
 * @param isDragged Whether the cell is currently being dragged.
 * @returns A CSS border string or 'none'.
 */
export const getSessionCellBorderStyle = (hex: string | null, isDragged: boolean): string => {
  if (!isDragged) {
    return 'none';
  }
  const borderColor = hexWithAlpha(hex, BORDER_OPACITY);
  return `2px dashed ${borderColor}`;
};

/**
 * Determines the appropriate text color (black or white) for a given background color.
 *
 * @param backgroundColorHex The 6-digit hex code of the background.
 * @returns '#000000' (black) or '#FFFFFF' (white).
 */
export const getSessionCellTextColor = (backgroundColorHex: string | null): string => {
  return isColorLight(backgroundColorHex) ? '#000000' : '#FFFFFF';
};
