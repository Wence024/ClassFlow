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
];

/**
 * Generates a random color from a predefined set of accessible pastel colors.
 * This provides visual variety for new items without requiring user input.
 * @returns {string} A random hex color code (e.g., '#4f46e5').
 */
export const getRandomPresetColor = (): string => {
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * PRESET_COLORS.length);
  return PRESET_COLORS[randomIndex];
};
