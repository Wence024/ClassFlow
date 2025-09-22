import React, { useState, useRef, useEffect } from 'react';
import { subscribe } from '../../../lib/notificationsService';
import { toast } from "@/hooks/use-toast";

/** The duration in milliseconds for which the notification is visible before auto-dismissing. */
const AUTO_DISMISS_MS = 4000;

/**
 * A global notification component that displays messages from the `notificationsService`.
 * It automatically subscribes to the service on mount and displays notifications
 * as they are published. Now uses shadcn toast system.
 *
 * @returns A notification component.
 */
const Notification: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Subscribe to the notification service when the component mounts.
    const unsubscribe = subscribe((msg) => {
      setMessage(msg);
      if (msg) {
        toast({
          description: msg,
        });
      }
    });

    return unsubscribe;
  }, []);

  // Effect to handle auto-dismissal of the notification.
  useEffect(() => {
    if (message) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setMessage(null), AUTO_DISMISS_MS);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [message]);

  // Return null since we're using toast now
  return null;
};

export default Notification;
