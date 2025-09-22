import React, { useState, useRef, useEffect } from 'react';
import { subscribe } from '../../../lib/notificationsService';

/** The duration in milliseconds for which the notification is visible before auto-dismissing. */
const AUTO_DISMISS_MS = 4000;

/**
 * A global notification component that displays messages from the `notificationsService`.
 * It automatically subscribes to the service on mount and displays notifications
 * as they are published. It is designed to be placed once in the root layout (e.g., App.tsx).
 *
 * @returns A notification component.
 */
const Notification: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Subscribe to the notification service when the component mounts.
    // The subscribe function returns an unsubscribe function for cleanup.
    const unsubscribe = subscribe(setMessage);

    // The returned function will be called when the component unmounts.
    return unsubscribe;
  }, []); // The empty dependency array ensures this effect runs only once.

  // Effect to handle auto-dismissal of the notification.
  useEffect(() => {
    if (message) {
      // Clear any existing timeout.
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Set a new timeout to clear the message.
      timeoutRef.current = setTimeout(() => setMessage(null), AUTO_DISMISS_MS);
    }
    // Cleanup function to clear the timeout if the component unmounts or the message changes.
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [message]);

  if (!message) return null;

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-4"
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      <button
        type="button"
        className="ml-4 text-white font-bold text-lg focus:outline-none"
        onClick={() => setMessage(null)}
        aria-label="Dismiss notification"
      >
        x
      </button>
    </div>
  );
};

export default Notification;
