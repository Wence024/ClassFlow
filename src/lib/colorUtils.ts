export const PRESET_COLORS_DATA = [
  { hex: '#4f46e5', name: 'Indigo' },
  { hex: '#0d9488', name: 'Teal' },
  { hex: '#db2777', name: 'Pink' },
  { hex: '#dbbe06', name: 'Amber' },
  { hex: '#65a30d', name: 'Lime' },
  { hex: '#0ea5e9', name: 'Sky' },
  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#db9600', name: 'Orange' },
  { hex: '#f43f5e', name: 'Rose' },
  { hex: '#d946ef', name: 'Fuchsia' },
  { hex: '#06b6d4', name: 'Cyan' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#f1f50b', name: 'Yellow' },
  { hex: '#78716c', name: 'Stone' },
  { hex: '#ef4444', name: 'Red' },
  { hex: '#3b82f6', name: 'Blue' },
];

/**
 * Gets the name of a color from its hex code.
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
