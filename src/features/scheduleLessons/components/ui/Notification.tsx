import React, { useState } from 'react';

let listeners: ((msg: string) => void)[] = [];

export function showNotification(msg: string) {
  listeners.forEach((fn) => fn(msg));
}

const Notification: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  React.useEffect(() => {
    listeners.push(setMessage);
    return () => {
      listeners = listeners.filter((fn) => fn !== setMessage);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-4">
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