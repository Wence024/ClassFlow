import React, { useState, useRef, useEffect } from 'react';
// Import the subscribe function from our new service
import { subscribe } from '../../lib/notificationsService';

const AUTO_DISMISS_MS = 4000;

// This component now has a single responsibility: displaying the notification UI.
const Notification: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Subscribe to the notification service when the component mounts.
    // The subscribe function returns a cleanup function (unsubscribe).
    const unsubscribe = subscribe(setMessage);

    // The cleanup function will be called when the component unmounts.
    return unsubscribe;
  }, []); // The empty dependency array ensures this runs only once.

  useEffect(() => {
    if (message) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setMessage(null), AUTO_DISMISS_MS);
    }
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
