import { describe, it, expect } from 'vitest';
import { getRandomPresetColor } from '../colorUtils';

describe('getRandomPresetColor', () => {
  it('should return a string that starts with #', () => {
    const color = getRandomPresetColor();
    expect(typeof color).toBe('string');
    expect(color.startsWith('#')).toBe(true);
  });

  it('should return a valid 7-character hex code', () => {
    const color = getRandomPresetColor();
    expect(color.length).toBe(7);
    // Regex to check for a valid hex color (# followed by 6 hex characters)
    expect(/^#[0-9a-f]{6}$/i.test(color)).toBe(true);
  });

  /**
   * This test verifies that the function is not stuck returning the same value.
   * By generating 5 colors and adding them to a Set, we can check for uniqueness.
   * We expect the size of the Set to be greater than 1, which proves that at least
   * two different colors were generated.
   */
  it('should return different colors on subsequent calls (highly likely)', () => {
    const generatedColors = new Set<string>();
    const numberOfTries = 5;

    for (let i = 0; i < numberOfTries; i++) {
      generatedColors.add(getRandomPresetColor());
    }

    // This assertion checks that out of 5 tries, we got at least 2 unique colors.
    // It's a robust way to test for randomness without being flaky, as a small
    // number of collisions is statistically possible, but getting only 1 unique
    // color in 5 tries is astronomically unlikely.
    expect(generatedColors.size).toBeGreaterThan(1);
  });
});
