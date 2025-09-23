import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that combines class names using `clsx` and merges them with `tailwind-merge`.
 * This ensures that conflicting Tailwind CSS classes are handled properly.
 *
 * @param inputs - The class names to be combined and merged. Can be a combination of strings, objects, and arrays.
 * @returns A single string containing the merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
