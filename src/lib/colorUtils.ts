/**
 * An array of pleasant, moderately saturated pastel colors.
 * Sourced to ensure good contrast with dark text.
 */
const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#0d9488', // Teal
  '#db2777', // Pink
  '#ca8a04', // Amber
  '#65a30d', // Lime
  '#0ea5e9', // Sky
  '#8b5cf6', // Violet
  '#d97706', // Orange
  '#f43f5e', // Rose
  '#d946ef', // Fuchsia
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Yellow
  '#78716c', // Stone
  '#ef4444', // Red
  '#3b82f6', // Blue
];

/**
 * Generates a random color from a predefined set of accessible pastel colors.
 * This provides visual variety for new items without requiring user input.
 *
 * @returns A random hex color code (e.g., '#4f46e5').
 */
export const getRandomPresetColor = (): string => {
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * PRESET_COLORS.length);
  return PRESET_COLORS[randomIndex];
};

/**
 * Converts a hex color string to an RGBA string.
 *
 * @param hex The hex color string (e.g., "#RRGGBB" or "#RGB").
 * @param alpha The alpha transparency (0-1).
 * @returns The RGBA color string.
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex) return `rgba(128, 128, 128, ${alpha})`; // Default to gray

  let c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  const num = parseInt(c.join(''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Determines if a color is light or dark.
 * @param color The color in hex format.
 * @returns `true` if the color is light, `false` if dark.
 */
export const isColorLight = (color: string): boolean => {
  if (!color) return true;
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
};