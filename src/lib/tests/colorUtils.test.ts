import { describe, it, expect } from 'vitest';
import {
  getRandomPresetColor,
  PRESET_COLORS_DATA,
  getColorName,
  isColorLight,
  hexWithAlpha,
  getSessionCellBgColor,
  getSessionCellBorderStyle,
  getSessionCellTextColor,
} from '../colorUtils';

describe('colorUtils', () => {
  describe('getRandomPresetColor', () => {
    it('should return a string that starts with #', () => {
      const color = getRandomPresetColor();
      expect(typeof color).toBe('string');
      expect(color.startsWith('#')).toBe(true);
    });

    it('should return a valid 7-character hex code', () => {
      const color = getRandomPresetColor();
      expect(color.length).toBe(7);
      expect(/^#[0-9a-f]{6}$/i.test(color)).toBe(true);
    });

    it('should return a color from the preset colors data', () => {
      const color = getRandomPresetColor();
      const presetHexs = PRESET_COLORS_DATA.map((c) => c.hex);
      expect(presetHexs).toContain(color);
    });
  });

  describe('getColorName', () => {
    it('should return the correct name for a preset color', () => {
      expect(getColorName('#4f46e5')).toBe('Indigo');
      expect(getColorName('#3b82f6')).toBe('Blue');
    });

    it('should be case-insensitive for the input hex', () => {
      expect(getColorName('#4F46E5')).toBe('Indigo');
    });

    it('should return the uppercase hex code for a non-preset color', () => {
      expect(getColorName('#123456')).toBe('#123456');
    });
  });

  describe('isColorLight', () => {
    it('should return true for light colors', () => {
      expect(isColorLight('#ffffff')).toBe(true);
      expect(isColorLight('#f59e0b')).toBe(true); // Yellow
    });

    it('should return false for dark colors', () => {
      expect(isColorLight('#000000')).toBe(false);
      expect(isColorLight('#4f46e5')).toBe(false); // Indigo
    });
  });

  describe('hexWithAlpha', () => {
    it('should append alpha hex to a color', () => {
      expect(hexWithAlpha('#ffffff', 1)).toBe('#ffffffff');
      expect(hexWithAlpha('#000000', 0)).toBe('#00000000');
      expect(hexWithAlpha('#ff0000', 0.5)).toBe('#ff000080');
    });

    it('should default to gray for null hex', () => {
      // @ts-expect-error testing invalid input
      expect(hexWithAlpha(null, 1)).toBe('#808080ff');
    });
  });

  describe('Session Cell Style Logic', () => {
    const testColor = '#ef4444'; // Red

    describe('getSessionCellBgColor', () => {
      it('should return normal opacity color when not dragged', () => {
        expect(getSessionCellBgColor(testColor, false)).toBe('#ef4444cc'); // 0.8 alpha
      });
      it('should return dragged opacity color when dragged', () => {
        expect(getSessionCellBgColor(testColor, true)).toBe('#ef444466'); // 0.4 alpha
      });
    });

    describe('getSessionCellBorderStyle', () => {
      it('should return "none" when not dragged', () => {
        expect(getSessionCellBorderStyle(testColor, false)).toBe('none');
      });
      it('should return a dashed border style when dragged', () => {
        const expectedBorderColor = hexWithAlpha(testColor, 1.0);
        expect(getSessionCellBorderStyle(testColor, true)).toBe(
          `2px dashed ${expectedBorderColor}`
        );
      });
    });

    describe('getSessionCellTextColor', () => {
      it('should return black for light colors', () => {
        expect(getSessionCellTextColor('#f59e0b')).toBe('#000000'); // Yellow
      });
      it('should return white for dark colors', () => {
        expect(getSessionCellTextColor('#4f46e5')).toBe('#FFFFFF'); // Indigo
      });
    });
  });
});
