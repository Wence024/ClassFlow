import React, { useState, useRef } from 'react';

let listeners: ((msg: string) => void)[] = [];

export function showNotification(msg: string) {
  listeners.forEach((fn) => fn(msg));
}

const AUTO_DISMISS_MS = 4000;

const Notification: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    listeners.push(setMessage);
    return () => {
      listeners = listeners.filter((fn) => fn !== setMessage);
    };
  }, []);

  React.useEffect(() => {
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
        ×
      </button>
    </div>
  );
};

export default Notification;