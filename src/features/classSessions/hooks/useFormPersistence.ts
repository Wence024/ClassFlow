import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';

const FORM_STORAGE_KEY = 'classSessionFormData';

/**
 * Hook to persist form data to localStorage and restore it on mount.
 * 
 * @param fp Form methods from react-hook-form.
 * @param fp.formMethods - The form methods object.
 * @param fp.isEditing - Whether the form is in editing mode.
 */
export const useFormPersistence = <T extends Record<string, unknown>>({
  formMethods,
  isEditing,
}: {
  formMethods: UseFormReturn<T>;
  isEditing: boolean;
}) => {
  const { watch, reset } = formMethods;

  // Load persisted data on mount (only when not editing)
  useEffect(() => {
    if (!isEditing) {
      try {
        const stored = localStorage.getItem(FORM_STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          reset(data);
        }
      } catch (error) {
        console.error('Failed to load persisted form data:', error);
      }
    }
  }, [isEditing, reset]);

  // Save form data to localStorage on change (only when not editing)
  useEffect(() => {
    if (isEditing) {
      return;
    }

    const subscription = watch((value) => {
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to persist form data:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, isEditing]);

  /**
   * Clear persisted form data from localStorage.
   */
  const clearPersistedData = () => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear persisted form data:', error);
    }
  };

  return { clearPersistedData };
};
