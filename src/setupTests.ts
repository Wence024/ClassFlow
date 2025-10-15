// Extends Jest's `expect` with custom matchers from jest-dom
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage for tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock localStorage globally
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock hasPointerCapture for Radix UI components
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}

// Mock scrollIntoView for Radix UI components
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Mock MutationObserver for testing-library's findBy queries
if (!global.MutationObserver) {
  global.MutationObserver = class MutationObserver {
    constructor(_callback: MutationCallback) {
      // Mock implementation
    }
    observe(_element: Element, _options?: MutationObserverInit) {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof MutationObserver;
}
