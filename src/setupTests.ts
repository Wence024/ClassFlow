// Extends Jest's `expect` with custom matchers from jest-dom
import '@testing-library/jest-dom';

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
    constructor(callback) {
      this.callback = callback;
    }
    observe(element, options) {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}
